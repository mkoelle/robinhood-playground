// pass an array of tickers or a single ticker string

// npm
const mapLimit = require('promise-map-limit');

// utils
const getTrend = require('../utils/get-trend');

const getTrendSinceOpen = {
  single: async (Robinhood, ticker) => {
      const [fundamentals, quote_data] = await Promise.all([
          Robinhood.fundamentals(ticker),
          Robinhood.quote_data(ticker)
      ]);

      // console.log(fundamentals);
      // console.log(quote_data);

      if (!fundamentals || !quote_data) {
          return null;
      }

      const { open } = fundamentals.results[0];
      const { previous_close, last_trade_price } = quote_data.results[0];

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
                const end  = new Date();
                const time = end.getTime() - start.getTime();
                return time;
            }
        }
    })();

    let curIndex = 0;
    let result = await mapLimit(stocks, 20, async ticker => {
      curIndex++;
      console.log('mapping', curIndex + ' of ' + stocks.length, ticker)
      const trend = await getTrendSinceOpen.single(Robinhood, ticker);
      return {
        ticker,
        ...trend
      };
    });

    result = result
        .filter(obj => obj.trendPerc)
        .sort((a, b) => b.trendPerc - a.trendPerc);

    console.log(result);
    const length = timer.stop();
    console.log('time', length, length/stocks.length);

    return result;

  }
};

module.exports = async (Robinhood, input) => {
  process.on('unhandledRejection', r => console.log(r));
  if (Array.isArray(input)) {
    return await getTrendSinceOpen.multiple(Robinhood, input);
  } else {
    return await getTrendSinceOpen.single(Robinhood, input)
  }
};
