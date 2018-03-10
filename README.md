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

## configuring

all strategies (modules/*) are enabled to run at various times per day.  they run for every increment of $1-5, $5-10 and $10-15.

strategies-enabled.js determines which strategies are "enabled for purchase"

## analytics

`node analysis/run day-report` - reports on how the purchases the app has made today have trended since they were purchased

`node analysis/run strategy-perf-overall` - how have each of the strategies trended over the last 7 days?  by avgTrend and percUp

`node analysis/run strategy-perf-today` - of the strategies that have recorded picks today, how have they trended?

--

`node analysis/run past-on-today` - look at strategy-perf-overall... if you were to have enabled the top 10 avgPerc and top 10 percUp strategies, how well would they have done today?
