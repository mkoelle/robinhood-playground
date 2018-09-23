// utils
const regCronIncAfterSixThirty = require('../utils/reg-cron-after-630');

// app-actions
const executeStrategy = require('../app-actions/execute-strategy');
const addTrendSinceOpen = require('../app-actions/add-trend-since-open');

const mapLimit = require('promise-map-limit');

const getRisk = require('../rh-actions/get-risk');
const trendingUp = require('../rh-actions/trending-up');

const trendFilter = async (Robinhood, trend) => {

    // cheap stocks that have gone up the most since open
    // trending 7, 5, 3
    // not "watching out"

    console.log('running beforeCloseUp strategy');

    const withTrendSinceOpen = await addTrendSinceOpen(Robinhood, trend);

    let trendingAbove4 = withTrendSinceOpen.filter(stock => stock.trendSinceOpen > 3);
    console.log('trending above 3', trendingAbove4.length);


    trendingAbove4 = await mapLimit(trendingAbove4, 20, async buy => ({
        ...buy,
        ...await getRisk(Robinhood, buy.ticker),
        trendingUp: await trendingUp(Robinhood, buy.ticker, [7])
    }));
    // console.log('num watcout', cheapBuys.filter(buy => buy.shouldWatchout).length);
    console.log('num not trending', trendingAbove4.filter(buy => !buy.trendingUp).length);
    // console.log('> 5% below max of year', cheapBuys.filter(buy => buy.percMax < -5).length);
    trendingAbove4 = trendingAbove4.filter(buy => buy.trendingUp);

    console.log('trendingAbove4', trendingAbove4.length);

    return trendingAbove4
        .sort((a, b) => b.trend_since_prev_close - a.trend_since_prev_close)
        .slice(0, 10)
        .map(stock => stock.ticker);

};

const beforeCloseUp = {
    name: 'before-close-up',
    trendFilter,
    run: [350, 380],  // 12:31, 12:50pm
};


module.exports = beforeCloseUp;
