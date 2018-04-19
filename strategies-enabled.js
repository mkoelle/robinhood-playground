const mySpecialSauce = [
    'based-on-jump-down3overnight-trending35257-5'
];

const moreGoodStuff = [
    'constant-risers-10minute-percUpCloseOnlyPoints-filtered60-250',
    'sudden-drops-last1trend-328',
    'dynamo-3000-bottom50tso-notWatchout-5highestsharesToCap-200',
    'dynamo-3000-middle50tso-volumetoavg-40',
    'dynamo-3000-top50tso-overall-5lowestYP-40',
    'constant-downers-10minute-percDownCloseOnlyPoints-filtered40-77',
    'sudden-drops-last2trend-tenTo15-14',
    'dynamo-3000-bottom50tso-notWatchout-5lowestsharesToCap-tenTo15-200'
];

const forPurchase = [
    '[mySpecialSauce]',
    '[mySpecialSauce]',
    '[mySpecialSauce]',
    '[mySpecialSauce]',
    '[wild n crazy]',

    'null',

    '[5day-sortedByPercUp-first3]',
    '[4IncToday-sortedByPercUp-first5]',
    '[dayBeforeYesterdayPredictions-myPredictions-uniq-first3]',

    'null',

    '[moreGoodStuff]'
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
        moreGoodStuff,
        mySpecialSauce,
    }
}
