const brain = require('brain.js');
const fs = require('mz/fs');
const jsonMgr = require('../utils/json-mgr');
const avgArray = require('../utils/avg-array');
const stratPerfOverall = require('../analysis/strategy-perf-overall');
const stringSimilarity = require('string-similarity');


const uniqifyArray = arrayOfStrategies => {
    return arrayOfStrategies.reduce((acc, val) => {
        const shouldInclude = acc.every(strat => {
            return stringSimilarity.compareTwoStrings(strat, val) < 0.5;
        });
        return shouldInclude ? acc.concat(val) : acc;
    }, []);
};

const uniqifyObj = obj => {
    return Object.keys(obj).reduce((acc, val) => {
        if (!obj[val][0]) {
            console.log('UH OH');
            console.log(obj[val], 'val');
            console.log(obj);
        }
        const allStrategyNames = obj[val].map(stratObj => stratObj.name);
        return {
            ...acc,
            [val]: allStrategyNames,
            [`${val}-uniq`]: uniqifyArray(allStrategyNames)
        };
    }, {});
};


const predictForDays = async (days, filterFn) => {

    console.log('days', days);
    const stratPerfsTrend = {};
    // console.log(allDays);
    for (let file of days) {
        const obj = await jsonMgr.get(`./strat-perfs/${file}`);
        // console.log(strategyName);
        // console.log(file);
        if (!obj['next-day-9']) continue;
        console.log('found', file, obj['next-day-9'].length);
        obj['next-day-9'].forEach(({ strategyName, avgTrend }) => {
            stratPerfsTrend[strategyName] = (stratPerfsTrend[strategyName] || []).concat([avgTrend]);
        });
    }


    const predictStrategy = (trends) => {
        console.log('strategy', trends)
        const trainingObjs = (() => {
            const arr = [];
            for (let i = 0; i < trends.length - 1; i++) {
                arr.push({
                    input: trends.slice(0, i + 1).map(n => Number(n)),
                    output: { outputTrend: [Number(trends[i + 1])] }
                });
            }
            return arr;
        })();

        // console.log(JSON.stringify(trainingObjs, null, 2));
        const net = new brain.NeuralNetwork();
        net.train(trainingObjs);
        const prediction = net.run(trends);
        // console.log(strategyName, 'strategy completed');
        return prediction;
        // var net2 = new brain.NeuralNetwork();
        // net2.train([
        //     { input: { r: 0.03, g: 0.7, b: 0.5 }, output: { black: 1 } },
        //     { input: { r: 0.16, g: 0.09, b: 0.2 }, output: { white: 1 } },
        //     { input: { r: 0.5, g: 0.5, b: 1.0 }, output: { white: 1 } }
        // ]);

        // var output = net2.run({ r: 1, g: 0.4, b: 0 }); // { white: 0.99, black: 0.002 }
        // console.log(output);
    };

    let toPredict = Object.keys(stratPerfsTrend);
    if (filterFn) {
        toPredict = toPredict.filter(strategyName => filterFn(stratPerfsTrend[strategyName]));
    }
    console.log('topredict count', toPredict.length);

    const allPredictions = toPredict
        .map((stratName, i, array) => {
            const weighted = stratPerfsTrend[stratName]
                .filter(trend => trend < 80)
                .map((trend, i) => Array(i).fill(trend))
                .reduce((a, b) => a.concat(b), [])
            console.log(i+1, '/', toPredict.length)
            return {
                name: stratName,
                myPrediction: avgArray(weighted),
                // brainPrediction: predictStrategy(stratPerfsTrend[stratName]),
                trend: weighted
            };
        });

    console.log('dayssss', days);
    console.log('allPredictions', JSON.stringify(allPredictions, null, 2));
    return {
        myPredictions: allPredictions
            .slice(0)
            .sort((a, b) => Number(b.myPrediction) - Number(a.myPrediction)),
        brainPredictions: allPredictions
            .slice(0)
            .sort((a, b) => Number(b.brainPrediction) - Number(a.brainPrediction))
    };

};

module.exports = {
    predictForDays,
    predictCurrent: async (numDays, filterFn, skipYesterday) => {
        console.log('predict current', numDays);
        let allDays = await fs.readdir(`./strat-perfs`);
        if (skipYesterday) allDays.pop();
        const forDays = numDays ? allDays.slice(0 - numDays) : allDays;
        const prediction = await predictForDays(forDays, filterFn);
        return uniqifyObj(prediction);
    },
    stratPerfPredictions: async (Robinhood, includeToday, numDays, minCount) => {
        const stratPerfData = await stratPerfOverall(this.Robinhood, includeToday, numDays, minCount);
        console.log('keys', Object.keys(stratPerfData));
        return uniqifyObj(stratPerfData);
    }
}
