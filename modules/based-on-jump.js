// utils
const regCronIncAfterSixThirty = require('../utils/reg-cron-after-630');

// app-actions
const executeStrategy = require('../app-actions/execute-strategy');

// npm
const mapLimit = require('promise-map-limit');

// rh-actions
const getRisk = require('../rh-actions/get-risk');
const trendingUp = require('../rh-actions/trending-up');
const addOvernightJump = require('../app-actions/add-overnight-jump');

const getTicks = arr => arr.map(buy => buy.ticker);
const trendFilter = async (Robinhood, trend) => {
    // stocks that went up overnight and
    // trending upward
    console.log('running based-on-jump strategy');

    let withOvernight = await addOvernightJump(Robinhood, trend);
    let upOvernight = withOvernight.filter(stock => stock.overnightJump > 3);

    upOvernight = await mapLimit(upOvernight, 20, async buy => ({
        ...buy,
        ...(await getRisk(Robinhood, buy.ticker)),
        trending35257: await trendingUp(Robinhood, buy.ticker, [35, 25, 7])
    }));

    console.log(
        'num trending35257',
        upOvernight.filter(buy => buy.trending35257).length
    );
    console.log(
        '> 8% below max of year',
        upOvernight.filter(buy => buy.percMax < -8).length
    );
    const allFilters = upOvernight.filter(buy => buy.trending35257 && buy.percMax < -8);

    const first5 = trend => trend
        .sort((a, b) => b.overnightJump - a.overnightJump)
        .slice(0, 5);

    const biggestDowners = num => withOvernight
        .sort((a, b) => a.overnightJump - b.overnightJump)
        .slice(0, num);

    return {
        up3overnight: getTicks(upOvernight),
        'up3overnight-first5': getTicks(first5(upOvernight)),
        'up3overnight-trending35257': getTicks(first5(upOvernight.filter(buy => buy.trending35257))),
        'up3overnight-gtneg8percmax': getTicks(first5(upOvernight.filter(buy => buy.percMax < -8))),
        'up3overnight-allFilters': getTicks(allFilters),
        'biggestDowners5': getTicks(biggestDowners(5)),
        'biggestDowners3': getTicks(biggestDowners(3))
    };
};

// based on jump
const basedOnJump = {
    trendFilter,

    init: (Robinhood) => {
        // runs at init
        regCronIncAfterSixThirty(Robinhood, {
            name: 'record based-on-jump strategy',
            run: [5, 16, 30], // 7:00am
            fn: async (Robinhood, min) => {
                setTimeout(async () => {
                    await executeStrategy(Robinhood, trendFilter, min, 0.2, 'based-on-jump');
                }, 5000);
            }
        });
    }
};

module.exports = basedOnJump;
