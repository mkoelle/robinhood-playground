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
    'based-on-jump-fourToEightOvernight-notWatchout-first2-fiveTo10-0',
    'constant-risers-5minute-percUpCloseOnly-filtered50-140',
    'based-on-jump-fourToEightOvernight-notWatchout-fiveTo10-0',
    'low-float-high-volume-floatTimestwoWeekVolToAvgPoints-trend5to10-tenTo15-150',
    'dynamo-3000-bottom50tso-notWatchout-highestYP-fiveTo10-4',
    'low-float-high-volume-floatTimestwoWeekVolToAvgPoints-trend5to10-fiveTo10-150',
    'dynamo-3000-bottom50tso-overall-highestYP-fiveTo10-4',
    'dynamo-3000-bottom50tso-trendingUp3010-lowestTSO-fiveTo10-4',
];

const realOldSchool = [
    'dynamo-3000-top50tso-trendingUp3010-lowestYP-fiveTo10-200',
    'sudden-drops-last3trend-first2-fiveTo10-328',
    'constant-risers-5minute-percUpHighClose-highovernightjumps-fiveTo10-198',
    'sudden-drops-last5trend-first2-fiveTo10-328',
    'dynamo-3000-top50tso-absvolume-100',
    'sudden-drops-last3trend-first1-328',
    'constant-risers-10minute-percUpCloseOnly-filtered60-100',
]

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
    'low-float-high-volume-floatTimesabsVolPoints-trenddown3to10-6',
    'dynamo-3000-bottom50tso-trendingUp3010-lowestTSO-fiveTo10-4',
    'low-float-high-volume-floatTimesvolTo2WeekPoints-trend3to5-6',
    'based-on-jump-down3overnight-trending607-notWatchout-gtneg20percmax-first1-tenTo15-16',
    'dynamo-3000-bottom50tso-notWatchout-lowestsharesToCap-40'  // hesitant
];

const forPurchase = [
    // short sell / buy put option / sell call option:
    // based-on-jump-gtEightOvernight-trending53-first1-5
    // based-on-jump-gtEightOvernight-gt100kvolume-first1-5 ??
    // low-float-high-volume-floatTimesfloatToVolume-trendgt30-6
    // low-float-high-volume-floatTimesfloatToVolume-trendgt20-6
    // low-float-high-volume-floatTimestwoWeekVolToAvgPoints-trendgt50-210
    // based-on-jump-gtEightOvernight-shouldWatchout-5

    'low-float-high-volume-floatTimesfloatToVolume-trenddowngt10-notWatchout-25',
    'low-float-high-volume-volTo2WeekPoints-trend10to15-shouldWatchout-315',
    'low-float-high-volume-floatTimesvolToAvgPoints-trendgt20-notWatchout-fiveTo10-95',
    'low-float-high-volume-absVolPoints-trend5to10-shouldWatchout-150',
    'low-float-high-volume-twoWeekVolToAvgPoints-notWatchout-fiveTo10-95',
    'low-float-high-volume-floatTimesvolToAvgPoints-trend15to25-notWatchout-150',
    'based-on-jump-down5overnight-trending35257-shouldWatchout-fiveTo10-0',
    'based-on-jump-fourToEightOvernight-notWatchout-ltneg50percmax-fiveTo10-5'
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
            // for shorting
            'based-on-jump-gtEightOvernight-trending53-first1-5',
            'based-on-jump-gtEightOvernight-shouldWatchout-5',
            'low-float-high-volume-floatTimestwoWeekVolToAvgPoints-trendgt50-210',
            'low-float-high-volume-floatTimesfloatToVolume-trendgt30-6',
            'low-float-high-volume-floatTimesfloatToVolume-trendgt20-6',
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
        realOldSchool,
    }
};
