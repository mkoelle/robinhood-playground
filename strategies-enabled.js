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
    'dynamo-3000-bottom50tso-onlyWatchout-5lowestsharesToCap-4',
    'dynamo-3000-bottom50tso-notWatchout-100',
    'dynamo-3000-bottom50tso-notWatchout-5lowestTSO-100',
    'constant-downers-10minute-percDownLowClosePoints-filtered40-77',
    'dynamo-3000-top50tso-overall-5lowestYP-tenTo15-4',
    'based-on-jump-down3overnight-notWatchout-fiveTo10-5',
    'sudden-drops-last2trend-tenTo15-63',
    'based-on-jump-down3overnight-gtneg20percmax-fiveTo10-5',
    'constant-risers-10minute-percUpHighClosePoints-filtered60-300',
    'based-on-jump-up3overnight-ltneg50percmax-tenTo15-5'
];

const forPurchase = [
    'sudden-drops-last18trend-filter10-280',
    // 'sudden-drops-last1trend-first1-32',
    'dynamo-3000-absvolume-fiveTo10-200',
    'sudden-drops-last18trend-first1-tenTo15-221',
    'dynamo-3000-overall-onlyWatchout-highestTSO-fiveTo10-100',
    'low-float-high-volume-floatTimesabsVolPoints-trenddowngt10-25',
    'low-float-high-volume-floatTimestwoWeekVolToAvgPoints-trend5to10-tenTo15-150',
    'dynamo-3000-bottom50tso-trendingUp3010-lowestTSO-fiveTo10-4',
    'sudden-drops-last10trend-first1-fiveTo10-221',
    'constant-risers-10minute-percUpHighClosePoints-filtered60-tenTo15-100',
    'dynamo-3000-bottom50tso-trendingUp3010-fiveTo10-4',
    'based-on-jump-oneToFourOvernight-trending53-notWatchout-gtneg20percmax-first1-30',
    'low-float-high-volume-floatTimestwoWeekVolToAvgPoints-25',
    'low-float-high-volume-floatTimesvolTo2WeekPoints-trend3to5-6'
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
        longtermhot
    }
};
