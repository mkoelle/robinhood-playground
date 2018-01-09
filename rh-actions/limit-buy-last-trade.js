const jsonMgr = require('../utils/json-mgr');

const alreadySoldThisStockToday = async ticker => {
    const fileName = `./daily-transactions/${(new Date()).toLocaleDateString()}.json`;
    const curTransactions = await jsonMgr.get(fileName) || [];
    return curTransactions.some(transaction => {
        return transaction.ticker === ticker && transaction.type === 'sell';
    });
};

const addToDailyTransactions = async data => {
    const fileName = `./daily-transactions/${(new Date()).toLocaleDateString()}.json`;
    const curTransactions = await jsonMgr.get(fileName) || [];
    curTransactions.push(data);
    await jsonMgr.save(fileName, curTransactions);
};

const limitBuyLastTrade = {
    single: async (Robinhood, ticker, maxPrice) => {

        if (await alreadySoldThisStockToday(ticker)) {
            console.log('not purchasing ', ticker, 'because already sold today');
            return;
        }

        console.log('limit buying', ticker);
        const quoteData = await Robinhood.quote_data(ticker);
        let { last_trade_price: lastTrade, instrument } = quoteData.results[0];
        lastTrade = +(Number(lastTrade).toFixed(2));
        const quantity = Math.floor(maxPrice / lastTrade);
        console.log('last trade price', lastTrade);
        console.log('maxPrice', maxPrice);
        console.log('quanity', quantity);

        if (!quantity) return;

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
            type: 'buy',
            ticker,
            bid_price: lastTrade,
            quantity
        });
        return await Robinhood.place_buy_order(options);
    },
    multiple: async (Robinhood, stocksToBuy, totalAmtToSpend, numberOfStocksPurchasing) => {

        // you cant attempt to purchase more stocks than you passed in
        console.log(numberOfStocksPurchasing, 'numstockstopurchase', stocksToBuy.length);
        numberOfStocksPurchasing = numberOfStocksPurchasing ? Math.min(stocksToBuy.length, numberOfStocksPurchasing) : stocksToBuy.length;

        let numPurchased = 0;

        // randomize the order
        stocksToBuy = stocksToBuy.sort(() => Math.random() > Math.random());
        for (let stock of stocksToBuy) {
            const perStock = totalAmtToSpend / numberOfStocksPurchasing;
            const response = await limitBuyLastTrade.single(Robinhood, stock, perStock);
            console.log('response for limitorder');
            console.log(response);

            if (!response || response.detail) {
                // failed
                console.log('failed purchase for ', stock);
            } else {
                console.log('success,', stock);
                numPurchased++;
                if (numPurchased === numberOfStocksPurchasing) {
                    break;
                }
            }
        }
    }
};

module.exports = async (Robinhood, input, totalAmtToSpend, numStocksToPurchase) => {
    if (Array.isArray(input)) {
        return await limitBuyLastTrade.multiple(Robinhood, input, totalAmtToSpend, numStocksToPurchase);
    } else {
        return await limitBuyLastTrade.single(Robinhood, input, totalAmtToSpend);
    }
};
