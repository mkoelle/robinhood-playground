const mapLimit = require('promise-map-limit');
const { lookup } = require('yahoo-stocks');


module.exports = async (Robinhood) => {
    const { results: allPositions } = await Robinhood.nonzero_positions();
    // console.log('allpos', allPositions);
    const withTicks = await mapLimit(allPositions, 1, async pos => {
        const instrument = await Robinhood.url(pos.instrument);
        return {
            average_buy_price: Number(pos.average_buy_price),
            symbol: instrument.symbol,
            currentPrice: (await lookup(instrument.symbol)).currentPrice,
            quantity: pos.quantity
        };
    });
    console.log(withTicks);
    return withTicks;
};
