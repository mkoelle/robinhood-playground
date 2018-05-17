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

    console.log('running low-float-high-volume strategy');

    console.log('total trend stocks', trend.length);

    let withTrendSinceOpen = await addTrendSinceOpen(Robinhood, trend);
    withTrendSinceOpen = withTrendSinceOpen
        .filter(buy => buy.trendSinceOpen)
        .sort((a, b) => a.trendSinceOpen - b.trendSinceOpen);

    withTrendSinceOpen = withTrendSinceOpen
        .map(buy => {
            const { fundamentals } = buy;
            if (!fundamentals) return buy;
            const {
                shares_outstanding,
                market_cap,
                volume,
                average_volume,
                average_volume_2_weeks
            } = fundamentals;
            const sharesToCap = shares_outstanding / market_cap;    // "float"
            return {
                ...buy,
                sharesToCap,
                volumetoavg: volume / average_volume,
                volumeto2weekavg: volume / average_volume_2_weeks,
                twoweekvolumetoavg: average_volume_2_weeks / average_volume,
                absvolume: Number(volume),
                floatToVolume: sharesToCap / volume,
            };
        })
        .filter(buy => !!buy.sharesToCap);

    const addPoints = (ptKey, sort) => {
        return withTrendSinceOpen
            .sort(typeof sort === 'string' ? (a, b) => b[sort] - a[sort] : sort)
            .map((buy, index, array) => {
                const relPoints = (array.length - index) / array.length;
                return {
                    ...buy,
                    [ptKey]: relPoints,
                    ...(buy.floatPoints && {
                        [`floatTimes${ptKey}`]: buy.floatPoints * relPoints
                    })
                };
            });
    };

    withTrendSinceOpen = addPoints('floatPoints', (a, b) => a.sharesToCap - b.sharesToCap); // assumption: low float is better
    withTrendSinceOpen = addPoints('absVolPoints', 'absvolume');
    withTrendSinceOpen = addPoints('volToAvgPoints', 'volumetoavg');
    withTrendSinceOpen = addPoints('volTo2WeekPoints', 'volumeto2weekavg');
    withTrendSinceOpen = addPoints('twoWeekVolToAvgPoints', 'twoweekvolumetoavg');
    withTrendSinceOpen = addPoints('floatToVolume', 'floatToVolume');

    console.log(withTrendSinceOpen);

    return Object.keys(withTrendSinceOpen[0])
        .filter(key => key.includes('floatTimes'))
        .reduce((acc, key) => {

            const sortTrend = (
                [
                    min = Number.NEGATIVE_INFINITY,
                    max = Number.POSITIVE_INFINITY
                ] = [undefined, undefined]
            ) => {
                return withTrendSinceOpen
                    .filter(({ trendSinceOpen }) => {
                        return trendSinceOpen > min && trendSinceOpen < max;
                    })
                    .sort((a, b) => b[key] - a[key])
                    .slice(0, 1)
                    .map(buy => buy.ticker);
            };

            return {
                ...acc,
                [key]: sortTrend(),
                [`${key}-trend3to5`]: sortTrend([3, 5]),
                [`${key}-trend5to10`]: sortTrend([5, 10]),
                [`${key}-trenddown1to3`]: sortTrend([-3, -1]),
                [`${key}-trenddown3to10`]: sortTrend([-10, -3]),
                [`${key}-trenddowngt10`]: sortTrend([undefined, -10])
            };

        }, {});

};

const lowFloatHighVolume = {
    trendFilter,
    init: Robinhood => {
        // runs at init
        regCronIncAfterSixThirty(Robinhood, {
            name: 'execute low-float-high-volume strategy',
            run: [6, 25, 95, 150, 210, 276, 315, 384], // 10:41am, 11:31am
            // run: [],
            fn: async (Robinhood, min) => {
                await executeStrategy(Robinhood, trendFilter, min, 0.3, 'low-float-high-volume');
            }
        });
    }
};

module.exports = lowFloatHighVolume;
