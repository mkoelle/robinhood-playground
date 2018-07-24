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

module.exports = async (Robinhood, includeToday, daysBack = NUM_DAYS, minCount = 0, ignoreYesterday, maxCount = Number.POSITIVE_INFINITY) => {
    console.log('includeToday', includeToday);
    console.log('days back', daysBack);
    console.log('mincount', minCount);

    const paramTrue = val => val && val.toString() === 'true';
    let files = await fs.readdir('./strat-perfs');

    let sortedFiles = files
        .map(f => f.split('.')[0])
        .sort((a, b) => new Date(a) - new Date(b));

    let days = sortedFiles.slice(0 - daysBack);
    console.log('selected days', days);

    const stratResults = new HashTable();
    const stratObj = {};
    for (let day of days) {
        const dayStrats = await jsonMgr.get(`./strat-perfs/${day}.json`);
        stratObj[day] = dayStrats;
    }

    const allStrategies = stratObj[days[0]]['next-day-9'].map(obj => obj.strategyName);
    // const allStrategies = [
    //     'constant-risers-5minute-percUpHighClosePoints-lowovernightjumps-100',
    //     'based-on-jump-down3overnight-trending35257-notWatchout-first1-fiveTo10-30',
    //     'low-float-high-volume-volToAvgPoints-trend5to10-6'
    // ];

    const analyze = (strategy, date) => {
        const foundTrends = [];
        const strat = stratObj[date];
        Object.keys(strat)
            // .filter(key => key.includes('next-day-9'))
            .forEach(key => {
                const foundObj = strat[key].find(obj => obj.strategyName === strategy);
                foundObj && foundTrends.push({
                    ...foundObj,
                    key
                });
            });

        // console.log(foundTrends);

        const allKeys = foundTrends.map(obj => obj.key);
        const requiredKeys = ['next-day-9'];

        if (
            allKeys.length < 0
            // !requiredKeys.every(key => allKeys.includes(key))
        ) {
            // console.log('has', allKeys);
            return {
                notEnoughError: true
            };
        }

        if (!foundTrends.length) {
            return null;
        }

        const sorted = foundTrends.sort((a, b) => b.avgTrend - a.avgTrend);
        const trends = foundTrends.map(trend => trend.avgTrend);

        const winnerTime = sorted[0].key;
        const stats = {
            didGoUp: trends.some(trend => trend > 0),
            maxUp: sorted[0].avgTrend,
            winnerTime,
            date
        };

        return stats;
    };


    const allRoundup = [];

    allStrategies.forEach((strategy, index) => {

        // const trendObjs = [];

        const analyzed = days
            .map(day => analyze(strategy, day))
            .filter(value => !!value);

        const withErrors = analyzed
            .filter(value => value.notEnoughError);

        // console.log('num errors', withErrors.length);

        const withoutErrors = analyzed
            .filter(value => !value.notEnoughError);

        const roundup = {
            strategy,
            percUp: withoutErrors.filter(a => a.didGoUp).length / withoutErrors.length,
            avgMax: avgArray(
                withoutErrors
                    .map(a => a.maxUp)
                    .filter(trend => trend < 100)
            ),
            numErrors: withErrors.length,
            count: withoutErrors.length,
            // dates: withoutErrors.map(a => a.date)
        };

        allRoundup.push(roundup);
        // console.log(strategy, roundup);


        // console.log(trendObjs);

        if (index % 50 === 0) {
            console.log(index, '/', allStrategies.length);
        }

    });

    return allRoundup
        .filter(r => r.count > 10)
        .sort((a, b) => b.percUp - a.percUp);

};
