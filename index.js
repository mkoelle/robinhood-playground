const stocks = require('./stocks');

const login = require('./rh-actions/login');
const getTrendSinceOpen = require('./rh-actions/get-trend-since-open');
const getAllTickers = require('./rh-actions/get-all-tickers');

const fs = require('mz/fs');
const { CronJob } = require('cron');



const saveJSON = async (fileName, obj) => {
  await fs.writeFile(fileName, JSON.stringify(obj, null, 2));
};

const getTrendSinceOpenForAllStocks = async () => {


  const Robinhood = await login();

  console.log(await getAllTickers(Robinhood));

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

  return result;

};


new CronJob('31 06 * * 1-5', () => {
  
  [0, 3, 5, 10, 20, 30, 60, 75, 90, 105, 120, 180].forEach(min => {
    setTimeout(async () => {
      console.log(`getting trend since open for all stocks - 6:31am + ${min} minutes`);
      const trendingArray = await getTrendSinceOpenForAllStocks();

      const dateStr = (new Date()).toLocaleString();
      await saveJSON(`./stock-data/${dateStr} (+${min}).json`, trendingArray);

    }, min * 1000 * 60);
  });

}, null, true);
