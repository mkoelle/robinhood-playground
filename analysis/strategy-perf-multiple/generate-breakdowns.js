module.exports = allRoundup => {

    const createBreakdown = ({
        minPercUp = 0.95,
        scoreFn = ({ percUp, avgMax, count }) => percUp * avgMax * count,
        filterFn = () => true
    }) => {
        const filtered = allRoundup
            .filter(({ percUp }) => percUp > minPercUp)
            .filter(filterFn);
        const withScore = filtered.map(obj => ({
            ...obj,
            score: scoreFn(obj)
        }));
        const sorted = withScore.sort((a, b) => b.score - a.score);
        return sorted;
    };

    const topThirdCount = ({ count }) => count > daysBack * 2 / 3;

    return {
        all: createBreakdown({
            minPercUp: 0
        }),
        consistent: createBreakdown({
            minPercUp: 1,
            // top 3 quarters
            filterFn: ({ count }) => count >= daysBack / 4
        }),
        creme: createBreakdown({        // top third count
            filterFn: topThirdCount,
        }),
        moderates: createBreakdown({
            minPercUp: 0.90,
            filterFn: ({ count }) =>    // middle third count
                count <= daysBack * 2 / 3
                && count > daysBack / 3,
            // dont take count into consideration
            scoreFn: ({ percUp, avgMax }) => percUp * avgMax
        }),
        occasionals: createBreakdown({  // bottom third count
            filterFn: ({ count }) => count <= daysBack / 3
        }),
    };

};
