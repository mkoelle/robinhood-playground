const login = require('./rh-actions/login');
const getTrendSinceOpen = require('./rh-actions/getTrendSinceOpen');


const stocks = require('./stocks');

(async() => {

  const Robinhood = await login();

  const promiseArray = stocks.map(async ticker => {
    return {
      ticker,
      ...await getTrendSinceOpen(Robinhood, ticker)
    };
  });

  let result = await Promise.all(promiseArray);
  result = result
      .filter(obj => obj.trendPerc)
      .sort((a, b) => b.trendPerc - a.trendPerc);

  console.log(result);
  
})();
