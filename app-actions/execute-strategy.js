const cancelAllOrders = require('../rh-actions/cancel-all-orders');
const getTrendAndSave = require('./get-trend-and-save');
const purchaseStocks = require('./purchase-stocks');

const executeStrategy = async (Robinhood, strategyFn, min, ratioToSpend) => {
    await cancelAllOrders(Robinhood);
    const trend = await getTrendAndSave(min + '*');
    const toPurchase = await strategyFn(Robinhood, trend);
    await purchaseStocks(toPurchase, ratioToSpend);
};

module.exports = executeStrategy;
