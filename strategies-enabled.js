const mySpecialSauce = [
    'based-on-jump-down3overnight-trending35257-5'
];

const decidedAgainst = [
    // for slightly imperfect records
    '[5dayCount2-sortedByPercUp-first1]',
    '[4IncTodayCount2-sortedByPercUp-first1]',
    '[Yesterday-sortedByAvgTrend-first1]'
];

const forPurchase = [
    '[5dayCount4-sortedByPercUp-first1]',

    '[Yesterday-sortedByPercUp-first3]',
    '[3IncToday-sortedByAvgTrend-uniq-first3]',

    '[5day-sortedByPercUp-first1]',
    '[4IncToday-sortedByPercUp-uniq-first3]',
    '[7IncTodayCount5-sortedByAvgTrend-uniq-first3]',
    '[7IncTodayCount5-sortedByAvgTrend-first3]',
    '[5dayCount3-sortedByAvgTrend-first1]',
    '[3IncToday-sortedByPercUp-first1]',

    '[5dayCount3-sortedByPercUp-first1]',
    '[5IncTodayCount4-sortedByPercUp-first1]',
    '[5IncTodayCount3-sortedByPercUp-first1]',
    '[5IncTodayCount5-sortedByAvgTrend-uniq-first3]'
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
        decidedAgainst
    }
}
