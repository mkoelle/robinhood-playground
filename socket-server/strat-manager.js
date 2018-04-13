const { lookupTickers } = require('../app-actions/record-strat-perfs');
const jsonMgr = require('../utils/json-mgr');
const { CronJob } = require('cron');
const fs = require('mz/fs');
const strategiesEnabled = require('../strategies-enabled');
const stratPerfOverall = require('../analysis/strategy-perf-overall');
const { predictCurrent } = require('../app-actions/predict-top-performing');
const getTrend = require('../utils/get-trend');
const avgArray = require('../utils/avg-array');
const sendEmail = require('../utils/send-email');

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
        const curDate = new Date();
        const day = curDate.getDay();
        const isWeekday = day >= 1 && day <= 5;
        const now = new Date();
        const compareDate = new Date();
        compareDate.setHours(6);
        compareDate.setMinutes(39);
        if (compareDate - now > 0) {
            now.setDate(now.getDate()-1);
        }
        const dateStr = (now).toLocaleDateString().split('/').join('-');
        const hasPicksData = await fs.exists(`./picks-data/${dateStr}`);
        if (!isWeekday || hasPicksData) {
            // from most recent day (weekend will get friday)
            await this.initPicks();
        }
        console.log(day, 'hasPicksData', hasPicksData);

        await this.refreshPastData();
        await this.getRelatedPrices();
        await this.sendStrategyReport();
        console.log('initd strat manager');

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
        if (this.curDate !== (new Date()).toLocaleDateString().split('/').join('-')) {
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
        await this.refreshPastData();  // and generates new strategies based upon pased data
        await this.initPicks();
        await this.getRelatedPrices();
        this.sendToAll('server:welcome', this.getWelcomeData());
    },
    async initPicks() {
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
        const strategyReport = Object.entries(this.strategies).map(entry => {
            const [ stratName, trends ] = entry;
            console.log('stratname', stratName);
            console.log(trends, 'trends');
            const foundStrategies = trends.map(stratMin => {
                const foundStrategy = this.picks.find(pick => pick.stratMin === stratMin);
                console.log('foundStrategy', foundStrategy);
                if (!foundStrategy) return null;
                const { withPrices } = foundStrategy;
                const withTrend = withPrices.map(stratObj => {
                    const nowPrice = this.relatedPrices[stratObj.ticker].lastTradePrice;
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
                console.log('avg', avgTrend);
                return avgTrend;
            });
            const overallAvg = avgArray(foundStrategies.filter(val => !!val));
            console.log('overall', overallAvg);
            return {
                stratName,
                avgTrend: overallAvg.toFixed(2) + '%'
            };
        });
        await sendEmail(`robinhood-playground: 24hr report for ${this.curDate}`, JSON.stringify(strategyReport, null, 2));

    },
    async refreshPastData() {
        const stratPerfData = await stratPerfOverall(this.Robinhood, false, 5);
        await this.setStrategies(stratPerfData);
        await this.setPastData(stratPerfData);
    },
    async setStrategies(stratPerfData) {
        const mapNames = strats => strats.map(({ name }) => name);
        const getFirstN = (strats, n) => strats.slice(0, n);
        const createPerms = (set, name, picks) => {
            return set.reduce((acc, val) => ({
                ...acc,
                [`${name}First${val}`]: getFirstN(picks, val)
            }), {});
        };

        const curPredictions = await predictCurrent();
        this.strategies = {
            vip: strategiesEnabled.purchase,
            ...createPerms([10, 3, 1], 'fiveDayByAvgPerc', mapNames(stratPerfData.sortedByAvgTrend)),
            ...createPerms([10, 3, 1], 'fiveDayByPercUp', mapNames(stratPerfData.sortedByPercUp)),
            ...strategiesEnabled.extras,
            ...createPerms([50, 30, 20, 10, 5, 3, 1], 'myPredictionModel', curPredictions.myPredictions),
            ...createPerms([50, 30, 20, 10, 5, 3, 1], 'brainPredictionModel', curPredictions.brainPredictions),
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
        const flatten = list => list.reduce(
          (a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []
        );
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
    }
};

module.exports = stratManager;
