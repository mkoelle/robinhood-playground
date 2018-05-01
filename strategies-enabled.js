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

const longtermhot = [
    'sudden-drops-last2trend-tenTo15-328',
    'dynamo-3000-top50tso-overall-5lowestYP-tenTo15-4',
    'sudden-drops-last1trend-fiveTo10-14',
    'constant-downers-10minute-percDownLowClosePoints-filtered40-77',
    'dynamo-3000-top50tso-overall-5lowestYP-tenTo15-4'
];

const shorttermhot = [
    'sudden-drops-last1trend-first1-fiveTo10-32',
    'sudden-drops-last2trend-first1-fiveTo10-14',
    'sudden-drops-last2trend-first1-221',
    'sudden-drops-last1trend-fiveTo10-32',
    'based-on-jump-down3overnight-shouldWatchout-first1-tenTo15-16',
    'sudden-drops-last50trend-first2-328',
    'constant-risers-5minute-percUpHighClosePoints-fiveTo10-40',
    'dynamo-3000-top50tso-trendingUp3010-5highestTSO-fiveTo10-40',
    'based-on-jump-down3overnight-shouldWatchout-first3-tenTo15-5',

    //
    'based-on-jump-up3overnight-trending607-shouldWatchout-first1-tenTo15-5',
    'based-on-jump-up3overnight-trending35257-shouldWatchout-first1-tenTo15-16',
    'based-on-jump-down3overnight-ltneg50percmax-first1-tenTo15-16',
    'dynamo-3000-top50tso-trendingUp3010-5highestTSO-fiveTo10-40',
    'constant-downers-5minute-percDownCloseOnlyPoints-filtered60-309',
    'sudden-drops-last1trend-fiveTo10-14',
    'constant-risers-10minute-percUpCloseOnly-highovernightjumps-tenTo15-198',
    'based-on-jump-down3overnight-ltneg50percmax-tenTo15-16',
    'based-on-jump-up3overnight-trending103-first1-fiveTo10-5',
    'week-swings-tenTo15-575',
    'sudden-drops-last3trend-fiveTo10-32'

    'based-on-jump-down3overnight-shouldWatchout-tenTo15-5',
    'based-on-jump-down3overnight-trending607-gtneg20percmax-first1-fiveTo10-16',
    'based-on-jump-down3overnight-trending607-gtneg20percmax-first2-fiveTo10-5',
    'sudden-drops-last3trend-first1-328'
];

const forPurchase = [
    '[longtermhot]',    // 5
    '[longtermhot]',    // 5
    '[hothot]',         // 7
    '[shorttermhot]',   // 24

    // 11
    '[5day-sortedByPercUp-uniq-first1]',

    '[5IncTodayCount4-sortedByPercUp-first1]',
    '[5IncTodayCount4-sortedByPercUp-first1]',
    '[5dayCount4-sortedByPercUp-uniq-first1]',
    '[5dayCount3-sortedByPercUp-uniq-first1]',

    '[3IncToday-sortedByPercUp-first1]',  // risky - no count
    // '[5day-sortedByPercUp-first3]', decided against (no count, first3)
    '[12Count5-sortedByAvgTrend-uniq-first1]',
    '[4IncTodayCount3-sortedByPercUp-uniq-first1]',
    '[7IncTodayCount5-sortedByAvgTrend-uniq-first3]',



    // 11
    '[5day-sortedByPercUp-uniq-first1]',

    '[5IncTodayCount4-sortedByPercUp-first1]',
    '[5IncTodayCount4-sortedByPercUp-first1]',
    '[5dayCount4-sortedByPercUp-uniq-first1]',
    '[5dayCount3-sortedByPercUp-uniq-first1]',

    '[3IncToday-sortedByPercUp-first1]',  // risky - no count
    // '[5day-sortedByPercUp-first3]', decided against (no count, first3)
    '[12Count5-sortedByAvgTrend-uniq-first1]',
    '[4IncTodayCount3-sortedByPercUp-uniq-first1]',
    '[7IncTodayCount5-sortedByAvgTrend-uniq-first3]',
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
        longtermhot,
        shorttermhot
    }
}
