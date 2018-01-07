

// console.log(stocks);
const login = require('./rh-actions/login');
const getAllTickers = require('./rh-actions/get-all-tickers');
const getTrendSinceOpen = require('./rh-actions/get-trend-since-open');
const sellAllStocks = require('./rh-actions/sell-all-stocks');

const fs = require('mz/fs');
const { CronJob } = require('cron');
const async = require('async');


const saveJSON = async (fileName, obj) => {
  await fs.writeFile(fileName, JSON.stringify(obj, null, 2));
};



(async () => {
    console.log('fds')
    const Robinhood = await login();

    // does the list of stocks need updating?
    let allTickers;
    try {
        allTickers = require('./stock-data/allStocks')
            .filter(stock => stock.tradeable)
            .map(stock => stock.symbol);
            console.log('nah')
    } catch (e) {
        console.log('hello')
        allTickers = await getAllTickers(Robinhood);
    }

    console.log('before non')
    const nonZero = await sellAllStocks(Robinhood);
    console.log('after non', nonZero);


    let trendSinceOpen = await getTrendSinceOpen(Robinhood, allTickers);


    console.log(JSON.stringify(trendSinceOpen, null, 2));

    console.log('-------');

    const belowPerc = perc => {
        const matchedTrends = trendSinceOpen.filter(trendObj => trendObj.trendPerc < perc);
        console.log('below', perc, ' count', matchedTrends.length);
        matchedTrends.forEach(obj => console.log(JSON.stringify(obj, null, 2)));
    };
    [-2, -5, -8, -10].forEach(belowPerc);

})();

new CronJob('31 06 * * 1-5', () => {

    [0, 3, 5, 10, 20, 30, 60, 75, 90, 105, 120, 180].forEach(min => {
        setTimeout(async () => {
            console.log(`getting trend since open for all stocks - 6:31am + ${min} minutes`);
            const trendingArray = await getTrendSinceOpen();

            const dateStr = (new Date()).toLocaleString();
            await saveJSON(`./stock-data/${dateStr} (+${min}).json`, trendingArray);

        }, min * 1000 * 60);
    });

}, null, true);
