const getUpStreak = async (Robinhood, ticker) => {
    try {

        console.log('trending up n days? ...', ticker);
        const historicalDailyUrl = `https://api.robinhood.com/quotes/historicals/${ticker}/?interval=day`;
        let { historicals } = await Robinhood.url(historicalDailyUrl);

        // console.log(historicals, historicals.length);
        if (!historicals.length) {
            return null;
        }

        let lastDay;
        // console.log('of', ofInterest);
        let streakCount = 0;
        historicals.reverse().some(day => {  // searching for first occurance of a non gain in 24hr
            const curLastDay = lastDay;
            lastDay = day;
            // console.log('d', day);
            // console.log('las', curLastDay);
            if (!curLastDay) return false;
            const wentUp = Number(curLastDay.close_price) > Number(day.close_price);
            if (wentUp) streakCount++;
            return !wentUp;
        });
        // console.log('st', streakCount, ticker);
        return streakCount;

    } catch (e) {
        return null;
    }

};

module.exports = getUpStreak;
