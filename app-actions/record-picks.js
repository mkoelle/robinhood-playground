const fs = require('mz/fs');
const jsonMgr = require('../utils/json-mgr');
const lookup = require('../utils/lookup');
const mapLimit = require('promise-map-limit');
const { purchase, email } = require('../strategies-enabled');
const stratManager = require('../socket-server/strat-manager');

const purchaseStocks = require('./purchase-stocks');
const sendEmail = require('../utils/send-email');

console.log(purchase, email, 'strategies enabled ');
module.exports = async (Robinhood, strategy, min, withPrices) => {

    if (!strategy.includes('cheapest-picks')) withPrices = withPrices.slice(0, 5);  // take only 5 picks

    console.log('recording', strategy, 'strategy');
    const dateStr = (new Date()).toLocaleDateString().split('/').join('-');
    const fileLocation = `./picks-data/${dateStr}/${strategy}.json`;
    // create day directory if needed
    if (!(await fs.exists(`./picks-data/${dateStr}`))) {
        await fs.mkdir(`./picks-data/${dateStr}`);
    }

    // console.log('getting prices', picks);
    // let withPrices = await mapLimit(picks, 1, async ticker => {
    //     try {
    //         return {
    //             ticker,
    //             price: (await lookup(Robinhood, ticker)).currentPrice
    //         };
    //     } catch (e) {
    //         return null;
    //     }
    // });
    withPrices = withPrices.filter(tickerPrice => !!tickerPrice);


    console.log('saving', strategy, 'picks', withPrices);
    const curData = await jsonMgr.get(fileLocation);
    const savedData = {
        ...curData,
        [min]: withPrices
    };
    await jsonMgr.save(fileLocation, savedData);

    const stratMin = `${strategy}-${min}`;

    // for socket-server
    stratManager.newPick({
        stratMin,
        withPrices
    });

    // for purchase
    const strategiesEnabled = stratManager.strategies.dayBeforeYesterdayByPercUpFirst3;
    const enableCount = strategiesEnabled.filter(strat => strat === stratMin).length;
    if (enableCount) {
        console.log('strategy enabled: ', stratMin, 'purchasing');
        console.log('picks', picks);
        await purchaseStocks(Robinhood, {
            stocksToBuy: picks,
            strategy,
            multiplier: enableCount,
            min
        });
    }

    // for email
    const toEmail = Object.keys(email).filter(addr => email[addr].includes(stratMin));
    for (let addr of toEmail) {
        await sendEmail(
            `robinhood-playground: ${stratMin}`,
            JSON.stringify(withPrices, null, 2),
            addr
        );
    }



};
