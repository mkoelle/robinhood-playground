const { lookupTickers } = require('../app-actions/record-strat-perfs');
const jsonMgr = require('../utils/json-mgr');
const { CronJob } = require('cron');
const fs = require('mz/fs');
const strategiesEnabled = require('../strategies-enabled');
const stratPerfOverall = require('../analysis/strategy-perf-overall');
const { predictCurrent, stratPerfPredictions } = require('../app-actions/predict-top-performing');
const getTrend = require('../utils/get-trend');
const avgArray = require('../utils/avg-array');
const sendEmail = require('../utils/send-email');

const formatDate = date => date.toLocaleDateString().split('/').join('-');
const getToday = () => formatDate(new Date());

const flatten = list => list.reduce(
  (a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []
);

const stratManager = {
    Robinhood: null,
    io: null,
    picks: [],
    relatedPrices: {},
    curDate: null,

    async init(io) {
        this.Robinhood = global.Robinhood;
        this.io = io;

        // init picks?
        await this.refreshPastData();
        await this.initPicksAndPMs();
        await this.getRelatedPrices();
        await this.sendStrategyReport();
        console.log('initd strat manager');

        new CronJob(`25 6 * * 1-5`, () => this.newDay, null, true);

        setInterval(() => this.getRelatedPrices(), 40000);
    },
    getWelcomeData() {
        return {
            curDate: this.curDate,
            picks: this.picks,
            relatedPrices: this.relatedPrices,
            pastData: this.pastData,
            strategies: this.strategies
        };
    },
    newPick(data) {
        // console.log('new pick', data);
        if (this.curDate !== getToday()) {
            return;
        }
        this.picks.push(data);
        this.sendToAll('server:picks-data', data);
    },
    getAllPicks() {
        return this.picks;
    },
    sendToAll(eventName, data) {
        // console.log('sending to all', eventName, data);
        this.io.emit(eventName, data);
    },
    async newDay() {
        console.log('NEW DAY')
        await this.getRelatedPrices();
        await this.sendStrategyReport();
        await this.refreshPastData();
        this.picks = [];
        await this.initPicksAndPMs();
        await this.getRelatedPrices();
        this.sendToAll('server:welcome', this.getWelcomeData());
    },
    async initPicksAndPMs() {
        // calc current date
        const now = new Date();
        const compareDate = new Date();
        compareDate.setHours(6);
        compareDate.setMinutes(25);
        if (compareDate - now > 0) {
            now.setDate(now.getDate() - 1);
        }
        const day = now.getDay();
        const isWeekday = day >= 1 && day <= 5;
        const dateStr = formatDate(now);

        const hasPicksData = await fs.exists(`./picks-data/${dateStr}`);
        if (!isWeekday || hasPicksData) {
            // from most recent day (weekend will get friday)
            await this.initPicks();
        } else {
            this.curDate = dateStr;
        }
        console.log('cur date now', this.curDate);
        await this.refreshPredictionModels();
    },
    async initPicks(dateStr) {
        console.log('init picks')
        const picks = [];

        let folders = await fs.readdir('./picks-data');
        let sortedFolders = folders.sort((a, b) => {
            return new Date(a) - new Date(b);
        });

        const mostRecentDay = sortedFolders[sortedFolders.length - 1];
        console.log('mostRecentDay', mostRecentDay);
        this.curDate = mostRecentDay;
        let files = await fs.readdir(`./picks-data/${mostRecentDay}`);
        for (let file of files) {
            const strategyName = file.split('.')[0];
            const obj = await jsonMgr.get(`./picks-data/${mostRecentDay}/${file}`);
            for (let min of Object.keys(obj)) {
                // for each strategy run
                picks.push({
                    stratMin: `${strategyName}-${min}`,
                    withPrices: obj[min]
                });
            }
        }

        this.picks = picks;
    },
    async sendStrategyReport() {
        console.log('sending strategy report');
        // console.log('STRATS HERE', this.strategies);
        const strategyReport = Object.entries(this.strategies).map(entry => {
            const [ stratName, trends ] = entry;
            console.log('stratname', stratName);
            console.log(trends, 'trends');
            // const foundStrategies = trends
            //     .filter(stratMin => {
            //         return stratMin.withPrices;
            //     });
            // console.log('found count', foundStrategies.length);
            let foundStrategies = trends
                .map(stratMin => {
                    const foundStrategy = this.picks.find(pick => pick.stratMin === stratMin);
                    console.log('foundStrategy', foundStrategy);
                    if (!foundStrategy) return null;
                    console.log('found strategy', foundStrategy);
                    const { withPrices } = foundStrategy;
                    if (typeof withPrices[0] === 'string') return;
                    console.log('withprices', withPrices);
                    const withTrend = withPrices.map(stratObj => {
                        console.log('stratobj', stratObj);
                        const { lastTradePrice, afterHourPrice } = this.relatedPrices[stratObj.ticker];
                        const nowPrice = afterHourPrice || lastTradePrice;
                        return {
                            ticker: stratObj.ticker,
                            thenPrice: stratObj.price,
                            nowPrice,
                            trend: getTrend(nowPrice, stratObj.price)
                        };
                    });
                    const avgTrend = avgArray(
                        withTrend.map(obj => obj.trend)
                    );
                    // console.log('avg', avgTrend);
                    return avgTrend;
                });
            const overallAvg = avgArray(foundStrategies.filter(val => !!val));
            console.log(stratName, 'overall', overallAvg);
            return {
                stratName,
                avgTrend: overallAvg
            };
        }).filter(t => !!t.avgTrend).sort((a, b) => Number(b.avgTrend) - Number(a.avgTrend))
        console.log('stratrepo', strategyReport);
        const emailFormatted = strategyReport.map(strat => {
            return `${strat.avgTrend.toFixed(2)}% ${strat.stratName}`;
        }).join('\n');
        await sendEmail(`robinhood-playground: 24hr report for ${this.curDate}`, emailFormatted);

    },
    async createAndSaveNewPredictionModels(todayPMpath) {
        console.log('creating new prediction models');
        const newPMs = await this.createPredictionModels();
        await jsonMgr.save(todayPMpath, newPMs);
        return newPMs;
    },
    async refreshPredictionModels() {
        console.log('refreshing prediction models');
        // set predictionmodels
        const todayPMpath = `./prediction-models/${this.curDate}.json`;
        try {
            var foundDayPMs = await jsonMgr.get(todayPMpath);
        } catch (e) { }
        console.log('found pms', foundDayPMs);
        this.strategies = foundDayPMs ? foundDayPMs : await this.createAndSaveNewPredictionModels(todayPMpath);
    },
    async refreshPastData() {
        console.log('refreshing past data');
        const stratPerfData = await stratPerfOverall(this.Robinhood, false, 5);
        await this.setPastData(stratPerfData);
    },
    async createPredictionModels() {
        console.log('TESTING')

        const stratPerfData = await stratPerfOverall(this.Robinhood, false, 5);
        const mapNames = strats => strats.map(({ name }) => name);
        const getFirstN = (strats, n) => strats.slice(0, n);
        const createPerms = (set, name, picks) => {
            return set.reduce((acc, val) => ({
                ...acc,
                [`${name}-first${val}`]: getFirstN(picks, val)
            }), {});
        };

        const uniq5day = await stratPerfPredictions(this.Robinhood, false, 5);
        const uniq5dayCount2 = await stratPerfPredictions(this.Robinhood, false, 5, 2);
        const uniq5dayCount3 = await stratPerfPredictions(this.Robinhood, false, 5, 3);
        const uniq5dayCount4 = await stratPerfPredictions(this.Robinhood, false, 5, 4);

        const uniqIncToday5dayCount3 = await stratPerfPredictions(this.Robinhood, true, 5, 3);
        const uniqIncToday5dayCount4 = await stratPerfPredictions(this.Robinhood, true, 5, 4);
        const uniqIncToday5dayCount5 = await stratPerfPredictions(this.Robinhood, true, 5, 5);
        const uniqIncToday7dayCount5 = await stratPerfPredictions(this.Robinhood, true, 7, 5);


        const uniq4IncToday = await stratPerfPredictions(this.Robinhood, true, 4, 2);
        const uniq4IncTodayCount2 = await stratPerfPredictions(this.Robinhood, true, 4, 2);
        const uniq10IncTodayCount6 = await stratPerfPredictions(this.Robinhood, true, 10, 6);
        const uniq12Count5 = await stratPerfPredictions(this.Robinhood, true, 12, 5);
        const uniqYesterday = await stratPerfPredictions(this.Robinhood, false, 1);

        const createPermsForObj = (set, name, stratPerf) => {
            return Object.keys(stratPerf).reduce((acc, val) => ({
                ...acc,
                ...createPerms(set, `${name}-${val}`, stratPerf[val])
            }), {});
        };

        const filteredCount = trend => trend.filter(strat => {
            // console.log('STRATMAN', strat);
            return strat.count >= 5 && strat.count <= 6;
        });

        const curOverallPredictions = await predictCurrent();
        const curOverallFilteredPredictions = await predictCurrent(null, strategies => {
            return strategies.length > 3 && strategies.every(trend => trend > -1);
        });
        const dayBeforeYesterdayPredictions = await predictCurrent(1, null, 1);
        const yesterdayPredictions = await predictCurrent(1);
        let strategies = {

            ...createPermsForObj([10, 5, 3, 1], '5day', uniq5day),
            ...createPermsForObj([10, 5, 3, 1], '5dayCount2', uniq5dayCount2),
            ...createPermsForObj([10, 5, 3, 1], '5dayCount3', uniq5dayCount3),
            ...createPermsForObj([10, 5, 3, 1], '5dayCount4', uniq5dayCount4),
            ...createPermsForObj([10, 5, 3, 1], '5dayCount2', uniq5dayCount2),

            ...createPermsForObj([10, 5, 3, 1], '5IncTodayCount3', uniqIncToday5dayCount3),
            ...createPermsForObj([10, 5, 3, 1], '5IncTodayCount4', uniqIncToday5dayCount4),
            ...createPermsForObj([10, 5, 3, 1], '5IncTodayCount5', uniqIncToday5dayCount5),
            ...createPermsForObj([10, 5, 3, 1], '7IncTodayCount5', uniqIncToday7dayCount5),

            ...createPermsForObj([10, 5, 3, 1], '4IncToday', uniq4IncToday),
            ...createPermsForObj([10, 5, 3, 1], '4IncTodayCount2', uniq4IncTodayCount2),

            ...createPermsForObj([10, 5, 3, 1], '10IncTodayCount6', uniq10IncTodayCount6),
            ...createPermsForObj([10, 5, 3, 1], '12Count5', uniq12Count5),
            ...createPermsForObj([10, 5, 3, 1], 'Yesterday', uniqYesterday),

            ...strategiesEnabled.extras,

            // ...createPerms([50, 30, 20, 10, 5, 3, 1], 'myPredictionModel', curOverallPredictions.myPredictions),
            // ...createPerms([50, 30, 20, 10, 5, 3, 1], 'brainPredictionModel-', curOverallPredictions.brainPredictions),


            ...createPermsForObj([10, 5, 3, 1], 'curOverallPredictions', curOverallPredictions),
            ...createPermsForObj([10, 5, 3, 1], 'curOverallFilteredPredictions', curOverallFilteredPredictions),
            ...createPermsForObj([10, 5, 3, 1], 'dayBeforeYesterdayPredictions', dayBeforeYesterdayPredictions),
            ...createPermsForObj([10, 5, 3, 1], 'yesterdayPredictions', yesterdayPredictions),

        };

        return {
            ...strategies,
            forPurchase: flatten(strategiesEnabled.forPurchase.map(strat => {
                return strat && strat.startsWith('[') ? strategies[strat.substring(1, strat.length - 1)] : strat;
            }))
        };
    },
    async setPastData(stratPerfData) {
        const stratPerfObj = {};
        stratPerfData.sortedByAvgTrend.forEach(({
            name,
            avgTrend,
            count,
            percUp
        }) => {
            stratPerfObj[name] = {
                avgTrend,
                percUp,
                count
            };
        });
        this.pastData = {
            fiveDay: stratPerfObj
        };
    },
    async getRelatedPrices() {
        // console.log(this.picks);
        let tickersToLookup = flatten(this.picks.map(pick => {
            return pick.withPrices.map(tickerObj => tickerObj.ticker);
        }));
        tickersToLookup = [...new Set(tickersToLookup)];     // uniquify duplicate tickers
        console.log('getting related prices', tickersToLookup.length);
        const relatedPrices = await lookupTickers(
            this.Robinhood,
            tickersToLookup,
            true
        );
        this.relatedPrices = relatedPrices;
        this.sendToAll('server:related-prices', relatedPrices);
        console.log('done getting related prices');
        // console.log(JSON.stringify(relatedPrices, null, 2));
    }
};

module.exports = stratManager;
