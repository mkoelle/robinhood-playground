
// app actions
const getTrendAndSave = require('../app-actions/get-trend-and-save');
const logPortfolioValue = require('../app-actions/log-portfolio-value');

// utils
const regCronIncAfterSixThirty = require('../utils/reg-cron-after-630');
const timeoutPromise = require('../utils/timeout-promise');

// rh actions
const sellAllStocks = require('../rh-actions/sell-all-stocks');

const additionalCronConfig = [
    {
        name: 'sell all stocks, log portfolio value',
        run: [0],
        fn: (Robinhood) => {

            setTimeout(async () => {
                // daily at 6:30AM + 4 seconds
                console.log('selling all stocks');
                await sellAllStocks(Robinhood);
                console.log('done selling all');

                timeoutPromise(20000);
                console.log('logging portfolio value');
                await logPortfolioValue(Robinhood);

            }, 4000);

        }
    },
    // log port value
    {
        name: 'log the portfolio value',
        run: [195, 292, 390],
        fn: logPortfolioValue
    },
    // log the trend
    {
        name: 'log the trend',
        run: [75, 105, 180],
        fn: getTrendAndSave
    }
];

const additionalCron = {
    init: (Robinhood) => {
        additionalCronConfig.forEach(cronConfig => {
            regCronIncAfterSixThirty(
                Robinhood,
                cronConfig
            );
        });
    }
};

module.exports = additionalCron;
