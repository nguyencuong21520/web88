import mongoose from "mongoose"

const customerSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email : {type: String},
    age: {type: Number}
})
export const  Customer = mongoose.model("Customer",customerSchema )