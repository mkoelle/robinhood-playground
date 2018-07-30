
const initStratPerfs = require('./init-strat-perfs');
const calcUniqStrategies = require('./calc-uniq-strategies');
const analyzeStrategy = require('./analyze-strategy');
const generateBreakdowns = require('./generate-breakdowns');

module.exports = async (Robinhood, daysBack = 2, ...strategies) => {
    console.log('days back', daysBack);

    const suppliedStrategies = strategies.length;
    if (suppliedStrategies) {
        console.log('strategies', strategies);
    }

    const { days, stratObj } = await initStratPerfs(daysBack);
    const allStrategies = strategies.length ? strategies : calcUniqStrategies(stratObj);

    console.log('num strategies', allStrategies.length);
    // const allStrategies = [
    //     'constant-risers-5minute-percUpHighClosePoints-lowovernightjumps-100',
    //     'based-on-jump-down3overnight-trending35257-notWatchout-first1-fiveTo10-30',
    //     'low-float-high-volume-volToAvgPoints-trend5to10-6'
    // ];

    const allRoundup = allStrategies.map((strategyName, index) => {
        const strategyAnalysis = analyzeStrategy({
            strategyName,
            stratObj,
            detailed: suppliedStrategies
        });
        if (index % 50 === 0) {
            console.log(index, '/', allStrategies.length);
        }
        return strategyAnalysis;
    });

    return suppliedStrategies ? allRoundup : generateBreakdowns(allRoundup);

};
