const mySpecialSauce = [
    'based-on-jump-down3overnight-trending35257-5'
];

const myPicks = [
    'constant-risers-10minute-percUpHighClose-300',
    'dynamo-3000-top50tso-trendingUp3010-5highestTSO-fiveTo10-40',
    'sudden-drops-last2trend-tenTo15-63',
    'dynamo-3000-bottom50tso-notWatchout-fiveTo10-4',
    'dynamo-3000-top50tso-overall-5lowestYP-fiveTo10-260',
    'sudden-drops-last10trend-63',
    'constant-downers-10minute-percDownCloseOnlyPoints-filtered40-309',
    'constant-risers-10minute-percUpCloseOnly-fiveTo10-198',
    'dynamo-3000-top50tso-twoweekvolumetoavg-fiveTo10-40',
    'based-on-jump-up3overnight-shouldWatchout-first2-fiveTo10-5',
    'based-on-jump-up3overnight-trending35257-first2-fiveTo10-5',
    'based-on-jump-down3overnight-trending607-tenTo15-30',
    // 'week-swings-tenTo15-1'
];

const forPurchase = [
    // 18
    '[Yesterday-sortedByAvgTrend-first1]',
    '[Yesterday-sortedByAvgTrend-first1]',
    '[4IncTodayCount2-sortedByPercUp-uniq-first3]',
    '[4IncTodayCount3-sortedByPercUp-uniq-first3]',
    '[4IncTodayCount2-sortedByPercUp-first1]',
    '[4IncTodayCount2-sortedByAvgTrend-uniq-first3]',
    '[4IncToday-sortedByPercUp-first3]',
    '[12Count5-sortedByAvgTrend-uniq-first3]',
    '[curOverallPredictions-myPredictions-uniq-first3]',

    // 12
    '[myPicks]'
];

const cheapestPicksEmailObj = [
    ['And', 're', 'wzouza@', 'gm', 'ail.com'],
    ['ViperKi', 'ller847', '@a', 'ol.com']
]
    .map(val => val.join(''))
    .reduce((acc, val) => ({
        ...acc,
        [val]: 'cheapest-picks-chp50--4'
    }), {});

module.exports = {
    forPurchase,
    // purchase: hotStrats,
    email: {
        [['chief', 'sm', 'urph', '@', 'gm', 'ail', '.com'].join('')]: forPurchase,
        ...cheapestPicksEmailObj
    },
    extras: {
        'wild n crazy': [
            'week-swings-tenTo15-1',  // wild
            'constant-risers-10minute-percUpHighClosePoints-300'  // crazy
        ],
        mySpecialSauce,
        myPicks
    }
}
