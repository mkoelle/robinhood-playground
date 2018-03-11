const getTrend = require('../utils/get-trend');
const regCronIncAfterSixThirty = require('../utils/reg-cron-after-630');

const executeStrategy = require('../app-actions/execute-strategy');
const getMultipleHistoricals = require('../app-actions/get-multiple-historicals');

const mapLimit = require('promise-map-limit');

const trendFilter = async (Robinhood, trend) => {

    let allHistoricals = await getMultipleHistoricals(
        Robinhood,
        trend.map(buy => buy.ticker)
    );

    let withHistoricals = trend.map((buy, i) => ({
        ...buy,
        historicals: allHistoricals[i]
    }));

    const ofInterest = withHistoricals
        .filter(({historicals}) => historicals.length)
        .map(buy => {

            const {historicals} = buy;
            historicals.reverse();
            // evening
            // const {trend: mostRecentTrend} = historicals.shift();
            return {
                ...buy,
                mostRecentTrend: buy.trend_since_open
            };
        })
        .filter(({mostRecentTrend}) => mostRecentTrend < -3)
        .map(buy => {
            let daysUp = [];
            buy.historicals.some(hist => {
                const wentUp = hist.trend > 0;
                daysUp.push(hist);
                return !wentUp;
            });
            delete buy.historicals;
            delete buy.fundamentals;
            delete buy.quote_data;
            const daysUpCount = daysUp.length - 1;
            if (daysUpCount) {
                try {
                    var percUp = getTrend(daysUp[0].close_price, daysUp[daysUp.length - 1].close_price);
                    var points = daysUpCount * percUp * Math.abs(buy.mostRecentTrend);
                } catch (e) {}
            }
            return {
                ...buy,
                daysUpCount,
                daysUp,
                percUp,
                points
            };
        })
        .filter(buy => buy.daysUpCount > 0 && buy.percUp > Math.abs(buy.mostRecentTrend))
        .sort((a, b) => b.points - a.points);

    console.log(JSON.stringify(ofInterest, null, 2));

    return ofInterest
        .map(({ ticker }) => ({ ticker }));
};


const upsThenDowns = {
    trendFilter,
    init: (Robinhood) => {

        // runs at init
        regCronIncAfterSixThirty(
            Robinhood,
            {
                name: 'execute ups-then-downs strategy',
                run: [45, 189],  // 12:31, 12:50pm
                // run: [],
                fn: (Robinhood, min) => setTimeout(async () => {
                    await executeStrategy(Robinhood, trendFilter, min, 0.3, 'up-streak');
                }, 5000)
            },
        );

    }
};


module.exports = upsThenDowns;
