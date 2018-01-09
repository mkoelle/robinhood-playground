

// console.log(stocks);
const login = require('./rh-actions/login');
const getAllTickers = require('./rh-actions/get-all-tickers');
const getTrendSinceOpen = require('./rh-actions/get-trend-since-open');
const sellAllStocks = require('./rh-actions/sell-all-stocks');
const limitSellLastTrade = require('./rh-actions/limit-sell-last-trade');
const limitBuyLastTrade = require('./rh-actions/limit-buy-last-trade');

const fs = require('mz/fs');
const { CronJob } = require('cron');
const jsonMgr = require('./utils/json-mgr');

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

    const getTrendLimitOrderTrending = async (min) => {

        const trendSinceOpen = await getTrendAndSave(min + '*');
        console.log('total trend stocks', trendSinceOpen.length);
        const trendingBelow10 = trendSinceOpen.filter(stock => stock.trend_since_open && stock.trend_since_open < -10);
        console.log('trending below 10', trendingBelow10.length);
        const notJumpedSinceYesterday = trendingBelow10.filter(stock => stock.trend_since_prev_close < 5);
        console.log('not jumped more than 5% up since yesterday', notJumpedSinceYesterday);
        const cheapBuys = notJumpedSinceYesterday.filter(stock => {
            return Number(stock.quote_data.last_trade_price) < 30;
        });
        console.log('trading below $30', cheapBuys.length);
        const sortedByPrice = cheapBuys.sort((a, b) => {
            return Number(b.quote_data.last_trade_price) - Number(a.quote_data.last_trade_price);
        });
        console.log('sorted by price', JSON.stringify(sortedByPrice, null, 2));


        const stocksToBuy = sortedByPrice.map(stock => stock.ticker);

        const accounts = await Robinhood.accounts();
        const totalAmtToSpend = Number(accounts.results[0].sma) * 0.5;
        console.log('totalAmtToSpend', totalAmtToSpend);
        await limitBuyLastTrade(Robinhood, stocksToBuy, totalAmtToSpend);

    };

    new CronJob('31 06 * * 1-5', async () => {

        // daily at 6:31AM
        console.log('selling all stocks');
        await sellAllStocks(Robinhood);
        console.log('done selling all');

    }, null, true);

    // increments

    const regCronIncAfterSixThirty = (incArray, fn) => {
        const d = new Date();
        d.setHours(6, 31);
        incArray.forEach(min => {
            const newDateObj = new Date(d.getTime() + min * 60000);
            const cronStr = `${newDateObj.getMinutes()} ${newDateObj.getHours()} * * 1-5`;
            console.log(cronStr);
            new CronJob(cronStr, () => fn(min), null, true);
        });
    };

    // store trend since open at intervals
    regCronIncAfterSixThirty(
        [0, 5, 10, 20, 30, 60, 75, 90, 105, 120, 180],
        getTrendAndSave
    );

    regCronIncAfterSixThirty(
        [150, 330, 383],  // 9:01am, 12:01am, 12:54am
        async min => getTrendLimitOrderTrending(min, min / 383)
    );

};


(async () => {

    Robinhood = await login();

    console.log('user', await Robinhood.accounts());

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
