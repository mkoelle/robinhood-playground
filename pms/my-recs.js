const stratPerfOverall = require('../analysis/strategy-perf-overall');
const { uniqifyArrayOfStrategies } = require('../utils/uniqify-stuff');

module.exports = async (Robinhood) => {

    const perms = [
        [20, 15],
        [10, 5],    // days, count
        [7, 4],
        [5, 3],
        [3, 2]
    ];

    let resultObj = {};

    for (let [day, minCount] of perms) {
        const { sortedByPercUp } = await stratPerfOverall(Robinhood, true, day, minCount);
        console.log(sortedByPercUp);

        const hundredUpPicks = sortedByPercUp
            .filter(pick => pick.percUp === 1);

        const hundredUpAvgGt4 = hundredUpPicks
            .filter(pick => pick.avgTrend > 4);

        const hundredUpTrendsAllGt1 = hundredUpAvgGt4
            .filter(pick => pick.trends.every(t => t > 1));

        const hundredWithHundredCheck = hundredUpTrendsAllGt1
            .filter(pick => pick.hundredResult > 135);

        const picks = {
            hundredUpPicks,
            hundredUpAvgGt4,
            hundredUpTrendsAllGt1,
            hundredWithHundredCheck
        };

        const getNames = arr => arr.map(pick => pick.name);

        const prefix = `day${day}count${minCount}`;
        const withUniq = (name, list) => ({
            [`${prefix}-${name}`]: getNames(list),
            [`${prefix}-uniq-${name}`]: getNames(uniqifyArrayOfStrategies(list))
        });

        resultObj = {
            ...resultObj,
            ...Object.keys(picks).reduce((acc, val) => ({
                ...acc,
                ...withUniq(
                   val,
                   picks[val]
                )
            }), {})
        };

    }

    return resultObj;

    // my current prediction: uniq-hundredWithHundredCheck

};
