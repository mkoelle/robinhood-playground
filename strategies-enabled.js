const mySpecialSauce = [
    'based-on-jump-down3overnight-trending35257-5'
];

const forPurchase = [
    '[Yesterday-sortedByAvgTrend-first1]',
    '[Yesterday-sortedByAvgTrend-first1]',
    '[4IncTodayCount2-sortedByPercUp-uniq-first3]',
    '[4IncTodayCount3-sortedByPercUp-uniq-first3]',
    '[4IncTodayCount2-sortedByPercUp-first1]',
    '[4IncTodayCount2-sortedByAvgTrend-uniq-first3]',
    '[4IncToday-sortedByPercUp-first3]',
    '[12Count5-sortedByAvgTrend-uniq-first3]',
    '[curOverallPredictions-myPredictions-uniq-first3]',
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
        mySpecialSauce
    }
}
