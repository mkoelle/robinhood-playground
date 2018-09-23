// utils
const regCronIncAfterSixThirty = require('../utils/reg-cron-after-630');

// app-actions
const executeStrategy = require('../app-actions/execute-strategy');

const getTrendAndSave = require('../app-actions/get-trend-and-save');
const limitBuyMultiple = require('../app-actions/limit-buy-multiple');
const addOvernightJump = require('../app-actions/add-overnight-jump-and-tso');
const getUpStreak = require('../app-actions/get-up-streak');

const cancelAllOrders = require('../rh-actions/cancel-all-orders');


const mapLimit = require('promise-map-limit');

const getTicks = arr => arr.map(buy => buy.ticker);
const trendFilter = async (Robinhood, trend) => {

    const withUpstreak = await mapLimit(trend, 20, async buy => ({
        ...buy,
        upstreak: await getUpStreak(Robinhood, buy.ticker)
    }));

    const withOvernightJump = await addOvernightJumpAndTSO(Robinhood, withUpstreak);

    console.log('with withOvernightJump and upstreak')
    // console.log(withOvernightJump);

    const upstreakVariations = (numStreak, trend) => {
        return {
            [`${numStreak}days`]: getTicks(trend),  // all of them woah!
            [`${numStreak}days-gt1overnight`]: getTicks(trend.filter(buy => buy.overnightJump > 1)),
            [`${numStreak}days-gt3overnight`]: getTicks(trend.filter(buy => buy.overnightJump > 3)),
            [`${numStreak}days-ltneg1overnight`]: getTicks(trend.filter(buy => buy.overnightJump < -1)),
            [`${numStreak}days-ltneg3overnight`]: getTicks(trend.filter(buy => buy.overnightJump < -3))
        };
    };

    return {
        ...upstreakVariations('3to5', withOvernightJump.filter(({ upstreak }) => upstreak >= 3 && upstreak <= 5)),
        ...upstreakVariations('4', withOvernightJump.filter(({ upstreak }) => upstreak === 4)),
        ...upstreakVariations('5', withOvernightJump.filter(({ upstreak }) => upstreak === 5)),
        ...upstreakVariations('6', withOvernightJump.filter(({ upstreak }) => upstreak === 6)),
        ...upstreakVariations('7', withOvernightJump.filter(({ upstreak }) => upstreak === 7)),
        ...upstreakVariations('8', withOvernightJump.filter(({ upstreak }) => upstreak === 8)),
        ...upstreakVariations('9', withOvernightJump.filter(({ upstreak }) => upstreak === 9)),
        ...upstreakVariations('6to8', withOvernightJump.filter(({ upstreak }) => upstreak >= 6 && upstreak <= 8)),
        ...upstreakVariations('gt8', withOvernightJump.filter(({ upstreak }) => upstreak >= 8)),
    };
};

const upstreak = {
    name: 'up-streak',
    trendFilter,
    run: [45, 189],
};


module.exports = upstreak;
