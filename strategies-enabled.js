const mySpecialSauce = [
    'based-on-jump-down3overnight-trending35257-5'
];

const myOtherGuesses = [
    'sudden-drops-last5trend-32',
    'constant-downers-10minute-percDownLowClosePoints-filtered40-77',
    'sudden-drops-last10trend-63',
    'constant-downers-10minute-percDownCloseOnlyPoints-filtered40-242',
    'sudden-drops-last5trend-221',
    'dynamo-3000-volumetoavg-200',
];

const forPurchase = [
    '[5day-sortedByAvgTrend-uniq-first10]',
    '[5day-sortedByPercUp-first3]',
    '[5dayCount2-sortedByPercUp-uniq-first3]',
    '[4IncTodayCount2-sortedByPercUp-uniq-first5]',
    '[10IncTodayCount6-sortedByAvgTrend-first10]',
    '[12Count5-sortedByAvgTrend-uniq-first5]',
    '[Yesterday-sortedByPercUp-uniq-first3]',
    '[dayBeforeYesterdayPredictions-myPredictions-uniq-first3]',
    '[dayBeforeYesterdayPredictions-myPredictions-first3]',
    '[curOverallPredictions-brainPredictions-first5]',

    '[mySpecialSauce]',
    '[mySpecialSauce]',
    '[mySpecialSauce]',
    '[myOtherGuesses]'
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
        myOtherGuesses
    }
}
