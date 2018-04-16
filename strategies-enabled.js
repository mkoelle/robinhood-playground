const hotStrats = [
    'dynamo-3000-top50tso-onlyWatchout-5lowestsharesToCap-351',
    'constant-risers-5minute-percUpHighClosePoints-140',
    'constant-downers-5minute-percDownLowClosePoints-filtered60-242',
    'sudden-drops-last30trend-fiveTo10-388',
    'dynamo-3000-top50tso-onlyWatchout-5lowestsharesToCap-381',
    'dynamo-3000-bottom50tso-notWatchout-5lowestsharesToCap-tenTo15-40',
    'constant-risers-10minute-percUpHighClose-250',
    'based-on-jump-down3overnight-ltneg50percmax-fiveTo10-5',
    'fizbiz-under5Target10Change2Vol200Within10of52Low-75',
    'dow-historical-sortedByAvgToday-73',
    'up-streak-3to5days-ltneg1overnight-fiveTo10-189',
    'based-on-jump-down3overnight-trending35257-5',
    'dynamo-3000-middle50tso-onlyWatchout-5lowestYP-4',
    'based-on-jump-down3overnight-gtneg20percmax-fiveTo10-30',
    'constant-downers-5minute-percDownCloseOnlyPoints-filtered40-242',
    'dow-historical-sortedByAvgToday-73',
    'constant-risers-10minute-percUpHighClosePoints-300',
    'week-swings-tenTo15-1',
    'sudden-drops-last30trend-fiveTo10-388',
    'based-on-jump-up3overnight-ltneg50percmax-tenTo15-5',
    'constant-risers-10minute-percUpHighClosePoints-filtered60-140',
    'sudden-drops-last5trend-fiveTo10-328',
    'sudden-drops-last10trend-388',
    'based-on-jump-down3overnight-ltneg50percmax-fiveTo10-16',
    'ups-then-downs-prevClose-fiveTo10-300'
];

// const tempforPurchase = [
//     '[my actual random selection]',
//     '[dayBeforeYesterdayByAvgPercFirst5]',
//     '[brainFilteredPredictionModel-First3]',
//     '[dayBeforeYesterdaymyPredictionModelFirst3]'
// ];

const fiveDay = [
    // 5 day
    'based-on-jump-down3overnight-ltneg50percmax-fiveTo10-5',
    'sudden-drops-last18trend-fiveTo10-328',
    'dynamo-3000-bottom50tso-notWatchout-100',
    'dynamo-3000-volumeto2weekavg-tenTo15-381',
    'constant-risers-5minute-percUpCloseOnlyPoints-highovernightjumps-250',
    'dow-historical-sortedByAvgToday-13',
];

const highStreaks = [
    // high streaks
    'constant-risers-5minute-percUpHighClose-filtered50-300',
    'based-on-jump-down3overnight-trending35257-5',
    'dynamo-3000-bottom50tso-notWatchout-5lowestYP-40',
    'up-streak-3to5days-gt3overnight-189',
    'constant-downers-10minute-percDownLowClosePoints-filtered40-77'
];

const anotherList = [ // short 3 day
    'ups-then-downs-shiftedHist-tenTo15-10',
    'up-streak-5days-gt1overnight-fiveTo10-45',
    'sudden-drops-last50trend-fiveTo10-388',
    'constant-risers-5minute-percUpHighClose-100',
    'fizbiz-under5TopLosers-12'
];

const myEducated = [
    ...fiveDay,
    ...highStreaks,
    ...anotherList
];

const forPurchase = [
    '[my actual random selection]',
    '[my actual random selection]',

    '[brainFilteredPredictionModel-First3]',
    '[brainFilteredPredictionModel-First1]',
    '[myFilteredPredictionModelFirst5]',

    '[YesterdayByAvgPercFirst5]',
    '[yesterdayMyPredictionModelFirst3]',


    ...myEducated
];

module.exports = {
    forPurchase,
    // purchase: hotStrats,
    email: {
        [['chief', 'sm', 'urph', '@', 'gm', 'ail', '.com'].join('')]: hotStrats,
        [['ViperKi', 'ller847', '@a', 'ol.com'].join('')]: [
            'cheapest-picks-chp50--4'
        ]
    },
    extras: {
        anotherList,
        fiveDay,
        highStreaks,
        'wild n crazy': [
            'week-swings-tenTo15-1',
            'constant-risers-10minute-percUpHighClosePoints-300'
        ],
        'my actual random selection': [
            'based-on-jump-down3overnight-trending35257-5'
        ],
        'my educated random selection': myEducated
    }
}
