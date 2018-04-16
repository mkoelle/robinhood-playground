// gets current strategy performance of picks TODAY

const fs = require('mz/fs');
const login = require('../rh-actions/login');
const { analyzeDay } = require('../app-actions/record-strat-perfs');

module.exports = async (Robinhood) => {
    let folders = await fs.readdir('./picks-data');

    let sortedFolders = folders.sort((a, b) => {
        return new Date(a) - new Date(b);
    });

    // console.log(sortedFolders);

    let todayReport = await analyzeDay(Robinhood, sortedFolders[sortedFolders.length - 1]);
    todayReport = todayReport.filter(strat => !strat.strategyName.includes('-first3') && !strat.strategyName.includes('-single') );
    // console.log(JSON.stringify(todayReport, null, 2));
    return todayReport;
};
