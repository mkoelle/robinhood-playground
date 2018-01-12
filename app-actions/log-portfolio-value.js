// npm
const fs = require('mz/fs');

module.exports = async (Robinhood) => {

    // get portfolio value
    const { results: nonzero } = await Robinhood.nonzero_positions();
    const sumInvested = nonzero
        .map(obj => Number(obj.quantity) * Number(obj.average_buy_price))
        .reduce((acc, val) => acc + val, 0);

    const accounts = await Robinhood.accounts();
    const amtCash = Number(accounts.results[0].margin_balances.unallocated_margin_cash);
    const totalPortfolioValue = sumInvested + amtCash;
    console.log('user', JSON.stringify(totalPortfolioValue, null, 2));

    // log it
    let portfolioCache = {};
    try {
        portfolioCache = JSON.parse(await fs.readFile('./portfolio-cache.json'));
    } catch (e) {}
    const dateStr = new Date().toLocaleString();
    portfolioCache[dateStr] = totalPortfolioValue;
    try {
        await fs.writeFile('./portfolio-cache.json', JSON.stringify(portfolioCache, null, 2));
    } catch (e) {}

};
