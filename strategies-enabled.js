const mySpecialSauce = [
    'based-on-jump-down3overnight-trending35257-5'
];

const forPurchase = [
    '[3IncToday-sortedByPercUp-first1]',
    '[5day-sortedByPercUp-first3]',
    '[5IncTodayCount4-sortedByPercUp-first1]',
    '[12Count5-sortedByAvgTrend-uniq-first1]',
    '[4IncTodayCount3-sortedByPercUp-uniq-first1]',
    '[5dayCount3-sortedByPercUp-uniq-first1]',
    '[7IncTodayCount5-sortedByAvgTrend-first3]',
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
