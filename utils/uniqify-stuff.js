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



module.exports = {
    uniqifyArray
};
