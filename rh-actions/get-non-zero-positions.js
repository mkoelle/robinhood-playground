module.exports = Robinhood => {
  Robinhood.nonzero_positions((err, res, body) => {

    console.log(body, body.results.length);

    Robinhood.url(body.results[11].instrument, (err, res, body) => {
      console.log(body, 'eh');
    });

    Robinhood.url(body.results[11].url, (err, res, body) => {
      console.log(body, 'oh');
    });

  });
};
