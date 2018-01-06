module.exports = (Robinhood) => {
    return new Promise((resolve, reject) => {

        Robinhood.url('http://api.robinhood.com/instruments/', (error, response, body) => {
            return error ? reject(error) : resolve(body);
        });

    });
};
