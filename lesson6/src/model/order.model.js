import mongoose from "mongoose"

const orderSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer'
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    quantity: {
        type: Number
    },
    totalPrice: {
        type: Number
    },
})

export const Order = mongoose.model('Order', orderSchema);