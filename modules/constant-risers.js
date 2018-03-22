// utils
const regCronIncAfterSixThirty = require('../utils/reg-cron-after-630');
const getMultipleHistoricals = require('../app-actions/get-multiple-historicals');
const executeStrategy = require('../app-actions/execute-strategy');
const getTrend = require('../utils/get-trend');
const trendFilter = async (Robinhood, trend) => {

    const analyzeForRisers = async interval => {

        let allHistoricals = await getMultipleHistoricals(
            Robinhood,
            trend.map(buy => buy.ticker),
            `interval=${interval}`
        );

        let withHistoricals = trend.map((buy, i) => ({
            ...buy,
            historicals: allHistoricals[i]
        }));

        let withPercUp = withHistoricals
            .map(buy => {
                const { historicals } = buy;
                const percUpHighClose = historicals.filter(({ open_price, close_price, high_price }) => {
                    return [
                        close_price,
                        high_price
                    ].some(price => price > open_price);
                }).length / historicals.length;

                const percUpCloseOnly = buy.historicals.filter(({ open_price, close_price }) => {
                    return close_price > open_price;
                }).length / historicals.length;

                const trendPerc = getTrend(historicals[historicals.length - 1].close_price, historicals[0].open_price);

                return {
                    ...buy,
                    percUpHighClose,
                    percUpHighClosePoints: percUpHighClose * trendPerc,
                    percUpCloseOnly,
                    percUpCloseOnlyPoints: percUpCloseOnly * trendPerc,
                    trendPerc
                };

            })
            .map(buy => {
                delete buy.historicals;
                return buy;
            });

        console.log('with', withPercUp);
        const orderBy = what => {
            return withPercUp
                .sort((a, b) => b[what] - a[what])
                .slice(0, 3)
                .map(buy => buy.ticker);
        };

        return [
            'percUpHighClose',
            'percUpCloseOnly',
            'percUpHighClosePoints',
            'percUpCloseOnlyPoints'
        ].reduce((acc, val) => {
            acc[`${interval}-${val}`] = orderBy(val);
            return acc;
        }, {});

    };


    return {
        ...await analyzeForRisers('10minute'),
        ...await analyzeForRisers('5minute')
    };


};

const constantRisers = {
    trendFilter,
    init: Robinhood => {
        // runs at init
        regCronIncAfterSixThirty(Robinhood, {
            name: 'execute constant-risers strategy',
            run: [40, 80, 100, 140, 200, 250, 300], // 10:41am, 11:31am
            fn: async (Robinhood, min) => {
                await executeStrategy(Robinhood, trendFilter, min, 0.3, 'constant-risers');
            }
        });
    }
};

module.exports = constantRisers;
