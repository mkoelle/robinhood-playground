module.exports = allRoundup => {

    const createBreakdown = ({
        minPercUp = 0,
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
        return minPercUp === 0 ? sorted : sorted.slice(0, 15);
    };

    const maxCount = Math.max(...allRoundup.map(o => o.count));
    console.log(maxCount, 'maxCount');

    return {
        all: createBreakdown({
            minPercUp: 0
        }),
        consistent: createBreakdown({
            // top 3 quarters
            filterFn: ({ count }) => count >= maxCount / 4,
            scoreFn: ({ count, percUp }) => (100 + count) * percUp
        }),
        creme: createBreakdown({        // top third count
            filterFn: ({ count }) => count > maxCount * 2 / 3,
        }),
        moderates: createBreakdown({
            minPercUp: 0.90,
            filterFn: ({ count }) =>    // middle third count
                count <= maxCount * 2 / 3
                && count > maxCount / 3,
            // dont take count into consideration
            scoreFn: ({ percUp, avgMax }) => percUp * avgMax
        }),
        occasionals: createBreakdown({  // bottom third count
            filterFn: ({ count }) => count <= maxCount / 3
        }),
    };

};
