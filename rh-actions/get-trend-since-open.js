const getFundamentals = require('./get-fundamentals');
const getQuoteData = require('./get-quote-data');

module.exports = async (Robinhood, ticker) => {

    const [fundamentals, quote_data] = await Promise.all([
        getFundamentals(Robinhood, ticker),
        getQuoteData(Robinhood, ticker)
    ]);

    // console.log(fundamentals);
    // console.log(quote_data);

    if (!fundamentals || !quote_data) {
        return null;
    }

    const { open } = fundamentals.results[0];
    const { previous_close, last_trade_price } = quote_data.results[0];

    const getTrend = (val1, val2) => {
        const changeAmt = Number(val1) - Number(val2);
        const trendPerc = changeAmt / Number(val2) * 100;
        return +(trendPerc.toFixed(2));
    };

    return {
        open,
        last_trade_price,
        // previous_close,
        trendPerc: getTrend(last_trade_price, open)
    };
};
