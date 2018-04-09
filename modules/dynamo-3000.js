// utils
const regCronIncAfterSixThirty = require('../utils/reg-cron-after-630');

// app-actions
const executeStrategy = require('../app-actions/execute-strategy');
const addTrendSinceOpen = require('../app-actions/add-trend-since-open');
// npm
const mapLimit = require('promise-map-limit');

// rh-actions
const getRisk = require('../rh-actions/get-risk');
const trendingUp = require('../rh-actions/trending-up');

const trendFilter = async (Robinhood, trend) => {
    // going up at least 3%

    console.log('running dynamo-3000 strategy');

    console.log('total trend stocks', trend.length);

    let withTrendSinceOpen = await addTrendSinceOpen(Robinhood, trend);
    withTrendSinceOpen = withTrendSinceOpen
        .filter(buy => buy.trendSinceOpen)
        .sort((a, b) => a.trendSinceOpen - b.trendSinceOpen);

    const theMiddle = Math.floor(withTrendSinceOpen.length / 2);

    const tsoBreakdowns = [
        {
            name: 'bottom50tso',
            trend: withTrendSinceOpen.slice(0, 50)
        },
        {
            name: 'middle50tso',
            trend: withTrendSinceOpen.slice(theMiddle - 25, theMiddle + 25)
        },
        {
            name: 'top50tso',
            trend: withTrendSinceOpen.slice(-50)
        },
    ];

    const getTicks = arr => arr.map(buy => buy.ticker);

    const allVariations = (stratname, trend) => {
        const withYearPosition = trend
            .map(buy => {
                const { fundamentals } = buy;
                if (!fundamentals) return buy;
                const { low_52_weeks, high_52_weeks } = fundamentals;
                const total = Number(low_52_weeks) + Number(high_52_weeks);
                const perc = buy.last_trade_price / total;
                return {
                    ...buy,
                    yearPosition: perc
                };
            })
        const firstFiveBySort = (sortFn) => getTicks(
            withYearPosition
                .sort(sortFn)
                .slice(0, 5)
        );

        const highestLowest = (acronym, key) => {
            return {
                [`${stratname}-5lowest${acronym}`]: firstFiveBySort((a, b) => a[key] - b[key]),
                [`${stratname}-5highest${acronym}`]: firstFiveBySort((a, b) => b[key] - a[key]),
            };
        };

        return {
            [stratname]: getTicks(trend),
            ...highestLowest('TSO', 'trendSinceOpen'),  // lowest trend since open is still > 3%
            ...highestLowest('YP', 'yearPosition'),
        };
    };

    const allVariationsForTsoBreakdown = async ({ name, trend: trendFilteredByTSO }) => {
        console.log('trendFilter', name, 'count', trendFilteredByTSO.length);
        let withTrendingUp = await mapLimit(trendFilteredByTSO, 20, async buy => ({
            ...buy,
            ...(await getRisk(Robinhood, buy.ticker)),
            // trendingUp30: await trendingUp(Robinhood, buy.ticker, [ 30 ]),
            trendingUp3010: await trendingUp(Robinhood, buy.ticker, [ 30, 10 ]),
            // trendingUp10: await trendingUp(Robinhood, buy.ticker, [ 10 ]),
        }));

        console.log(
            'num watchout',
            withTrendingUp.filter(buy => buy.shouldWatchout).length
        );
        console.log(
            'trendingUp3010',
            withTrendingUp.filter(buy => buy.trendingUp3010).length
        );

        const allFilters = withTrendingUp.filter(
            buy => buy.trendingUp3010 && !buy.shouldWatchout
        );

        console.log('final length num count', withTrendingUp.length);
        console.log(withTrendingUp);

        return {
            ...allVariations(`${name}-overall`, withTrendingUp),
            // ...allVariations(`${name}-trendingUp10`, withTrendingUp.filter(buy => buy.trendingUp10)),
            ...allVariations(`${name}-trendingUp3010`, withTrendingUp.filter(buy => buy.trendingUp3010)),
            // ...allVariations(`${name}-trendingUp30`, withTrendingUp.filter(buy => buy.trendingUp30)),
            ...allVariations(`${name}-notWatchout`, withTrendingUp.filter(buy => !buy.shouldWatchout)),
            ...allVariations(`${name}-onlyWatchout`, withTrendingUp.filter(buy => buy.shouldWatchout)),
            [`${name}-allFilters`]: getTicks(allFilters)
        };
    };

    let returnObj = {};
    for (let obj of tsoBreakdowns) {
        returnObj = {
            ...returnObj,
            ...await allVariationsForTsoBreakdown(obj)
        };
    }
    return returnObj;
};

const dynamo3000 = {
    trendFilter,
    init: Robinhood => {
        // runs at init
        regCronIncAfterSixThirty(Robinhood, {
            name: 'execute dynamo-3000 strategy',
            run: [4, 40, 100, 200, 260, 351, 381], // 10:41am, 11:31am
            // run: [],
            fn: async (Robinhood, min) => {
                await executeStrategy(Robinhood, trendFilter, min, 0.3, 'dynamo-3000');
            }
        });
    }
};

module.exports = dynamo3000;
