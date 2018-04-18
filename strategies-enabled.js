const short3Day = [ // short 3 day
    'sudden-drops-last10trend-221',
    'constant-downers-5minute-percDownCloseOnly-lowovernightjumps-fiveTo10-309',
    'dynamo-3000-bottom50tso-overall-381',
    'sudden-drops-last5trend-32',
    'fizbiz-under5TopLosers-2',
    'constant-risers-5minute-percUpHighClose-filtered60-80',
    'based-on-jump-down3overnight-trending35257-notWatchout-5',
    'constant-downers-10minute-percDownCloseOnlyPoints-filtered40-242',
    'dynamo-3000-top50tso-trendingUp3010-5highestYP-fiveTo10-100'
];

const goodTodayBad5day = [
    'constant-risers-10minute-percUpHighClose-filtered60-100',
    'constant-risers-10minute-percUpHighClosePoints-filtered60-198',
    'sudden-drops-last5trend-328',
    'cheapest-picks-chp1-175',
    'constant-risers-10minute-percUpCloseOnly-filtered50-250',
    'sudden-drops-last50trend-328',
    'up-streak-3to5days-ltneg3overnight-fiveTo10-45',
    'sudden-drops-last2trend-fiveTo10-63',
];

const forPurchase = [
    '[my actual random selection]',
    '[my actual random selection]',
    '[my actual random selection]',
    '[my actual random selection]',

    '[5dayCount2-sortedByPercUp-uniq-first5]',
    '[curOverallPredictions-brainPredictions-first1]',
    '[curOverallPredictions-brainPredictions-first1]',
    '[curOverallPredictions-brainPredictions-uniq-first3]',
    '[curOverallFilteredPredictions-myPredictions-uniq-first10]',
    '[curOverallPredictions-myPredictions-first3]',

    '[short3Day]',
    '[goodTodayBad5day]'
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
        short3Day,
        goodTodayBad5day,
    }
}
