const rh = require('../rh');

const limitSellLastTrade = require('./limit-sell-last-trade');

const sellAllStocks = async () => {
    const { results: allPositions } = await rh().nonzero_positions();
    console.log('allpos', allPositions);

    const sellPosition = async pos => {
        const instrument = await rh().url(pos.instrument);
        const response = await limitSellLastTrade(
            instrument.symbol,
            pos.quantity
        );
        console.log('pos,', pos);
        console.log('ins', instrument);
        console.log('response', response);
        return response;
    };

    for (let pos of allPositions) {
        await sellPosition(pos);
    }
};

module.exports = sellAllStocks;
