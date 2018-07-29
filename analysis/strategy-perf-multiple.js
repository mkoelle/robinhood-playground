// gets current strategy performance of picks looking back n days
const NUM_DAYS = 2;

const cTable = require('console.table');

const fs = require('mz/fs');
const { analyzeDay } = require('../app-actions/record-strat-perfs');
const jsonMgr = require('../utils/json-mgr');
const avgArray = require('../utils/avg-array');

const strategyPerfToday = require('./strategy-perf-today');

let Robinhood;

const keyOrder = ['next-day-9', 'next-day-85', 'next-day-230', 'next-day-330', 'second-day-9', 'third-day-9', 'fourth-day-9'];

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

module.exports = async (Robinhood, daysBack = NUM_DAYS, ...strategies) => {
    console.log('days back', daysBack);
    console.log('strategies', strategies);

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

    console.log('loaded strats into memory');

    // const allStrategies = stratObj[days[0]]['next-day-9'].map(obj => obj.strategyName);

    const allStrategies = strategies.length ? strategies : (() => {
        const stratNames = [];
        Object.keys(stratObj).forEach(date => {
            Object.keys(stratObj[date]).forEach(timeKey => {
                const strats = stratObj[date][timeKey];
                strats.forEach(strat => {
                    stratNames.push(strat.strategyName);
                });
            });
        });
        return [...new Set(stratNames)];
    })();
    console.log('num strategies', allStrategies.length);
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

        const {
            key: winnerTime,
            avgTrend: maxUp,
            picks
        } = sorted[0];

        // if (maxUp > 50) {
        //     console.log('found big one')
        //     console.log(sorted[0], date);
        // }

        const stats = {
            didGoUp: trends.some(trend => trend > 0),
            maxUp,
            winnerTime,
            date,
            picks,
            breakdowns: sorted.reduce((acc, { key, avgTrend }) => ({
                ...acc,
                [key]: avgTrend
            }), {})
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
        //
        const daysDown = withoutErrors
            .filter(v => !v.didGoUp)
            // .map(v => v.date);

        // const breakdownRoundup = withoutErrors.reduce((acc, obj) => {
        //     const { breakdowns } = obj;
        //     Object.keys(breakdowns).forEach(key => {
        //         acc[key] = (acc[key] || []).concat(breakdowns[key]);
        //     });
        //     return acc;
        // }, {});
        //
        // const breakdownStats = {};
        // keyOrder.forEach(key => {
        //     if (!breakdownRoundup[key]) return;
        //     const filteredVals = breakdownRoundup[key].filter(t => Math.abs(t) < 50);
        //     breakdownStats[key] = {
        //         avg: avgArray(filteredVals),
        //         percUp: filteredVals.filter(a => a > 0).length / filteredVals.length
        //     }
        // });

        const roundup = {
            strategy,
            percUp: withoutErrors.filter(a => a.didGoUp).length / withoutErrors.length,
            avgMax: avgArray(
                withoutErrors
                    .map(a => a.maxUp)
                    .filter(trend => Math.abs(trend) < 50)
            ),
            numErrors: withErrors.length,
            count: withoutErrors.length,
            // breakdowns: breakdownStats
            daysDown,
            // maxs: withoutErrors.map(a => a.maxUp)
            // dates: withoutErrors.map(a => a.date)
        };

        allRoundup.push(roundup);
        // console.log(strategy, roundup);


        // console.log(trendObjs);

        if (index % 50 === 0) {
            console.log(index, '/', allStrategies.length);
        }

    });


    const createBreakdown = ({
        minPercUp = 0.95,
        scoreFn = ({ percUp, avgMax, count }) => percUp * avgMax * count,
        filterFn = () => true
    }) => {
        const filtered = allRoundup
            .filter(({ percUp }) => percUp > minPercUp)
            .filter(filterFn);
        const withScore = filtered.map(obj => ({
            ...obj,
            score: scoreFn(obj)
        }));
        const sorted = withScore.sort((a, b) => b.score - a.score);
        return sorted;
    };

    const topThirdCount = ({ count }) => count > daysBack * 2 / 3;

    return {
        all: createBreakdown({ minPercUp: 0 }),
        consistent: createBreakdown({
            minPercUp: 0.98,
            filterFn: topThirdCount,
        }),
        creme: createBreakdown({        // top third count
            filterFn: topThirdCount,
        }),
        moderates: createBreakdown({
            minPercUp: 0.92,
            filterFn: ({ count }) =>    // middle third count
                count <= daysBack * 2 / 3
                && count > daysBack / 3,
            // dont take count into consideration
            // scoreFn: ({ percUp, avgMax }) => percUp * avgMax
        }),
        occasionals: createBreakdown({  // bottom third count
            filterFn: ({ count }) => count <= daysBack / 3
        }),
    };

};
