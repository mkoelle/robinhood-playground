const mapLimit = require('promise-map-limit');

const getRisk = require('./rh-actions/get-risk');
const trendingUp = require('./rh-actions/trending-up');

module.exports = {

    daytime: async (Robinhood, trend) => {

        // cheap stocks that are going up for the day
        // and up at many different intervals in the year, month ... etc

        console.log('total trend stocks', trend.length);
        const trendingUp = trend.filter(stock => stock.trend_since_open && stock.trend_since_open > 3);
        console.log('trendingUp', trendingUp.length);
        let cheapBuys = trendingUp.filter(stock => {
            return Number(stock.quote_data.last_trade_price) < 30;
        });
        console.log('trading below $30', cheapBuys.length);

        cheapBuys = await mapLimit(cheapBuys, 20, async buy => ({
            ...buy,
            ...await getRisk(Robinhood, buy.ticker),
            trendingUp: await trendingUp(Robinhood, buy.ticker, [180, 30, 10, 3])
        }));

        console.log('num watcout', cheapBuys.filter(buy => buy.shouldWatchout).length);
        console.log('num not trending', cheapBuys.filter(buy => !buy.trendingUp).length);
        console.log('> 5% below max of year', cheapBuys.filter(buy => buy.percMax > -8).length);
        cheapBuys = cheapBuys.filter(buy => !buy.shouldWatchout && buy.trendingUp && buy.percMax < -8);

        console.log(cheapBuys, cheapBuys.length);
        return cheapBuys.map(stock => stock.ticker);
    },

    beforeClose: async (Robinhood, trend) => {

        // cheap stocks that have gone down the most since open
        // but still going up recently 30 & 7 day trending
        // dont buy stocks that have fluctuated a lot before today

        const trendingBelow10 = trend.filter(stock => stock.trend_since_open && stock.trend_since_open < -8);
        console.log('trending below 10', trendingBelow10.length);

        const notJumpedSinceYesterday = trendingBelow10.filter(stock => stock.trend_since_prev_close < 6);
        console.log('not jumped more than 5% up since yesterday', notJumpedSinceYesterday.length);

        let cheapBuys = notJumpedSinceYesterday.filter(stock => {
            return Number(stock.quote_data.last_trade_price) < 30;
        });
        console.log('trading below $30', cheapBuys.length);

        cheapBuys = await mapLimit(cheapBuys, 20, async buy => ({
            ...buy,
            ...await getRisk(Robinhood, buy.ticker),
            trendingUp: await trendingUp(Robinhood, buy.ticker, [30, 7])
        }));
        console.log('num watcout', cheapBuys.filter(buy => buy.shouldWatchout).length);
        console.log('num not trending', cheapBuys.filter(buy => !buy.trendingUp).length);
        console.log('> 5% below max of year', cheapBuys.filter(buy => buy.percMax < -5).length);
        cheapBuys = cheapBuys.filter(buy => !buy.shouldWatchout && buy.trendingUp && buy.percMax < -5);

        console.log(cheapBuys, cheapBuys.length);

        return cheapBuys.map(stock => stock.ticker);
    }
};
