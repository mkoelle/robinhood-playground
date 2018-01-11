const mapLimit = require('promise-map-limit');

const getRisk = require('../rh-actions/get-risk');
const trendingUp = require('../rh-actions/trending-up');
const addOvernightJump = require('../app-actions/add-overnight-jump');

module.exports = async (Robinhood, trend) => {

    // stocks that went down overnight
    // trending upward
    console.log('running based on jump strategy');

    trend = addOvernightJump(trend);

    const downOvernight = trend.filter(stock => stock.overnightJump < -4);
    let cheapBuys = downOvernight.filter(stock => {
        return Number(stock.quote_data.last_trade_price) < 30;
    });

    console.log('total cheapbuys', cheapBuys.length);

    cheapBuys = await mapLimit(cheapBuys, 20, async buy => ({
        ...buy,
        ...await getRisk(Robinhood, buy.ticker),
        trendingUp: await trendingUp(Robinhood, buy.ticker, [180, 5])
    }));

    console.log('num not trending', cheapBuys.filter(buy => !buy.trendingUp).length);
    console.log('> 8% below max of year', cheapBuys.filter(buy => buy.percMax > -8).length);
    cheapBuys = cheapBuys.filter(buy => buy.trendingUp && buy.percMax < -8);

    console.log(cheapBuys, cheapBuys.length);
    return cheapBuys.map(stock => stock.ticker);
};
