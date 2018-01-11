const jsonMgr = require('../utils/json-mgr');
// const avgArray = require('../utils/avg-array');

const scrapeYahooPrice = require('../app-actions/scrape-yahoo-price');

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
    single: async (Robinhood, { ticker, maxPrice, strategy }) => {

        if (await alreadySoldThisStockToday(ticker)) {
            console.log('not purchasing ', ticker, 'because already sold today');
            return;
        }

        console.log('limit buying', ticker);

        const quoteData = await Robinhood.quote_data(ticker);
        let {
            last_trade_price: lastTrade,
            instrument,
            // ask_price: askPrice
        } = quoteData.results[0];

        //
        // const impNums = [
        //     askPrice,
        //     lastTrade
        // ].map(val => Number(val)).filter(val => val > 0);
        //
        // let bidPrice = avgArray(impNums);
        let bidPrice = await scrapeYahooPrice(ticker) || lastTrade;
        bidPrice = +(Number(bidPrice).toFixed(2));

        const quantity = Math.floor(maxPrice / bidPrice);
        console.log('bidPrice', bidPrice);
        console.log('maxPrice', maxPrice);
        console.log('quanity', quantity);

        if (!quantity || !bidPrice || !maxPrice) return;

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
            type: 'buy',
            ticker,
            bid_price: bidPrice,
            quantity,
            strategy
        });
        return await Robinhood.place_buy_order(options);
    },
    multiple: async (Robinhood, stocksToBuy, totalAmtToSpend, numberOfStocksPurchasing, strategy) => {

        // you cant attempt to purchase more stocks than you passed in
        console.log(numberOfStocksPurchasing, 'numstockstopurchase', stocksToBuy.length);
        numberOfStocksPurchasing = numberOfStocksPurchasing ? Math.min(stocksToBuy.length, numberOfStocksPurchasing) : stocksToBuy.length;

        let numPurchased = 0;

        // randomize the order
        stocksToBuy = stocksToBuy.sort(() => Math.random() > Math.random());
        let amtToSpendLeft = totalAmtToSpend;
        let failedStocks = [];
        for (let stock of stocksToBuy) {
            const perStock = amtToSpendLeft / (numberOfStocksPurchasing - numPurchased);
            const response = await limitBuyLastTrade.single(Robinhood, {
                ticker: stock,
                maxPrice: perStock,
                strategy
            });
            console.log('response for limitorder');
            console.log(response);

            if (!response || response.detail) {
                // failed
                failedStocks.push(stock);
                console.log('failed purchase for ', stock);
            } else {
                console.log('success,', stock);
                amtToSpendLeft -= perStock;
                numPurchased++;
                if (numPurchased === numberOfStocksPurchasing) {
                    break;
                }
            }
        }

        console.log('finished purchasing', stocksToBuy.length, 'stocks');
        console.log('attempted amount', totalAmtToSpend);
        console.log('amount leftover', amtToSpendLeft);
        failedStocks.length && console.log('failed stocks', JSON.stringify(failedStocks));
    }
};

module.exports = async (Robinhood, input, totalAmtToSpend, numStocksToPurchase, strategy) => {
    console.log('limit buy', Robinhood, input, totalAmtToSpend, numStocksToPurchase, strategy);
    if (Array.isArray(input)) {
        return await limitBuyLastTrade.multiple(Robinhood, input, totalAmtToSpend, numStocksToPurchase, strategy);
    } else {
        return await limitBuyLastTrade.single(Robinhood, input, totalAmtToSpend);
    }
};
