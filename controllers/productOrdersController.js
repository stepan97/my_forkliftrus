const { ProductOrder, validateOrder } = require('../models/ProductOrder');

module.exports = {
    async getAll() {
        const products = await ProductOrder.find();
        return products;
    },

    async getOrdersForUser(userId) {
        const myOrders = await ProductOrder.find({ user: userId });
        return myOrders;
    },

    async getById(id) {
        const product = await ProductOrder.findById(id);
        if (!product) return null;

        return product;
    },

    async post(userId, values) {
        values.user = userId;

        const { error } = validateOrder(values);
        if (error) return { data: null, error: error.details[0].message };

        const order = new ProductOrder({
            user: values.user,
            orders: values.orders,
        });

        await order.save();

        return { data: order, error: null };
    },

    async delete(id) {
        const productOrder = await ProductOrder.findByIdAndRemove(id);
        return productOrder;
    }
};