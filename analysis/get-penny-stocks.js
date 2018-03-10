// const login = require('../rh-actions/login');
const getTrendAndSave = require('../app-actions/get-trend-and-save');

module.exports = async (Robinhood) => {
    let trend = await getTrendAndSave(Robinhood);
    const pennies = trend
        .filter(stock => {
            return Number(stock.last_trade_price) < 2 && Number(stock.last_trade_price) > 0.3;
        })
        // .map(stock => ({
        //     ticker: stock.ticker,
        //     last_trade_price: stock.last_trade_price
        // }))
        // .sort((a, b) => Number(b.fundamentals.pe_ratio) - Number(a.fundamentals.pe_ratio))
        // .slice(0, 100)
        .sort((a, b) => Number(a.last_trade_price) - Number(b.last_trade_price))
        .map(a => a.ticker);
    console.log(JSON.stringify(pennies, null, 2))
    return pennies;
};
