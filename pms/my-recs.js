const stratPerfOverall = require('../analysis/strategy-perf-overall');
const strategyPerfToday = require('../analysis/strategy-perf-today');

const { uniqifyArrayOfStrategies } = require('../utils/uniqify-stuff');

module.exports = async (Robinhood) => {

    const todayPerf = await strategyPerfToday(Robinhood);

    const perms = [
        {
            dayCount: 1,
            minCounts: [1]
        },
        {
            dayCount: 3,
            minCounts: [2, 4]
        },
        {
            dayCount: 5,
            minCounts: [2, 3, 4]
        },
        {
            dayCount: 7,
            minCounts: [3, 5]
        },
        {
            dayCount: 10,
            minCounts: [2, 5, 7, 9]
        },
        {
            dayCount: 15,
            minCounts: [2, 5, 9, 13]
        },
        {
            dayCount: 20,
            minCounts: [2, 5, 10, 13, 17]
        },
        {
            dayCount: 25,
            minCounts: [7, 13, 18, 23]
        }
    ];

    const additionalVariations = {
        count2to4: pick => pick.count >= 2 && pick.count <= 4,
        creme: (pick, dayCount) => pick.count >= Math.ceil(dayCount * 0.69) && pick.percUp >= 0.88 && pick.avgTrend >= 2.9
    };

    let resultObj = {};

    const getNames = arr => arr.map(pick => pick.name);
    const uniqifyAndAddPM = (prefix, picksObj) => {
        const withUniq = (name, list) => ({
            [`${prefix}-${name}`]: getNames(list),
            [`${prefix}-uniq-${name}`]: getNames(uniqifyArrayOfStrategies(list))
        });
        resultObj = {
            ...resultObj,
            ...Object.keys(picksObj).reduce((acc, val) => ({
                ...acc,
                ...withUniq(
                   val,
                   picksObj[val]
                )
            }), {})
        };
    };

    const createPicksObjFromSortedByPercUp = sortedByPercUp => {
        const hundredUpPicks = sortedByPercUp
            .filter(pick => pick.percUp === 1);

        const hundredUpAvgGt4 = hundredUpPicks
            .filter(pick => pick.avgTrend > 4);

        const hundredUpTrendsAllGt1 = hundredUpAvgGt4
            .filter(pick => pick.trends.every(t => t > 1));

        const hundredWithHundredCheck = hundredUpTrendsAllGt1
            .filter(pick => pick.hundredResult > 135);

        const picksObj = {
            hundredUpPicks,
            hundredUpAvgGt4,
            hundredUpTrendsAllGt1,
            hundredWithHundredCheck
        };

        return picksObj;
    };

    for (let { dayCount, minCounts } of perms) {
        console.log('here')
        const { sortedByPercUp } = await stratPerfOverall(Robinhood, todayPerf, dayCount);
        console.log('hi')
        const filterSortedByPercUpAndAddToResults = (variationName, filterFn) => {
            const prefix = `day${dayCount}${variationName}`;
            const filteredStratPerf = sortedByPercUp.filter(filterFn);
            console.log('---filtered')
            const picksObj = createPicksObjFromSortedByPercUp(filteredStratPerf);
            console.log('---picksobj')
            uniqifyAndAddPM(prefix, picksObj);
            console.log('---uniq')
        };
        console.log('defined');

        minCounts.forEach(minCount => {
            console.log('bingo');
            filterSortedByPercUpAndAddToResults(
                `count${minCount}`,
                pick => pick.count >= minCount
            );
            console.log('bango')
        });

        Object.entries(additionalVariations).forEach(([variationName, filterFn]) => {
            filterSortedByPercUpAndAddToResults(
                variationName,
                pick => filterFn(pick, dayCount)
            );
        });
        console.log('done')
    }

    return resultObj;

};
