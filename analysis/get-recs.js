const stratPerfOverall = require('./strategy-perf-overall');
const { uniqifyArrayOfStrategies } = require('../utils/uniqify-stuff');

module.exports = async (Robinhood) => {
    const overall = await stratPerfOverall(Robinhood, true, 10, 5);
    console.log(overall);

    const hundredUpPicks = overall.sortedByAvgTrend
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

    const withUniq = (name, list) => ({
        [`${name}`]: getNames(list),
        [`uniq-${name}`]: getNames(uniqifyArrayOfStrategies(list))
    });

    return Object.keys(picks).reduce((acc, val) => ({
        ...acc,
        ...withUniq(
            val,
            picks[val]
        )
    }), {});


    // my current prediction: uniq-hundredWithHundredCheck

};
