const hotStrats = [
    'week-swings-tenTo15-1',
    'constant-risers-5minute-percUpHighClosePoints-140',
    'dynamo-3000-middle50tso-overall-5lowestYP-200',
    'constant-risers-10minute-percUpHighClosePoints-300',
    'constant-risers-10minute-percUpHighClosePoints-filtered60-100',
    'constant-risers-5minute-percUpHighClosePoints-300',
    'based-on-jump-down3overnight-gtneg20percmax-fiveTo10-5',
    'based-on-jump-up3overnight-ltneg50percmax-tenTo15-5',
    'constant-risers-10minute-percUpHighClosePoints-filtered60-140',
    'sudden-drops-last5trend-fiveTo10-328',
    'sudden-drops-last10trend-388',
    'based-on-jump-down3overnight-ltneg50percmax-fiveTo10-16',
    'ups-then-downs-prevClose-fiveTo10-300',

    // add
    // 'based-on-jump-down3overnight-ltneg50percmax-fiveTo10-5'
];

module.exports = {
    purchase: hotStrats,
    email: {
        [['chief', 'sm', 'urph', '@', 'gm', 'ail', '.com'].join('')]: hotStrats,
        [['ViperKi', 'ller847', '@a', 'ol.com'].join('')]: [
            'cheapest-picks-chp50--4'
        ]
    }
}
