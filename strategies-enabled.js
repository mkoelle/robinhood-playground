const mySpecialSauce = [
    'based-on-jump-down3overnight-trending35257-5'
];

const hothot = [
    'based-on-jump-up3overnight-trending35257-fiveTo10-5',
    'sudden-drops-last1trend-fiveTo10-32',    //
    'sudden-drops-last1trend-221',
    'sudden-drops-last1trend-first2-fiveTo10-14',
    'based-on-jump-up3overnight-trending35257-shouldWatchout-tenTo15-16',
    'based-on-jump-up3overnight-shouldWatchout-first3-fiveTo10-30',
    'based-on-jump-up3overnight-trending607-shouldWatchout-first2-tenTo15-5'
];

const longtermhotpercup = [
    'sudden-drops-last2trend-tenTo15-328',
    'dynamo-3000-top50tso-overall-5lowestYP-tenTo15-4',
    'sudden-drops-last1trend-fiveTo10-14',
    'dynamo-3000-bottom50tso-notWatchout-5lowestTSO-100',
    'constant-downers-10minute-percDownLowClosePoints-filtered40-77',
    'constant-downers-10minute-percDownLowClosePoints-filtered40-77',
    'dynamo-3000-top50tso-onlyWatchout-5lowestYP-tenTo15-4',
    'dynamo-3000-top50tso-overall-5lowestYP-tenTo15-4',
];

const longtermhotavgtrend = [
    'constant-downers-10minute-percDownLowClosePoints-filtered40-77',
    'constant-downers-10minute-percDownCloseOnlyPoints-filtered40-242',
    'constant-risers-10minute-percUpCloseOnlyPoints-highovernightjumps-40',
    'based-on-jump-up3overnight-trending35257-fiveTo10-30',
    'constant-downers-5minute-percDownCloseOnlyPoints-filtered50-309',
    'constant-downers-10minute-percDownCloseOnlyPoints-filtered40-77',
    'constant-downers-5minute-percDownLowClosePoints-filtered40-309',
    'constant-risers-5minute-percUpHighClosePoints-300'
];


const shorttermhot = [
    'based-on-jump-up3overnight-shouldWatchout-first1-tenTo15-30',
    'based-on-jump-up3overnight-trending607-first1-tenTo15-30',
    'dynamo-3000-top50tso-overall-5highestTSO-351',
    'sudden-drops-last1trend-first1-388',
    'sudden-drops-last2trend-328',
    'week-swings-tenTo15-583',
    'dynamo-3000-top50tso-onlyWatchout-5highestTSO-351',
    'based-on-jump-down3overnight-trending607-gtneg20percmax-first2-30'
];

const forPurchase = [
    // auto                     25
                                // 5
    "[5day-sortedByAvgTrend-first1]",
    "[3IncToday-sortedByAvgTrend-first1]",
    "[12Count5-sortedByAvgTrend-first1]",
    "[10IncTodayCount6-sortedByAvgTrend-first1]",
    "[10IncTodayCount4-sortedByAvgTrend-first1]",

        // duplicate            // 5
        "[5day-sortedByAvgTrend-first1]",
        "[3IncToday-sortedByAvgTrend-first1]",
        "[12Count5-sortedByAvgTrend-first1]",
        "[10IncTodayCount6-sortedByAvgTrend-first1]",
        "[10IncTodayCount4-sortedByAvgTrend-first1]",

        // duplicate            // 5
        "[5day-sortedByAvgTrend-first1]",
        "[3IncToday-sortedByAvgTrend-first1]",
        "[12Count5-sortedByAvgTrend-first1]",
        "[10IncTodayCount6-sortedByAvgTrend-first1]",
        "[10IncTodayCount4-sortedByAvgTrend-first1]",

        // duplicate            // 5
        "[5day-sortedByAvgTrend-first1]",
        "[3IncToday-sortedByAvgTrend-first1]",
        "[12Count5-sortedByAvgTrend-first1]",
        "[10IncTodayCount6-sortedByAvgTrend-first1]",
        "[10IncTodayCount4-sortedByAvgTrend-first1]",

        // duplicate            // 5
        "[5day-sortedByAvgTrend-first1]",
        "[3IncToday-sortedByAvgTrend-first1]",
        "[12Count5-sortedByAvgTrend-first1]",
        "[10IncTodayCount6-sortedByAvgTrend-first1]",
        "[10IncTodayCount4-sortedByAvgTrend-first1]",


    // manual                   24
    '[shorttermhot]',           // 8
    '[longtermhotavgtrend]',    // 8
    '[longtermhotpercup]'       // 8

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
        hothot,
        longtermhotpercup,
        longtermhotavgtrend,
        shorttermhot
    }
};
