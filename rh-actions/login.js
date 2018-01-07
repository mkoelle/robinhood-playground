const { credentials } = require('../config');


const retry3x = require('../utils/retry-3x');


module.exports = () => {
    return new Promise((resolve) => {
        const Robinhood = require('robinhood')(credentials, () => {

            // promisfy all functions
            Object.keys(Robinhood).forEach(key => {
                console.log('key', key);
                const origFn = Robinhood[key];
                Robinhood[key] = retry3x((...callArgs) => {
                    return new Promise((resolve, reject) => {
                        origFn.apply(null, [...callArgs, (error, response, body) => {
                            return (error) ? reject(error) : resolve(body);
                        }]);
                    });
                });
            });

            resolve(Robinhood);
        });
    });
};
