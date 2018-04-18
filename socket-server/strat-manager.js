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

        new CronJob(`28 6 * * *`, () => this.newDay, null, true);

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
        compareDate.setMinutes(27);
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
            this.curDate  = dateStr;
        }

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
        const newPMs = await this.createPredictionModels();
        await jsonMgr.save(todayPMpath, newPMs);
        return newPMs;
    },
    async refreshPredictionModels() {
        // set predictionmodels
        const todayPMpath = `./prediction-models/${this.curDate}.json`;
        try {
            var foundDayPMs = await jsonMgr.get(todayPMpath);
        } catch (e) { }
        console.log('found pms', foundDayPMs);
        this.strategies = foundDayPMs ? foundDayPMs : await this.createAndSaveNewPredictionModels(todayPMpath);
    },
    async refreshPastData() {
        const stratPerfData = await stratPerfOverall(this.Robinhood, false, 5);
        await this.setPastData(stratPerfData);
    },
    async createPredictionModels() {

        const stratPerfData = await stratPerfOverall(this.Robinhood, false, 5);
        const mapNames = strats => strats.map(({ name }) => name);
        const getFirstN = (strats, n) => strats.slice(0, n);
        const createPerms = (set, name, picks) => {
            return set.reduce((acc, val) => ({
                ...acc,
                [`${name}First${val}`]: getFirstN(picks, val)
            }), {});
        };

        const stratPerf4IncToday = await stratPerfOverall(this.Robinhood, true, 4, 2);
        const stratPerf2IncToday = await stratPerfOverall(this.Robinhood, true, 2, 2);
        const stratPerf10IncToday = await stratPerfOverall(this.Robinhood, true, 10, 7);


        const stratPerf12Day = await stratPerfOverall(this.Robinhood, false, 12, 5);
        const stratPerf3DayCount1 = await stratPerfOverall(this.Robinhood, false, 3, 1);
        const stratPerf3DayCount2 = await stratPerfOverall(this.Robinhood, false, 3, 2);
        const stratPerf2Day = await stratPerfOverall(this.Robinhood, false, 2);
        const stratPerfDayBeforeYesterday = await stratPerfOverall(this.Robinhood, false, 1, 1, true);
        const stratPerf2DayBeforeYesterday = await stratPerfOverall(this.Robinhood, false, 2, 1, true);
        const stratPerfYesterday = await stratPerfOverall(this.Robinhood, false, 1);

        const filteredCount = trend => trend.filter(strat => {
            // console.log('STRATMAN', strat);
            return strat.count >= 5 && strat.count <= 6;
        });
        const curOverallPredictions = await predictCurrent();
        const curOverallFilteredPredictions = await predictCurrent(null, strategies => {
            return strategies.length > 3 && strategies.every(trend => trend > -1);
        });
        const cur8DayPredictions = await predictCurrent(8);
        const cur5DayPredictions = await predictCurrent(5);
        const cur3DayPredictions = await predictCurrent(3);
        console.log('calculate daysbeforeyest')
        const dayBeforeYesterdayPredictions = await predictCurrent(1, null, 1);
        const yesterdayPredictions = await predictCurrent(1);
        let strategies = {
            // vip: strategiesEnabled.purchase,
            ...createPerms([3, 1], '12DayByAvgPerc', mapNames(filteredCount(stratPerf12Day.sortedByAvgTrend))),
            ...createPerms([3, 1], '12DayByPercUp', mapNames(filteredCount(stratPerf12Day.sortedByPercUp))),
            // ...createPerms([10, 5, 3, 1], '5DayByAvgPerc', mapNames(stratPerfData.sortedByAvgTrend)),
            // ...createPerms([10, 5, 3, 1], '5DayByPercUp', mapNames(stratPerfData.sortedByPercUp)),
            // ...createPerms([10, 5, 3, 1], '3DayCount1ByAvgPerc', mapNames(stratPerf3DayCount1.sortedByAvgTrend)),
            // ...createPerms([10, 5, 3, 1], '3DayCount1DayByPercUp', mapNames(stratPerf3DayCount1.sortedByPercUp)),
            // ...createPerms([10, 5, 3, 1], '3DayCount2ByAvgPerc', mapNames(stratPerf3DayCount2.sortedByAvgTrend)),
            // ...createPerms([10, 5, 3, 1], '3DayCount2ByPercUp', mapNames(stratPerf3DayCount2.sortedByPercUp)),
            // ...createPerms([10, 5, 3, 1], '2DayByAvgPerc', mapNames(stratPerf2Day.sortedByAvgTrend)),
            // ...createPerms([10, 5, 3, 1], '2DayByPercUp', mapNames(stratPerf2Day.sortedByPercUp)),
            ...createPerms([10, 5, 3, 1], 'YesterdayByAvgPerc', mapNames(stratPerfYesterday.sortedByAvgTrend)),
            ...createPerms([10, 5, 3, 1], 'YesterdayByPercUp', mapNames(stratPerfYesterday.sortedByPercUp)),

            ...createPerms([10, 5, 3, 1], 'dayBeforeYesterdayByAvgPerc', mapNames(stratPerfDayBeforeYesterday.sortedByAvgTrend)),
            ...createPerms([10, 5, 3, 1], 'dayBeforeYesterdayByPercUp', mapNames(stratPerfDayBeforeYesterday.sortedByPercUp)),
            ...createPerms([10, 5, 3, 1], '2DayBeforeYesterdayByAvgPerc', mapNames(stratPerf2DayBeforeYesterday.sortedByAvgTrend)),
            ...createPerms([10, 5, 3, 1], '2DayBeforeYesterdayByPercUp', mapNames(stratPerf2DayBeforeYesterday.sortedByPercUp)),

            ...createPerms([5, 3, 1], '5DayByAvgPerc', mapNames(stratPerfData.sortedByAvgTrend)),
            ...createPerms([5, 3, 1], '5DayByPercUp', mapNames(stratPerfData.sortedByPercUp)),

            // including todays
            ...createPerms([10, 5, 3], 'stratPerf4IncTodayAvgPerc', mapNames(stratPerf4IncToday.sortedByAvgTrend)),
            ...createPerms([10, 5, 3], 'stratPerf4IncTodayPercUp', mapNames(stratPerf4IncToday.sortedByPercUp)),
            ...createPerms([10, 5, 3], 'stratPerf2IncTodayAvgPerc', mapNames(stratPerf2IncToday.sortedByAvgTrend)),
            ...createPerms([10, 5, 3], 'stratPerf2IncTodayPercUp', mapNames(stratPerf2IncToday.sortedByPercUp)),
            ...createPerms([10, 5, 3], 'stratPerf10IncTodayAvgPerc', mapNames(stratPerf10IncToday.sortedByAvgTrend)),
            ...createPerms([10, 5, 3], 'stratPerf10IncTodayPercUp', mapNames(stratPerf10IncToday.sortedByPercUp)),

            ...strategiesEnabled.extras,



            // ...createPerms([50, 30, 20, 10, 5, 3, 1], 'myPredictionModel', curOverallPredictions.myPredictions),
            // ...createPerms([50, 30, 20, 10, 5, 3, 1], 'brainPredictionModel-', curOverallPredictions.brainPredictions),
            ...createPerms([10, 5, 3, 1], 'myFilteredPredictionModel', curOverallFilteredPredictions.myPredictions),
            ...createPerms([10, 5, 3, 1], 'brainFilteredPredictionModel-', curOverallFilteredPredictions.brainPredictions),


            ...createPerms([5, 3, 1], 'dayBeforeYesterdaymyPredictionModel', dayBeforeYesterdayPredictions.myPredictions),
            ...createPerms([5, 3, 1], 'dayBeforeYesterdaybrainPredictionModel-', dayBeforeYesterdayPredictions.brainPredictions),

            ...createPerms([5, 3, 1], 'yesterdayMyPredictionModel', yesterdayPredictions.myPredictions),
            ...createPerms([5, 3, 1], 'yesterdayBrainPredictionModel-', yesterdayPredictions.brainPredictions),




            // ...createPerms([50, 30, 20, 10, 5, 3, 1], 'myPredictionModel-8day-', cur8DayPredictions.myPredictions),
            // ...createPerms([50, 30, 20, 10, 5, 3, 1], 'brainPredictionModel-8day-', cur8DayPredictions.brainPredictions),
            // ...createPerms([50, 30, 20, 10, 5, 3, 1], 'myPredictionModel-5-day-', cur5DayPredictions.myPredictions),
            // ...createPerms([50, 30, 20, 10, 5, 3, 1], 'brainPredictionModel-5-day-', cur5DayPredictions.brainPredictions),
            // ...createPerms([50, 30, 20, 10, 5, 3, 1], 'myPredictionModel-3-day-', cur3DayPredictions.myPredictions),
            // ...createPerms([50, 30, 20, 10, 5, 3, 1], 'brainPredictionModel-3-day-', cur3DayPredictions.brainPredictions),
        };

        return {
            ...strategies,
            forPurchase: flatten(strategiesEnabled.forPurchase.map(strat => {
                return strat.startsWith('[') ? strategies[strat.substring(1, strat.length - 1)] : strat;
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
        console.log(JSON.stringify(relatedPrices, null, 2));
    }
};

module.exports = stratManager;
