const { credentials } = require('../config');

module.exports = () => {
    return new Promise((resolve) => {
        const Robinhood = require('robinhood')(credentials, () => {
            resolve(Robinhood);
        });
    });
};
