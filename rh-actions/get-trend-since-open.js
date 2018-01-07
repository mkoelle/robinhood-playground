// pass an array of tickers or a single ticker string

// npm
const mapLimit = require('promise-map-limit');

// utils
const getTrend = require('../utils/get-trend');

const getTrendSinceOpen = {
    single: async (Robinhood, ticker) => {
        try {
            var [fundamentals, quote_data] = await Promise.all([
                Robinhood.fundamentals(ticker),
                Robinhood.quote_data(ticker)
            ]);

            fundamentals = fundamentals.results[0];
            quote_data = quote_data.results[0];

        } catch (e) {
            return { trendPerc: null };
        }
        // console.log('fund', ticker, fundamentals);
        // console.log('quo', ticker, quote_data);

        const { open } = fundamentals;
        const { last_trade_price } = quote_data;  // previous_close

        return {
            fundamentals,
            quote_data,
            open,
            last_trade_price,
            // previous_close,
            trendPerc: getTrend(last_trade_price, open)
        };
    },
    multiple: async (Robinhood, stocks) => {
        var timer = (() => {
            const start = new Date();
            return {
                stop: function() {
                    const end = new Date();
                    const time = end.getTime() - start.getTime();
                    return time;
                }
            };
        })();

        let curIndex = 0;
        let result = await mapLimit(stocks, 20, async ticker => {
            curIndex++;
            console.log(
                'getting trend',
                curIndex + ' of ' + stocks.length,
                ticker
            );
            const trend = await getTrendSinceOpen.single(Robinhood, ticker);
            return {
                ticker,
                ...trend
            };
        });

        result = result
            .filter(obj => obj.trendPerc)
            .sort((a, b) => b.trendPerc - a.trendPerc);

        console.log('result', result);
        const length = timer.stop();
        console.log('time', length, length / stocks.length);

        return result;
    }
};

module.exports = async (Robinhood, input) => {
    if (Array.isArray(input)) {
        return await getTrendSinceOpen.multiple(Robinhood, input);
    } else {
        return await getTrendSinceOpen.single(Robinhood, input);
    }
};
