module.exports = async (Robinhood, ticker, quantity = 1) => {
    console.log('limit selling', ticker);
    const quoteData = await Robinhood.quote_data(ticker);
    const { last_trade_price: lastTrade, instrument } = quoteData.results[0];
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
    return await Robinhood.place_sell_order(options);
};
