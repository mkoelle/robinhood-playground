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

    console.log('running daytime strategy');

    console.log('total trend stocks', trend.length);

    const withTrendSinceOpen = await addTrendSinceOpen(Robinhood, trend);
    let allUp = withTrendSinceOpen.filter(
        stock => stock.trendSinceOpen && stock.trendSinceOpen > 3
    );
    console.log('trendingUp', allUp.length);

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
        }
            
        return {
            [stratname]: getTicks(trend),
            ...highestLowest('TSO', 'trendSinceOpen'),  // lowest trend since open is still > 3%
            ...highestLowest('YP', 'yearPosition'),
        };
    };

    let withTrendingUp = await mapLimit(allUp, 20, async buy => ({
        ...buy,
        ...(await getRisk(Robinhood, buy.ticker)),
        trendingUp30: await trendingUp(Robinhood, buy.ticker, [ 30 ]),
        trendingUp3010: await trendingUp(Robinhood, buy.ticker, [ 30, 10 ]),
        trendingUp10: await trendingUp(Robinhood, buy.ticker, [ 10 ]),
    }));

    console.log(
        'num watcout',
        withTrendingUp.filter(buy => buy.shouldWatchout).length
    );
    console.log(
        'trendingUp3010',
        withTrendingUp.filter(buy => !buy.trendingUp3010).length
    );

    const allFilters = withTrendingUp.filter(
        buy => buy.trendingUp3010 && !buy.shouldWatchout
    );

    console.log('final length num count', withTrendingUp.length);
    console.log(withTrendingUp);

    const getTicks = arr => arr.map(buy => buy.ticker);
    return {
        ...allVariations('trendingUp10', withTrendingUp.filter(buy => buy.trendingUp10)),
        ...allVariations('trendingUp3010', withTrendingUp.filter(buy => buy.trendingUp3010)),
        ...allVariations('trendingUp30', withTrendingUp.filter(buy => buy.trendingUp30)),
        ...allVariations('notWatchout', withTrendingUp.filter(buy => !buy.shouldWatchout)),
        ...allVariations('onlyWatchout', withTrendingUp.filter(buy => buy.shouldWatchout)),
        ...allVariations('trendingUp10', withTrendingUp.filter(buy => buy.trendingUp10)),
        ...allVariations('trendingUp10', withTrendingUp.filter(buy => buy.trendingUp10)),
        allFilters: getTicks(allFilters)
    }
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
