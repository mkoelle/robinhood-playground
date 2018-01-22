const detailedNonZero = require('./detailed-non-zero');
const limitSellLastTrade = require('../rh-actions/limit-sell-last-trade');
const activeSell = require('./active-sell');

module.exports = async Robinhood => {
    const nonzero = await detailedNonZero(Robinhood);
    const goneUp = nonzero.filter(pos => pos.currentPrice > pos.average_buy_price);
    console.log(nonzero.length, 'total', goneUp.length, 'gone up');
    console.log(goneUp);
    for (let pos of goneUp) {
        const response = await activeSell(
            Robinhood,
            {
                symbol: pos.symbol,
                quantity: pos.quantity
            }
        );
        console.log(response);
    }

};
