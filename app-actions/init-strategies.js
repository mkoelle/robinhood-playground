const fs = require('mz/fs');
const path = require('path');

const strategies = [];

module.exports = async (Robinhood) => {

    var normalizedPath = path.join(__dirname, '../strategies');

    (await fs.readdir(normalizedPath))
        .filter(fileName => !fileName.startsWith('.'))
        .map(fileName => `${normalizedPath}/${fileName}`)
        .forEach(async file => {
            console.log(file);

            const isDir = (await fs.lstat(file)).isDirectory();
            if (!isDir) {
                const strategyObj = require(file);
                strategyObj.init(Robinhood);
                strategies.push(strategyObj);
            }

        });

};
