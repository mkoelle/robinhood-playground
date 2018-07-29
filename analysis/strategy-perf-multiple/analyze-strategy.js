const analyzeDay = require('./analyze-day');
const avgArray = require('../../utils/avg-array');

const keyOrder = ['next-day-9', 'next-day-85', 'next-day-230', 'next-day-330', 'second-day-9', 'third-day-9', 'fourth-day-9'];


const analyzeStrategy = (strategyName, stratObj) => {

    const analyzed = Object.keys(stratObj)
        .map(day => analyzeDay(strategyName, stratObj[day], day))
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
        strategy: strategyName,
        percUp: withoutErrors.filter(a => a.didGoUp).length / withoutErrors.length,
        avgMax: avgArray(
            withoutErrors
                .map(a => a.maxUp)
                .filter(trend => Math.abs(trend) < 50)
        ),
        // numErrors: withErrors.length,
        count: withoutErrors.length,
        // breakdowns: breakdownStats
        daysDown: daysDown.length,
        // maxs: withoutErrors.map(a => a.maxUp)
        // dates: withoutErrors.map(a => a.date)
    };

    return roundup;


};

module.exports = analyzeStrategy;
