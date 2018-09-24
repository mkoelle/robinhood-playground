const fs = require('mz/fs');
const path = require('path');
const regCronIncAfterSixThirty = require('../utils/reg-cron-after-630');
const executeStrategy = require('./execute-strategy');

let modules = [];

const initModule = (Robinhood, module) => {
    const {
        name, 
        run,
        trendFilter,
        fn
    } = module;
    regCronIncAfterSixThirty(Robinhood, {
        name: `execute ${name} strategy`,
        run,
        // run: [],
        fn: async (Robinhood, min) => {
            return !!fn 
                ? fn(Robinhood, min) 
                : executeStrategy(Robinhood, trendFilter, min, 0.3, name);
        }
    });
};


const handleModuleFile = (Robinhood, moduleFile) => {
    const toRun = Array.isArray(moduleFile) ? moduleFile : [moduleFile];
    toRun.forEach(singleModule => {
        initModule(Robinhood, singleModule);
    });
    modules = [...modules, ...toRun];
};


module.exports = async (Robinhood) => {

    var normalizedPath = path.join(__dirname, '../modules');

    const files = (await fs.readdir(normalizedPath))
        .filter(fileName => !fileName.startsWith('.'))
        .map(fileName => `${normalizedPath}/${fileName}`);

    for (let file of files) {
        const isDir = (await fs.lstat(file)).isDirectory();
        // if (!isDir) {
        try {
            const moduleFile = require(file);
            handleModuleFile(Robinhood, moduleFile);
        } catch (e) {
            console.log('unable to init', file, e);
        }
        // }
    }

};
