const jsonMgr = require('../utils/json-mgr');

const addToDailyTransactions = async data => {
    const fileName = `./daily-transactions/${(new Date()).toLocaleDateString()}.json`;
    const curTransactions = await jsonMgr.get(fileName) || [];
    curTransactions.push(data);
    await jsonMgr.save(fileName, curTransactions);
};

module.exports = async (Robinhood, ticker, quantity = 1) => {
    console.log('limit selling', ticker);
    const quoteData = await Robinhood.quote_data(ticker);
    let { last_trade_price: lastTrade, instrument } = quoteData.results[0];
    lastTrade = +(Number(lastTrade).toFixed(2));
    var options = {
        type: 'limit',
        quantity,
        bid_price: lastTrade,
        instrument: {
            url: instrument,
            symbol: ticker
        }
        // // Optional:
        // trigger: String, // Defaults to "gfd" (Good For Day)
        // time: String,    // Defaults to "immediate"
        // type: String     // Defaults to "market"
    };
    await addToDailyTransactions({
        type: 'sell',
        ticker,
        bid_price: lastTrade,
        quantity
    });
    console.log(options);
    return await Robinhood.place_sell_order(options);
};
