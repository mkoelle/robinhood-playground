

// console.log(stocks);
const login = require('./rh-actions/login');
const getAllTickers = require('./rh-actions/get-all-tickers');
const getTrendSinceOpen = require('./rh-actions/get-trend-since-open');
const sellAllStocks = require('./rh-actions/sell-all-stocks');
const limitBuyLastTrade = require('./rh-actions/limit-buy-last-trade');

const fs = require('mz/fs');
const { CronJob } = require('cron');

let Robinhood, allTickers;

const saveJSON = async (fileName, obj) => {
    await fs.writeFile(fileName, JSON.stringify(obj, null, 2));
};


const startCrons = () => {

    const getTrendAndSave = async min => {
        console.log(`getting trend since open for all stocks - 6:31am + ${min} minutes`);
        const trendingArray = await getTrendSinceOpen(Robinhood, allTickers);
        const dateStr = (new Date()).toLocaleString();
        await saveJSON(`./stock-data/${dateStr} (+${min}).json`, trendingArray);
        return trendingArray;
    };

    new CronJob('31 06 * * 1-5', async () => {

        // daily at 6:31AM
        console.log('selling all stoks')
        await sellAllStocks(Robinhood);
        console.log('done selling all');

        // store trend since open at intervals
        [0, 5, 10, 20, 30, 60, 75, 90, 105, 120, 180].forEach(min => {
            setTimeout(async () => {
                await getTrendAndSave(min);
            }, min * 1000 * 60);
        });

    }, null, true);

    //'01 09 * * 1-5'
    new CronJob('01 09 * * *', async () => {

        // daily at 9AM
        const trendSinceOpen = await getTrendAndSave('150*');
        console.log('total trend stocks', trendSinceOpen.length);
        const trendingBelow10 = trendSinceOpen.filter(stock => stock.trendPerc < -10);
        console.log('trending below 10', trendingBelow10.length);
        const cheapBuys = trendingBelow10.filter(stock => {
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
        await limitBuyLastTrade(Robinhood, stocksToBuy, totalAmtToSpend, 20);

    }, null, true);

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
