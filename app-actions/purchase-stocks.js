const limitBuyLastTrade = require('../rh-actions/limit-buy-last-trade');

const purchaseStocks = async (Robinhood, { stocksToBuy, ratioToSpend, strategy }) => {
    const accounts = await Robinhood.accounts();
    const totalAmtToSpend = Number(accounts.results[0].sma) * ratioToSpend;
    console.log('totalAmtToSpend', totalAmtToSpend);
    await limitBuyLastTrade(Robinhood, stocksToBuy, totalAmtToSpend, null, strategy);
};

module.exports = purchaseStocks;
