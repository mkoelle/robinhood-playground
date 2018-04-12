const { lookupTickers } = require('../app-actions/record-strat-perfs');
const jsonMgr = require('../utils/json-mgr');
const { CronJob } = require('cron');
const fs = require('mz/fs');
const strategiesEnabled = require('../strategies-enabled');
const stratPerfOverall = require('../analysis/strategy-perf-overall');
const { predictCurrent } = require('../app-actions/predict-top-performing');

const initPicks = async () => {

    const picks = [];

    let folders = await fs.readdir('./picks-data');
    let sortedFolders = folders.sort((a, b) => {
        return new Date(a) - new Date(b);
    });
    console.log(sortedFolders);
    const mostRecentDay = sortedFolders[sortedFolders.length - 1];
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

    return picks;
};


const stratManager = {
    Robinhood: null,
    io: null,
    picks: [],
    relatedPrices: {},

    async init(io) {
        this.Robinhood = global.Robinhood;
        this.io = io;

        // init picks?
        const curDate = new Date();
        const day = curDate.getDay();
        const isWeekday = day >= 1 && day <= 5;
        const dateStr = (new Date()).toLocaleDateString().split('/').join('-');
        const hasPicksData = await fs.exists(`./picks-data/${dateStr}`);
        if (!isWeekday || hasPicksData) {
            // from most recent day (weekend will get friday)
            this.picks = await initPicks();
        }
        console.log(day, hasPicksData);


        await this.refreshPastData();
        await this.getRelatedPrices();
        console.log('initd strat manager');

        new CronJob('0 0 * * 1-5', () => {
            console.log('New day!');
            this.picks = [];
            this.relatedPrices = {};
            this.sendToAll('server:welcome', this.getWelcomeData());
        }, null, true);
        setInterval(() => this.getRelatedPrices(), 40000);
    },
    getWelcomeData() {
        return {
            picks: this.picks,
            relatedPrices: this.relatedPrices,
            pastData: this.pastData,
            strategies: this.strategies
        };
    },
    newPick(data) {
        // console.log('new pick', data);
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
            ...createPerms([20, 10, 3, 1], 'myPredictionModel', curPredictions.myPredictions),
            ...createPerms([20, 10, 3, 1], 'brainPredictionModel', curPredictions.brainPredictions),
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
            tickersToLookup
        );
        this.relatedPrices = relatedPrices;
        this.sendToAll('server:related-prices', relatedPrices);
        console.log('done getting related prices');
    }
};

module.exports = stratManager;
