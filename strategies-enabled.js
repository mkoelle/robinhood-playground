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

const forPurchase = [
    '[my actual random selection]',
    '[my actual random selection]',
    '[YesterdayByAvgPercFirst5]',
    '[brainFilteredPredictionModel-First3]',
    '[brainFilteredPredictionModel-First1]',
    '[myFilteredPredictionModelFirst5]',
    '[yesterdayMyPredictionModelFirst3]'
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
        'wild n crazy': [
            'week-swings-tenTo15-1',
            'constant-risers-10minute-percUpHighClosePoints-300'
        ],
        'my actual random selection': [
            'based-on-jump-down3overnight-trending35257-5'
        ],
        'my educated random selection': [
            'before-close-up-350',
            'dow-historical-sortedByAvgToday-13',
            'constant-risers-10minute-percUpCloseOnlyPoints-filtered60-100',
            'dynamo-3000-top50tso-onlyWatchout-5lowestsharesToCap-381',
        ]
    }
}
