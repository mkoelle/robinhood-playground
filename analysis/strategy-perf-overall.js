// gets current strategy performance of picks looking back n days
const NUM_DAYS = 17;

const cTable = require('console.table');

const fs = require('mz/fs');
const { analyzeDay } = require('../app-actions/record-strat-perfs');
const jsonMgr = require('../utils/json-mgr');
const avgArray = require('../utils/avg-array');

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

module.exports = async (Robinhood) => {

    let files = await fs.readdir('./strat-perfs');

    let sortedFiles = files
        .map(f => f.split('.')[0])
        .sort((a, b) => new Date(a) - new Date(b));

    let threeMostRecent = sortedFiles.slice(0 - NUM_DAYS);
    console.log('selected days', threeMostRecent);

    const stratResults = new HashTable();
    for (let day of threeMostRecent) {

        const dayStrats = await jsonMgr.get(`./strat-perfs/${day}.json`);
        Object.keys(dayStrats).forEach(period => {

            const sellMin = Number(period.substring(period.lastIndexOf('-') + 1));
            dayStrats[period].forEach(stratPerf => {
                const split = stratPerf.strategyName.split('-');
                const buyMin = Number(split.pop());
                const strategyName = split.join('-');
                const key = {
                    strategyName,
                    // buyMin,
                    sellMin
                };
                stratResults.put(key, (stratResults.get(key) || []).concat(stratPerf.avgTrend));
            });

        });
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
        // .filter(({ strategyName }) => {
        //     const lastChunk = strategyName.substring(strategyName.lastIndexOf('-') + 1);
        //     return !['single', 'first3'].includes(lastChunk);
        // })
        .filter(perf => perf.count >= 3);

    const withData = withoutPerms.map(({ strategyName, avgTrend, sellMin, trends }) => ({
        name: strategyName + '-' + sellMin,
        avgTrend,
        trends: trends.map(t => Math.round(t)),
        percUp: trends.filter(t => t > 0).length / trends.length
    }));

    const sortedByAvgTrend = withData
        .sort((a, b) => b.avgTrend - a.avgTrend)
        .slice(0);

    // console.log(sortedByAvgTrend);
    console.log('sorted by avg trend')
    console.table(sortedByAvgTrend);

    const sortedByPercUp = withData
        // .filter(t => t.trends.filter(trend => trend < 0).length < 8)
        .sort((a, b) => b.percUp - a.percUp);



    console.log('sorted by perc up')
    console.table(sortedByPercUp);

    return {
        sortedByAvgTrend,
        sortedByPercUp
    };

};
