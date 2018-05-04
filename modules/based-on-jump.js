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
            trending35257: await trendingUp(Robinhood, buy.ticker, [35, 25, 7]),
            trending607: await trendingUp(Robinhood, buy.ticker, [60, 7]),
            trending103: await trendingUp(Robinhood, buy.ticker, [10, 3]),
            trending53: await trendingUp(Robinhood, buy.ticker, [5, 3]),
        }));
        console.log(withRisk);
        return (num, secondFilter) => {
            const ofInterest = secondFilter ? withRisk.filter(secondFilter) : withRisk;
            const sortedSliced = ofInterest.sort(sort).slice(0, num);
            return getTicks(sortedSliced);
        };
    };

    console.log('prepping up3overnight');
    const descendingOJ = (a, b) => b.overnightJump - a.overnightJump;
    const gtEightOvernight = await filterSortedTicks(
        buy => buy.overnightJump > 8,
        descendingOJ
    );
    const fourToEightOvernight = await filterSortedTicks(
        ({ overnightJump }) => overnightJump > 4 && overnightJump < 8,
        descendingOJ
    );
    const oneToFourOvernight = await filterSortedTicks(
        ({ overnightJump }) => overnightJump > 1 && overnightJump < 4,
        descendingOJ
    );
    console.log('prepping down3overnight');
    const down3overnight = await filterSortedTicks(
        buy => buy.overnightJump < -3,
        (a, b) => a.overnightJump - b.overnightJump
    );

    const specificPerms = (name) => {
        return [
            [name, buy => buy[name]],
            [`${name}-shouldWatchout`, buy => buy[name] && buy.shouldWatchout],
            [`${name}-notWatchout`, buy => buy[name] && !buy.shouldWatchout],
            [`${name}-notWatchout-ltneg50percmax`, buy => buy[name] && !buy.shouldWatchout && buy.percMax < -50],
            [`${name}-notWatchout-gtneg20percmax`, buy => buy[name] && !buy.shouldWatchout && buy.percMax > -20],
        ];
    };

    const filterPerms = [
        ['shouldWatchout', buy => buy.shouldWatchout],
        ['notWatchout', buy => !buy.shouldWatchout],
        ['notWatchout-ltneg50percmax', buy => !buy.shouldWatchout && buy.percMax < -50],
        ['notWatchout-gtneg20percmax', buy => !buy.shouldWatchout && buy.percMax > -20],

        ...specificPerms('trending35257'),
        ...specificPerms('trending607'),
        ...specificPerms('trending103'),
        ...specificPerms('trending53'),
    ];

    const runPerms = (name, fn) => {
        return filterPerms.reduce((acc, [subFilterName, filter]) => {
            const first5 = fn(5, filter);
            return {
                ...acc,
                [`${name}-${subFilterName}`]: first5,
                [`${name}-${subFilterName}-first3`]: first5.slice(0, 3),
                [`${name}-${subFilterName}-first2`]: first5.slice(0, 2),
                [`${name}-${subFilterName}-first1`]: first5.slice(0, 1),
            };
        }, {});
    };

    return {
        ...runPerms('gtEightOvernight', gtEightOvernight),
        ...runPerms('fourToEightOvernight', fourToEightOvernight),
        ...runPerms('oneToFourOvernight', oneToFourOvernight),
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
