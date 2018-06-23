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
    // const createFastSimilarity = (() => {
    //     const cache = {};
    //     return {
    //         get:
    //     }
    // })();
    const trendCache = {};

    return array
        .reduce((acc, val) => {
            const foundInTrendCache = !!trendCache[val.trends];
            const shouldInclude = !foundInTrendCache && acc.every(strat => {
                const getSimilarity = (str1, str2) => {
                    str1 = str1.toString();
                    str2 = str2.toString();
                    return JSON.stringify(str1) === JSON.stringify(str2)
                        ? 1
                        : stringSimilarity.compareTwoStrings(str1, str2);
                };

                const trendSimilarity = getSimilarity(strat.trends, val.trends);
                const nameSimilarity = getSimilarity(strat.name, val.name);
                const valParts = val.name.split('-');
                const foundValRatio = valParts.filter(part => strat.name.includes(part)).length / valParts.length;
                // const
                // console.log(foundValRatio);
                // console.log('between', strat.name, ' and ', val.name, )
                return [trendSimilarity, nameSimilarity].every(similarity => similarity < strength) && foundValRatio < 0.8;
            });

            trendCache[val.trends] = true;
            return shouldInclude ? acc.concat(val) : acc;
        }, []);
};



module.exports = {
    uniqifyArray,
    uniqifyArrayOfStrategies
};
