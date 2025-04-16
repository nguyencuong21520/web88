// B1: Import thư viện express
import express from "express";
import { customers, orders, products } from "./data.js";

// B2: Tạo 1 app express
const app = express();

// B3: Tạo 1 port
const PORT = 3068;

// B4: Tạo 1 route
app.get("/", (req, res)=>{
    res.send("Hello World");
})

//Homework
// 1. Get all customers
app.get("/customers", (req, res)=>{
    res.status(200).json(customers);
})

// 2. Get customer by id
app.get("/customers/:id", (req, res)=>{
    const id = req.params.id;
    const data = customers.find((customer )=> customer.id === id);

    if(!data){
        res.status(404).json({message: "Customer not found"});
    }
    res.status(200).json(data);
})

// 3. Get order of a customer
app.get("/customers/:customerId/orders", (req, res)=>{
    const customerId = req.params.customerId

    const data = orders.filter((order)=> order.customerId === customerId)
    if(data.length === 0){
        res.status(404).json({message: "Order not found"});
    }

    res.status(200).json(data);
})

//4. Get high value orders
app.get("/orders/highvalue", (req, res)=>{
    const data = orders.filter((order)=> order.totalPrice > 10000000)

    if(data.length === 0){
        res.status(404).json({message: "Order not found"});
    }

    res.status(200).json(data);
})

//5. get filter products by price range
app.get("/products", (req, res)=>{
    const minPrice = req.query.minPrice;
    const maxPrice = req.query.maxPrice;

    const data = products.filter((product)=> product.price >= minPrice && product.price <= maxPrice)

    if(data.length === 0){  
        res.status(404).json({message: "Product not found"});
    }
    res.status(200).json(data);
})




// B5: Chạy server
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})



