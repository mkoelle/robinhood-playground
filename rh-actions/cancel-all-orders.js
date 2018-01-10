const cancelAllOrders = async (Robinhood) => {
    console.log('canceling all orders...');
    try {
        const orders = await Robinhood.orders();
        const pendingOrders = orders.results.filter(order => {
            return !['cancelled', 'filled', 'confirmed'].includes(order.state);
        });
        console.log('orders', pendingOrders);
        for (let order of pendingOrders) {
            await Robinhood.cancel_order(order);
        }
        pendingOrders.length && console.log('canceled', pendingOrders.length, 'orders');
    } catch (e) {
        console.log('error canceling all orders', e);
    }
};

module.exports = cancelAllOrders;
