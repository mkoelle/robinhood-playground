const stringSimilarity = require('string-similarity');

const uniqifyArray = (array, strength = 0.85) => {
    return array
        .reduce((acc, val) => {
            const shouldInclude = acc.every(strat => {
                return stringSimilarity.compareTwoStrings(strat, val) < strength;
            });
            return shouldInclude ? acc.concat(val) : acc;
        }, []);
};

const uniqifyArrayOfStrategies = (array, strength = 0.99) => {
    return array
        .reduce((acc, val) => {
            const shouldInclude = acc.every(strat => {
                const trendSimilarity = stringSimilarity.compareTwoStrings(strat.trends.toString(), val.trends.toString());
                const nameSimilarity = stringSimilarity.compareTwoStrings(strat.name, val.name);
                const valParts = val.name.split('-');
                const foundValRatio = valParts.filter(part => strat.name.includes(part)).length / valParts.length;
                // const
                console.log(foundValRatio);
                console.log('between', strat.name, ' and ', val.name, )
                return [trendSimilarity, nameSimilarity].every(similarity => similarity < strength) && foundValRatio < 0.8;
            });
            return shouldInclude ? acc.concat(val) : acc;
        }, []);
};



module.exports = {
    uniqifyArray,
    uniqifyArrayOfStrategies
};
