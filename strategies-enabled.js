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
    'based-on-jump-down3overnight-trending607-notWatchout-first1-tenTo15-16',
    'sudden-drops-last18trend-first2-fiveTo10-388',
    'based-on-jump-down3overnight-trending607-notWatchout-gtneg20percmax-fiveTo10-0',
    'low-float-high-volume-floatTimestwoWeekVolToAvgPoints-25',
    'dynamo-3000-bottom50tso-twoweekvolumetoavg-fiveTo10-4',
    'low-float-high-volume-floatTimesvolTo2WeekPoints-trend3to5-tenTo15-25',
    'dynamo-3000-middle50tso-onlyWatchout-lowestYP-fiveTo10-4',
    'dynamo-3000-bottom50tso-twoweekvolumetoavg-fiveTo10-4',
    'low-float-high-volume-floatTimestwoWeekVolToAvgPoints-315',
    'low-float-high-volume-floatTimestwoWeekVolToAvgPoints-trend3to5-210',
    'sudden-drops-last1trend-first1-32',
    'low-float-high-volume-floatTimesvolTo2WeekPoints-trenddown1to3-tenTo15-6',
    'low-float-high-volume-floatTimesvolToAvgPoints-trenddowngt10-25',
    'based-on-jump-oneToFourOvernight-trending35257-shouldWatchout-first2-fiveTo10-30',
    'dynamo-3000-overall-notWatchout-highestYP-fiveTo10-4',
    'based-on-jump-fourToEightOvernight-trending35257-notWatchout-first2-fiveTo10-0',
    'low-float-high-volume-floatTimesvolTo2WeekPoints-trend5to10-95',
    'based-on-jump-fourToEightOvernight-notWatchout-first1-fiveTo10-16',
    'dynamo-3000-overall-notWatchout-highestYP-4',
    'based-on-jump-oneToFourOvernight-trending35257-shouldWatchout-first1-fiveTo10-0',
    ''

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
