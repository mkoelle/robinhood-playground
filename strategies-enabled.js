const mySpecialSauce = [
    'based-on-jump-down3overnight-trending35257-5'
];

const myOtherGuesses = [
    'dynamo-3000-twoweekvolumetoavg-200',
    'dynamo-3000-absvolume-200'
];

const forPurchase = [
    '[Yesterday-sortedByAvgTrend-first1]',
    '[Yesterday-sortedByAvgTrend-first1]',
    '[5dayCount3-sortedByPercUp-first1]',
    '[5dayCount4-sortedByAvgTrend-uniq-first5]',
    '[4IncTodayCount2-sortedByPercUp-first1]',
    '[4IncTodayCount2-sortedByAvgTrend-uniq-first3]',
    '[4IncToday-sortedByPercUp-first3]',
    '[5dayCount4-sortedByAvgTrend-uniq-first5]',
    '[7IncTodayCount5-sortedByPercUp-uniq-first3]',
    '[12Count5-sortedByAvgTrend-uniq-first3]',

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
