const jsonMgr = require('../utils/json-mgr');
// const scrapeYahooPrice = require('../app-actions/scrape-yahoo-price');
const { lookup } = require('yahoo-stocks');

const boughtThisStockToday = async ticker => {
    const fileName = `./daily-transactions/${(new Date()).toLocaleDateString()}.json`;
    const curTransactions = await jsonMgr.get(fileName) || [];
    return curTransactions.some(transaction => {
        return transaction.ticker === ticker && transaction.type === 'buy';
    });
};

const addToDailyTransactions = async data => {
    const fileName = `./daily-transactions/${(new Date()).toLocaleDateString()}.json`;
    const curTransactions = await jsonMgr.get(fileName) || [];
    curTransactions.push(data);
    await jsonMgr.save(fileName, curTransactions);
};

module.exports = async (Robinhood, {
    ticker,
    quantity = 1,
    bidPrice
}) => {
    console.log('limit selling', ticker);

    if (await boughtThisStockToday(ticker)) {
        console.log('not selling ', ticker, 'because bought today');
        return;
    }

    const quoteData = await Robinhood.quote_data(ticker);
    var {
        last_trade_price: lastTrade,
        instrument
    } = quoteData.results[0];

    if (!bidPrice) {
        bidPrice = (await lookup(ticker)).currentPrice || lastTrade;
    }
    bidPrice = +(Number(bidPrice).toFixed(2));

    var options = {
        type: 'limit',
        quantity,
        bid_price: bidPrice,
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
        bid_price: bidPrice,
        quantity
    });
    console.log(options);
    const res = await Robinhood.place_sell_order(options);
    // console.log(res, 'res')
    return res;
};
