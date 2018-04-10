module.exports = {
    io: null,
    picks: [],
    init(io) {
        this.io = io;
        console.log('initd strat manager');
    },
    newPick(data) {
        this.picks.push(data);
        this.sendToAll('server:new-picks', data);
    },
    getAllPicks() {
        return this.picks;
    },
    sendToAll(eventName, data) {
        this.io.emit(eventName, data);
    }
};
