const limitSellLastTrade = require('./limit-sell-last-trade');

const sellAllStocks = async (Robinhood) => {
    const { results: allPositions } = await Robinhood.nonzero_positions();
    console.log('allpos', allPositions);

    const sellPosition = async pos => {
        const instrument = await Robinhood.url(pos.instrument);
        const response = await limitSellLastTrade(
            Robinhood,
            {
                symbol: instrument.symbol,
                quantity: pos.quantity
            }
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
