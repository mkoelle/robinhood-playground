# robinhood-playground

this repo is a Node.js stock scanner with Robinhood integration currently focused on penny stocks.

## to run

`npm install`

create a config.js file that exports an object
```
module.exports = {
    credentials: {
      username: 'robinhoodusername',
      password: 'robinhoodpassword'
    }
};
```

`npm start`

## tell me about the folders

actions are divided up into "app-actions" and "rh-actions" (robinhood actions)

modules are generally "strategies", but can be anything that runs at app init and using utils/reg-cron-after-630 something that gets run at various times of the day

picks-data - each day a folder is created that saves the "picks" for each of the strategies / modules whenever they are run

daily-transactions - the actual transactions that the program went ahead and bought or sold for each day

stock-data - contains all the output of getTrendAndSave

strat-perfs - when app-actions/record-strat-perfs is run, it calculates how well each of the strategies from the previous day have trended and averages them out, calculated at multiple times of the day as well

shared-async and socket-server should be deleted

## how does it work?

strategies are mostly "trendFilter"s.  which just take in a Robinhood instance and the output of getTrendAndSave which contains all the tickers' quote_data and a few other things

## configuring

all strategies (modules/*) are enabled to run at various times per day.  they run for every increment of $1-5, $5-10 and $10-15.

strategies-enabled.js determines which strategies are "enabled for purchase"

## analytics

`node analysis/run day-report` - reports on how the purchases the app has made today have trended since they were purchased

`node analysis/run strategy-perf-overall` - how have each of the strategies trended over the last 7 days?  by avgTrend and percUp

`node analysis/run strategy-perf-today` - of the strategies that have recorded picks today, how have they trended?

--

`node analysis/run past-on-today` - look at strategy-perf-overall... if you were to have enabled the top 10 avgPerc and top 10 percUp strategies, how well would they have done today?


## todo

* integrate this electron front-end https://github.com/chiefsmurph/johns-electron-playground
* better manage dependency on pattern-predict
* fix filenames saved with `<` character (see https://github.com/chiefsmurph/robinhood-playground/issues/4)
* make it profitable
