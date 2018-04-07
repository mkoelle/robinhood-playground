// gets current strategy performance of picks looking back n days
const NUM_DAYS = 2;

const cTable = require('console.table');

const fs = require('mz/fs');
const { analyzeDay } = require('../app-actions/record-strat-perfs');
const jsonMgr = require('../utils/json-mgr');
const avgArray = require('../utils/avg-array');

const strategyPerfToday = require('./strategy-perf-today');

let Robinhood;

class HashTable {
    constructor() {
        this.hashes = {};
    }
    put ( key, value ) {
        this.hashes[ JSON.stringify( key ) ] = value;
    }
    get ( key ) {
        return this.hashes[ JSON.stringify( key ) ];
    }
    keys () {
        return Object.keys(this.hashes)
            .map(hash => JSON.parse(hash));
    }
    print () {
        console.log(JSON.stringify(this.hashes, null, 2));
    }
}

module.exports = async (Robinhood, includeToday, daysBack = NUM_DAYS, minCount = 0) => {
    console.log('includeToday', includeToday);
    console.log('days back', daysBack);
    console.log('mincount', minCount);


    let files = await fs.readdir('./strat-perfs');

    let sortedFiles = files
        .map(f => f.split('.')[0])
        .sort((a, b) => new Date(a) - new Date(b));

    let threeMostRecent = sortedFiles.slice(0 - daysBack);
    console.log('selected days', threeMostRecent);

    const stratResults = new HashTable();
    for (let day of threeMostRecent) {

        const dayStrats = await jsonMgr.get(`./strat-perfs/${day}.json`);
        Object.keys(dayStrats).forEach(period => {

            const sellMin = Number(period.substring(period.lastIndexOf('-') + 1));
            if (period !== 'next-day-9') return; // only consider 9 minute sell times
            dayStrats[period].forEach(stratPerf => {
                if (stratPerf.avgTrend > 100) return;
                const split = stratPerf.strategyName.split('-');
                const buyMin = Number(split.pop());
                const strategyName = split.join('-');
                const key = {
                    strategyName,
                    buyMin,
                    // sellMin
                };
                stratResults.put(key, (stratResults.get(key) || []).concat(stratPerf.avgTrend));
            });

        });
    }

    // should includetoday?
    if (includeToday) {
        console.log('adding today');
        const todayPerf = await strategyPerfToday(Robinhood);
        todayPerf.forEach(perf => {
            let { strategyName, avgTrend } = perf;
            const lastDash = strategyName.lastIndexOf('-');
            const buyMin = Number(strategyName.substring(lastDash + 1));


            strategyName = strategyName.substring(0, lastDash);
            const key = {
                strategyName,
                buyMin
            };

            // const curCount = (stratResults.get(key) || []).length;
            // console.log(curCount, 'curcount');
            console.log(key, 'key', avgTrend);

            // const trendCurCountTimes = Array(curCount || 1).fill(avgTrend);
            stratResults.put(key, (stratResults.get(key) || []).concat(avgTrend));
        });
        console.log('turkey true', todayPerf);
    }

    stratResults.keys().forEach(keyObj => {
        const arrayOfTrends = stratResults.get(keyObj);
        stratResults.put(keyObj, {
            avgTrend: avgArray(arrayOfTrends),
            count: arrayOfTrends.length,
            trends: arrayOfTrends
        });
    });

    const allPerfs = [];
    stratResults.keys().forEach(keyObj => {
        const strategyPerformance = stratResults.get(keyObj);
        allPerfs.push({
            ...keyObj,
            ...strategyPerformance
        });
    });
    // stratResults.print();

    // console.log('all', allPerfs)

    const withoutPerms = allPerfs
        .filter(({ strategyName }) => {
            const lastChunk = strategyName.substring(strategyName.lastIndexOf('-') + 1);
            return !['single', 'first3'].includes(lastChunk);
        })
        .filter(perf => perf.count >= minCount);

    const withData = withoutPerms.map(({ strategyName, avgTrend, buyMin, trends, count }) => ({
        name: strategyName + '-' + buyMin,
        avgTrend,
        // trends: trends.map(t => Math.round(t)),
        percUp: trends.filter(t => t > 0).length / trends.length,
        count
    }));

    const sortedByAvgTrend = withData
        .sort((a, b) => b.avgTrend - a.avgTrend)
        .slice(0);

    // console.log(sortedByAvgTrend);
    console.log('sorted by avg trend')
    console.table(sortedByAvgTrend);

    const sortedByPercUp = withData
        // .filter(t => t.trend.length > 30)
        // .filter(t => t.trends.filter(trend => trend < 0).length < 8)
        .sort((a, b) => {
            return (b.percUp == a.percUp) ? b.avgTrend - a.avgTrend : b.percUp - a.percUp;
        });



    console.log('sorted by perc up')
    console.table(sortedByPercUp);

    return {
        sortedByAvgTrend,
        sortedByPercUp
    };

};
