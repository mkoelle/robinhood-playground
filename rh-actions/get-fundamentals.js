module.exports = (Robinhood, ticker) => {
    return new Promise((resolve, reject) => {

        Robinhood.fundamentals(ticker, (error, response, body) => {
            return error ? reject(error) : resolve(body);
        });

    });
};
