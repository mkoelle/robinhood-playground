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

    const filterSortedTicks = async (filter, sort) => {
        const passedFirstFilter = withOvernight.filter(filter).sort(sort);
        const withRisk = await mapLimit(passedFirstFilter, 20, async buy => ({
            ...buy,
            ...(await getRisk(Robinhood, buy.ticker)),
            trending35257: await trendingUp(Robinhood, buy.ticker, [35, 25, 7])
        }));
        console.log(withRisk);
        return (num, secondFilter) => {
            const ofInterest = secondFilter ? withRisk.filter(secondFilter) : withRisk;
            const sortedSliced = ofInterest.sort(sort).slice(0, num);
            return getTicks(sortedSliced);
        };
    };

    console.log('prepping up3overnight');
    const up3overnight = await filterSortedTicks(
        buy => buy.overnightJump > 3,
        (a, b) => b.overnightJump - a.overnightJump
    );
    console.log('prepping down3overnight');
    const down3overnight = await filterSortedTicks(
        buy => buy.overnightJump < -3,
        (a, b) => a.overnightJump - b.overnightJump
    );

    const filterPerms = [
        ['trending35257', buy => buy.trending35257],
        ['ltneg50percmax', buy => buy.percMax < -50],
        ['gtneg20percmax', buy => buy.percMax > -20],
        ['shouldWatchout', buy => buy.shouldWatchout],
        ['notWatchout', buy => !buy.shouldWatchout],
        ['trending35257-ltneg50percmax', buy => buy.trending35257 && buy.percMax < -50],
        ['trending35257-gtneg20percmax', buy => buy.trending35257 && buy.percMax > -20],
        ['trending35257-notWatchout', buy => buy.trending35257 && !buy.shouldWatchout]
    ];

    const runPerms = (name, fn) => {
        return filterPerms.reduce((acc, [subFilterName, filter]) => ({
            ...acc,
            [`${name}-${subFilterName}`]: fn(5, filter)
        }), {
            [`${name}`]: fn(),
            [`${name}-first5`]: fn(5)
        });
    };

    return {
        ...runPerms('up3overnight', up3overnight),
        ...runPerms('down3overnight', down3overnight)
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
