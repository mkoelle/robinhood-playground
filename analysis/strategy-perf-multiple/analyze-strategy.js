const analyzeDay = require('./analyze-day');
const avgArray = require('../../utils/avg-array');

const keyOrder = ['next-day-9', 'next-day-85', 'next-day-230', 'next-day-330', 'second-day-9', 'third-day-9', 'fourth-day-9'];


const analyzeStrategy = ({
    strategyName,
    stratObj,
    detailed = false
}) => {

    const analyzed = Object.keys(stratObj)
        .map(date => analyzeDay({
            strategyName,
            stratPerf: stratObj[date],
            date
        }))
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

    return {
        strategy: strategyName,
        percUp: withoutErrors.filter(a => a.didGoUp).length / withoutErrors.length,
        avgMax: avgArray(
            withoutErrors
                .map(a => a.maxUp)
                .filter(trend => Math.abs(trend) < 50)
        ),
        // numErrors: withErrors.length,
        count: withoutErrors.length,

        ...(detailed ? (() => {

            const breakdownRoundup = withoutErrors.reduce((acc, obj) => {
                const { breakdowns } = obj;
                Object.keys(breakdowns).forEach(key => {
                    acc[key] = (acc[key] || []).concat(breakdowns[key]);
                });
                return acc;
            }, {});

            console.log('breakdownround', breakdownRoundup);

            const breakdownStats = {};

            keyOrder.forEach(key => {
                if (!breakdownRoundup[key]) return;
                const filteredVals = breakdownRoundup[key].filter(t => Math.abs(t) < 50);
                breakdownStats[key] = {
                    avg: avgArray(filteredVals),
                    percUp: filteredVals.filter(a => a > 0).length / filteredVals.length
                }
            });

            return {
                daysDown: daysDown,
                breakdowns: breakdownStats,
                maxs: withoutErrors.map(a => a.maxUp),
                // hundredResult: withoutErrors.reduce((acc, obj) => {
                //     return acc * (obj.maxUp / 100 + 1)
                // }, 100)
            };

        })() : {
            daysDown: daysDown.length,
        })

        // dates: withoutErrors.map(a => a.date)
    };

};

module.exports = analyzeStrategy;
