// calculates days and loads strat-perfs into stratObj
const fs = require('mz/fs');
const jsonMgr = require('../../utils/json-mgr');
const avgArray = require('../../utils/avg-array');

module.exports = async (daysBack) => {

    let files = await fs.readdir('./json/strat-perfs');

    let sortedFiles = files
        .map(f => f.split('.')[0])
        .sort((a, b) => new Date(a) - new Date(b));

    let days = sortedFiles.slice(0 - daysBack);
    console.log('selected days', days);

    const stratObj = {};
    for (let day of days) {
        const dayStrats = await jsonMgr.get(`./json/strat-perfs/${day}.json`);
        stratObj[day] = dayStrats;
    }

    console.log('loaded strats into memory');

    return {
        days,
        stratObj
    };

};
