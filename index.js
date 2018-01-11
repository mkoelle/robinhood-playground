

// console.log(stocks);
const login = require('./rh-actions/login');
const initCrons = require('./app-actions/init-crons');
const getAllTickers = require('./rh-actions/get-all-tickers');

let Robinhood, allTickers;

(async () => {

    Robinhood = await login();

    console.log('user', await Robinhood.accounts());
    
    // does the list of stocks need updating?
    try {
        allTickers = require('./stock-data/allStocks');
    } catch (e) {
        allTickers = await getAllTickers(Robinhood);
    }
    allTickers = allTickers
        .filter(stock => stock.tradeable)
        .map(stock => stock.symbol);

    initCrons(Robinhood);

    // startCrons();

})();
