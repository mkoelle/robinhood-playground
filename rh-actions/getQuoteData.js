module.exports = (Robinhood, ticker) => {
  return new Promise((resolve, reject) => {
    Robinhood.quote_data(ticker, (error, response, body) => {
        return error ? reject(error) : resolve(body);
    });
  });
};
