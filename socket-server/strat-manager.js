const { lookupTickers } = require('../app-actions/record-strat-perfs');
const stratManager = {
    Robinhood: null,
    io: null,
    picks: [],
    relatedPrices: {},

    init(io) {
        this.Robinhood = global.Robinhood;
        this.io = io;
        console.log('initd strat manager');
        setInterval(() => this.getRelatedPrices(), 40000);
    },
    newPick(data) {
        // console.log('new pick', data);
        this.picks.push(data);
        this.sendToAll('server:picks-data', data);
    },
    getAllPicks() {
        return this.picks;
    },
    sendToAll(eventName, data) {
        // console.log('sending to all', eventName, data);
        this.io.emit(eventName, data);
    },
    async getRelatedPrices() {
        console.log('getting related prices');
        // console.log(this.picks);
        const flatten = list => list.reduce(
          (a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []
        );
        const tickersToLookup = flatten(this.picks.map(pick => {
            return pick.withPrices.map(tickerObj => tickerObj.ticker);
        }));
        // console.log(tickersToLookup);
        const relatedPrices = await lookupTickers(
            this.Robinhood,
            ...new Set(tickersToLookup)   // uniquify duplicate tickers
        );
        this.relatedPrices = relatedPrices;
        this.sendToAll('server:related-prices', relatedPrices);
        console.log('done getting related prices');
    }
};

module.exports = stratManager;
