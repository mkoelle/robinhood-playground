

// console.log(stocks);
const login = require('./rh-actions/login');
const getAllTickers = require('./rh-actions/get-all-tickers');
const getTrendSinceOpen = require('./rh-actions/get-trend-since-open');
const sellAllStocks = require('./rh-actions/sell-all-stocks');
// const limitSellLastTrade = require('./rh-actions/limit-sell-last-trade');
const limitBuyLastTrade = require('./rh-actions/limit-buy-last-trade');
const cancelAllOrders = require('./rh-actions/cancel-all-orders');
// const getRisk = require('./rh-actions/get-risk');
// const trendingUp = require('./rh-actions/trending-up');

// const fs = require('mz/fs');
const { CronJob } = require('cron');
const jsonMgr = require('./utils/json-mgr');
// const mapLimit = require('promise-map-limit');

const strategies = require('./strategies');

let Robinhood, allTickers;


const startCrons = () => {

    // helpers
    const getTrendAndSave = async min => {
        console.log(`getting trend since open for all stocks - 6:31am + ${min} minutes`);
        const trendingArray = await getTrendSinceOpen(Robinhood, allTickers);
        const dateStr = (new Date()).toLocaleString();
        await jsonMgr.save(`./stock-data/${dateStr} (+${min}).json`, trendingArray);
        return trendingArray;
    };

    const purchaseStocks = async (stocksToBuy, ratioToSpend) => {
        const accounts = await Robinhood.accounts();
        const totalAmtToSpend = Number(accounts.results[0].sma) * ratioToSpend;
        console.log('totalAmtToSpend', totalAmtToSpend);
        await limitBuyLastTrade(Robinhood, stocksToBuy, totalAmtToSpend);
    };

    new CronJob('30 06 * * 1-5', async () => {

        setTimeout(async () => {

            // daily at 6:30AM + 4 seconds
            console.log('selling all stocks');
            await sellAllStocks(Robinhood);
            console.log('done selling all');

        }, 4000);

    }, null, true);

    // increments
    const regCronIncAfterSixThirty = (incArray, fn) => {
        const d = new Date();
        d.setHours(6, 31);
        incArray.forEach((min, index) => {
            const newDateObj = new Date(d.getTime() + min * 60000);
            const cronStr = `${newDateObj.getMinutes()} ${newDateObj.getHours()} * * 1-5`;
            console.log(cronStr);
            new CronJob(cronStr, () => fn(min, index), null, true);
        });
    };

    // store trend since open at intervalsw
    regCronIncAfterSixThirty(
        [0, 5, 10, 20, 30, 60, 75, 90, 105, 120, 180],
        getTrendAndSave
    );

    const executeStrategy = async (strategyFn, min, ratioToSpend) => {
        const trend = await getTrendAndSave(min + '*');
        const toPurchase = await strategyFn(Robinhood, trend);
        await purchaseStocks(toPurchase, ratioToSpend);
    };

    regCronIncAfterSixThirty(
        [360, 380],  // 12:31, 12:53am
        async (min, i) => await executeStrategy(strategies.beforeClose, min, (i + 1) / 2)
    );

    regCronIncAfterSixThirty(
        [150, 200],  // 9:01am, 12:01am
        async (min) => await executeStrategy(strategies.daytime, min, 0.2)
    );

};


(async () => {

    Robinhood = await login();

    console.log('user', await Robinhood.accounts());
    await cancelAllOrders(Robinhood);



    // nonzero.map(non => ({
    //     ...nonzero,
    //     urlwap: await Robinhood.url(non.url)
    // }));
    // console.log(nonzero);
    // await shouldWatchout(Robinhood, 'APHB');

    // does the list of stocks need updating?
    try {
        allTickers = require('./stock-data/allStocks');
    } catch (e) {
        allTickers = await getAllTickers(Robinhood);
    }
    allTickers = allTickers
        .filter(stock => stock.tradeable)
        .map(stock => stock.symbol);

    startCrons();

})();
