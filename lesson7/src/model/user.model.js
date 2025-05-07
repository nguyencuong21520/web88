import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name: {type: String},
    email : {type: String, required: true},
    password: {type: String, required: true},
    role: {type: String, default: "user"},
    salt: {type: String}
})
export const  User = mongoose.model("User",userSchema )