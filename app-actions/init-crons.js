// utils
const regCronIncAfterSixThirty = require('../utils/reg-cron-after-630');

// app actions
const getTrendAndSave = require('./get-trend-and-save');
const executeStrategy = require('./execute-strategy');

// rh actions
const sellAllStocks = require('../rh-actions/sell-all-stocks');

// strategies
const basedOnJump = require('../strategies/based-on-jump');
const beforeClose = require('../strategies/before-close');
const daytime = require('../strategies/daytime');

const after630cronConfig = [
    {
        name: 'sell all stocks in the morning',
        run: [0],
        fn: (Robinhood) => {

            setTimeout(async () => {
                // daily at 6:30AM + 4 seconds
                console.log('selling all stocks');
                await sellAllStocks(Robinhood);
                console.log('done selling all');
            }, 4000);

        }
    },
    // log the trend
    {
        name: 'log the trend',
        run: [0, 5, 10, 20, 30, 60, 75, 90, 105, 120, 180],
        fn: getTrendAndSave
    },

    // strategies
    // not working
    {
        name: 'execute basedOnJump strategy',
        run: [145],  // 12:31
        fn: async (Robinhood, min) => {
            await executeStrategy(Robinhood, basedOnJump, min, 0.16);
        }
    },
    //
    {
        name: 'execute daytime strategy',
        run: [165, 250, 300],  // 9:16am, 10:41am, 11:31am
        fn: async (Robinhood, min) => {
            await executeStrategy(Robinhood, daytime, min, 0.16);
        }
    },

    // A+ ?
    {
        name: 'execute beforeClose strategy',
        run: [360, 380],  // 12:31, 12:50pm
        fn: async (Robinhood, min, ind) => {
            await executeStrategy(Robinhood, beforeClose, min, (ind + 1) / 3);
        }
    }
];


module.exports = (Robinhood) => {

    after630cronConfig.forEach(cronConfig => {
        regCronIncAfterSixThirty(
            Robinhood,
            cronConfig
        );
    });

};
