// utils
const regCronIncAfterSixThirty = require('../utils/reg-cron-after-630');
const getMultipleHistoricals = require('../app-actions/get-multiple-historicals');
const executeStrategy = require('../app-actions/execute-strategy');
const getTrend = require('../utils/get-trend');
const addOvernightJump = require('../app-actions/add-overnight-jump');

const trendFilter = async (Robinhood, trend) => {

    let allHistoricals = await getMultipleHistoricals(
        Robinhood,
        trend.map(buy => buy.ticker),
        `interval=5minute`
    );

    let withHistoricals = trend.map((buy, i) => ({
        ...buy,
        historicals: allHistoricals[i]
    })).filter(buy => !!buy.historicals && buy.historicals.length);

    const perms = [1, 2, 3, 5, 10, 18, 30, 50];
    let withQuickTrends = withHistoricals
        .map(buy => {
            const lastClose = buy.historicals[buy.historicals.length - 1].close_price;
            return {
                ...buy,
                ...perms.reduce((acc, val) => {
                    const pastHistorical = buy.historicals[buy.historicals.length - val];
                    return {
                        ...acc,
                        ...pastHistorical && {
                            [`last${val}trend`]: getTrend(lastClose, pastHistorical.open_price)
                        }
                    };
                }, {})
            };
        });

    const firstPerms = (lastVal, ofInterest) => ({
        [`last${lastVal}trend-first1`]: ofInterest.slice(0, 1),
        [`last${lastVal}trend-first2`]: ofInterest.slice(0, 2),
        [`last${lastVal}trend`]: ofInterest.slice(0, 2) // temporary
    });

    console.log(JSON.stringify(withQuickTrends, null, 2));
    return perms
        .filter(val => withQuickTrends.some(buy => !!buy[`last${val}trend`]))
        .reduce((acc, val) => ({
            ...acc,
            ...firstPerms(
                val,
                withQuickTrends
                    .sort((a, b) => a[`last${val}trend`] - b[`last${val}trend`])
                    .map(buy => buy.ticker)
            )
        }), {});


};

module.exports = {
    trendFilter,
    init: Robinhood => {
        // runs at init
        regCronIncAfterSixThirty(Robinhood, {
            name: 'execute sudden-drops strategy',
            run: [3, 14, 32, 63, 221, 328, 388], // 10:41am, 11:31am
            fn: async (Robinhood, min) => {
                await executeStrategy(Robinhood, trendFilter, min, 0.3, 'sudden-drops');
            }
        });
    }
};
