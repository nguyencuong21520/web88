import express from "express";
import { connectDB } from "./src/data/connectDB.js";
import { Customer, Order, Product } from "./src/model/index.js";

const app = express()
const PORT = 3070
app.use(express.json())

connectDB()

app.get("/", (req, res)=>{
    res.send("Hello World")
})

//add new Customer
app.post("/customers", async (req, res)=>{
    try {
        const {name, age, email} = req.body

        if(!name || !age || !email){
            return res.status(400).json({error: "All fields are required"})
        }
        const newCustomerData = {
            name,
            age,
            email 
        }
        const newCustomer = await Customer.create(newCustomerData)
        res.status(201).json(newCustomer)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
})

// create a new order
app.post("/orders", async (req, res)=>{
    try {
        const {customerId, productId, quantity} = req.body

        if(!customerId || !productId || !quantity){
            res.status(400).json({error: "All fields are required"})
        }

        // Convert string IDs to ObjectId
        const product = await Product.findById(productId)
        if (!product) {
            res.status(404).json({ error: "Product not found" })
        }
      
        //check quantity
        if (quantity > product.quantity) {
            res.status(400).json({ error: "Insufficient quantity" })
        }

        // Update product quantity
        product.quantity -= quantity
        await product.save()

        // create a new order
        const newOrder = await Order.create({
            customerId,
            productId,
            quantity
        })

        // Create order logic here
        res.status(201).json({message: "Order created successfully", data: newOrder})

        } catch (error) {
        res.status(400).json({error: error.message}) 
    }
})

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})

