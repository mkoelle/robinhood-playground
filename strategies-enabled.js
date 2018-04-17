// const tempforPurchase = [
//     '[my actual random selection]',
//     '[dayBeforeYesterdayByAvgPercFirst5]',
//     '[brainFilteredPredictionModel-First3]',
//     '[dayBeforeYesterdaymyPredictionModelFirst3]'
// ];

const fiveDay = [
    // 5 day
    'based-on-jump-down3overnight-trending35257-gtneg20percmax-fiveTo10-5',
    'sudden-drops-last10trend-fiveTo10-328',
    'based-on-jump-up3overnight-trending35257-fiveTo10-16',
    'constant-risers-5minute-percUpHighClose-filtered50-80',
    'constant-risers-5minute-percUpHighClosePoints-filtered40-fiveTo10-40',
    'sudden-drops-last18trend-fiveTo10-328',
    'sudden-drops-last5trend-32',
    'constant-risers-10minute-percUpHighClose-filtered60-250',
    'up-streak-5days-gt1overnight-189',
    'dynamo-3000-top50tso-topPE-fiveTo10-4',
    'before-close-up-350',
    'constant-risers-5minute-percUpCloseOnly-198',
    'based-on-jump-down3overnight-trending35257-fiveTo10-30',
    'constant-risers-5minute-percUpHighClose-filtered40-80',
    'constant-risers-5minute-percUpHighClosePoints-filtered40-fiveTo10-40',
    'dynamo-3000-top50tso-trendingUp3010-5lowestYP-fiveTo10-4'
];
//
// const highStreaks = [
//     // high streaks
//     'constant-risers-5minute-percUpHighClose-filtered50-300',
//     'based-on-jump-down3overnight-trending35257-5',
//     'dynamo-3000-bottom50tso-notWatchout-5lowestYP-40',
//     'up-streak-3to5days-gt3overnight-189',
//     'constant-downers-10minute-percDownLowClosePoints-filtered40-77'
// ];

const anotherList = [ // short 3 day
    'constant-risers-5minute-percUpHighClose-filtered40-80',
    'based-on-jump-down3overnight-trending35257-tenTo15-5',
    'based-on-jump-down3overnight-gtneg20percmax-tenTo15-5',
    'based-on-jump-down3overnight-trending35257-notWatchout-fiveTo10-5',
    'based-on-jump-down3overnight-shouldWatchout-tenTo15-30',
    'sudden-drops-last18trend-221',
    'sudden-drops-last5trend-32',
    'sudden-drops-last3trend-tenTo15-63',
    'dynamo-3000-volumeto2weekavg-4',
    'fizbiz-under5TopLosers-2',
    'based-on-jump-down3overnight-shouldWatchout-tenTo15-30'
];

const goodTodayBad5day = [
    'constant-risers-5minute-percUpHighClose-filtered60-198',
    'dynamo-3000-bottom50tso-onlyWatchout-4',
    'constant-risers-5minute-percUpCloseOnly-filtered40-140',
    'dynamo-3000-absvolume-fiveTo10-4',
    'up-streak-5days-ltneg1overnight-45',
    'constant-risers-10minute-percUpCloseOnlyPoints-highovernightjumps-198',
    'based-on-jump-down3overnight-trending35257-gtneg20percmax-16',
    'dynamo-3000-top50tso-absvolume-fiveTo10-4',
    'ups-then-downs-prevClose-200',
    'dynamo-3000-bottom50tso-trendingUp3010-5lowestYP-200',
    'sudden-drops-last30trend-328',
    'constant-downers-10minute-percDownLowClosePoints-filtered50-242'
];

const goodTodayGood5day = [
    'constant-risers-5minute-percUpCloseOnly-198',
    'constant-risers-5minute-percUpHighClose-filtered50-80',
    'constant-risers-5minute-percUpCloseOnly-filtered50-300',
    'based-on-jump-down3overnight-trending35257-fiveTo10-30',
    'constant-risers-10minute-percUpCloseOnlyPoints-filtered50-fiveTo10-40',
    'sudden-drops-last18trend-388',
    'constant-risers-5minute-percUpHighClosePoints-fiveTo10-40',
    'sudden-drops-last2trend-tenTo15-14',
    'constant-risers-5minute-percUpCloseOnlyPoints-filtered50-300'
];

const myEducated = [
    ...fiveDay,
    // ...highStreaks,
    ...anotherList
];

const forPurchase = [
    '[my actual random selection]',
    '[my actual random selection]',

    '[brainFilteredPredictionModel-First3]',
    '[brainFilteredPredictionModel-First1]',
    '[brainFilteredPredictionModel-First1]',

    '[myFilteredPredictionModelFirst3]',
    '[myFilteredPredictionModelFirst10]',
    '[myFilteredPredictionModelFirst1]',
    '[stratPerf4IncTodayPercUpFirst5]',
    '[5DayByPercUpFirst5]',
    ...myEducated
];

module.exports = {
    forPurchase,
    // purchase: hotStrats,
    email: {
        [['chief', 'sm', 'urph', '@', 'gm', 'ail', '.com'].join('')]: forPurchase,
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
        fiveDay,
        // highStreaks,
        anotherList,
        'my educated random selection': myEducated,
        goodTodayBad5day,
        goodTodayGood5day
    }
}
