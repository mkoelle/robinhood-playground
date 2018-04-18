const detailedNonZero = require('./detailed-non-zero');
const activeSell = require('./active-sell');

const mapLimit = require('promise-map-limit');

const daysBetween = (firstDate, secondDate) => {
    var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
    var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
    return diffDays;
};

module.exports = async Robinhood => {
    const nonzero = await detailedNonZero(Robinhood);
    const withAge = nonzero.map(pos => ({
        ...pos,
        dayAge: daysBetween(new Date(), new Date(pos.created_at))
    }));

    const olderThanTwoDays = withAge.filter(pos => pos.dayAge >= 2);

    console.log(nonzero.length, 'total', olderThanADay.length, 'olderThanTwoDay');

    const results = mapLimit(olderThanTwoDays, 3, async pos => {
        const sellRatio = (pos.dayAge === 2) ? 0.5 : 1;
        console.log('selling', sellRatio * 100, '% of', pos.symbol, 'age=', pos.dayAge);
        const numSharesToSell = Math.ceil(pos.quantity * sellRatio);
        try {
            const response = await activeSell(
                Robinhood,
                {
                    ticker: pos.symbol,
                    quantity: numSharesToSell
                }
            );
            console.log('sold because olderThanTwoDays', pos.symbol);
        } catch (e) {
            console.log('more err', e);
        }
    });

    console.log('DONE selling older than a day')
};
