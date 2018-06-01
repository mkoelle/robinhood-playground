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

const honorableMentions105 = [
    'based-on-jump-down3overnight-trending607-notWatchout-gtneg20percmax-first1-tenTo15-16',
    'based-on-jump-down3overnight-trending607-notWatchout-first1-tenTo15-16',
    'based-on-jump-fourToEightOvernight-trending103-first3-tenTo15-16',
];

const honorableMentions3 = [ // 3 2
    "sudden-drops-last10trend-filter20-63",
    "sudden-drops-last3trend-filter10-63",
    "sudden-drops-last1trend-first1-fiveTo10-280",
    "low-float-high-volume-floatTimesvolToAvgPoints-trenddowngt10-25",
    "based-on-jump-down3overnight-shouldWatchout-first1-fiveTo10-5"
];

const myPicks = [
    'low-float-high-volume-floatTimesvolToAvgPoints-trenddowngt10-25',
    'low-float-high-volume-floatTimesabsVolPoints-trenddown3to10-6',
    'dynamo-3000-bottom50tso-trendingUp3010-lowestTSO-fiveTo10-4',
    'low-float-high-volume-floatTimesvolTo2WeekPoints-trend3to5-6',
    'based-on-jump-down3overnight-trending607-notWatchout-gtneg20percmax-first1-tenTo15-16',
    'dynamo-3000-bottom50tso-notWatchout-lowestsharesToCap-40'  // hesitant
];

const forPurchase = [
    'based-on-jump-down3overnight-trending607-notWatchout-gtneg20percmax-16',
    'based-on-jump-down3overnight-trending35257-notWatchout-first1-0',
    'based-on-jump-down3overnight-trending607-notWatchout-gtneg20percmax-16',
    'based-on-jump-down3overnight-trending35257-notWatchout-first1-0',

    'low-float-high-volume-floatTimesabsVolPoints-trenddown5to7-notWatchout-fiveTo10-6',

    'constant-risers-5minute-percUpCloseOnlyPoints-filtered60-80',
    'constant-risers-5minute-percUpHighClosePoints-filtered50-140',

    'dynamo-3000-top50tso-onlyWatchout-highestTSO-200',
    'dynamo-3000-top50tso-onlyWatchout-highestTSO-200'

    // how about?
    // based-on-jump-fourToEightOvernight-notWatchout-first1-fiveTo10-30

    // short sell / buy put option / sell call option:
    // based-on-jump-gtEightOvernight-trending53-first1-5
    // based-on-jump-gtEightOvernight-shouldWatchout-5
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
        [['chief', 'sm', 'urph', '@', 'gm', 'ail', '.com'].join('')]: [
            ...forPurchase,
            // for shorting
            'based-on-jump-gtEightOvernight-trending53-first1-5',
            'based-on-jump-gtEightOvernight-shouldWatchout-5',
        ],
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
        honorableMentions105,
        honorableMentions3,
        myPicks,
    }
};
