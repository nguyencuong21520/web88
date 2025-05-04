// B1: Import thư viện express
import express from "express";
import { genId } from "./helper/genId.js";
import axios from "axios";
// B2: Tạo 1 app express
const app = express();


app.use(express.json());

// B3: Tạo 1 port
const PORT = 3068;

// B4: Tạo 1 route
app.get("/", (req, res)=>{
    res.send("Hello World");
})



//6. POST create a new customer
app.post("/customers", async (req, res)=>{
    const {name, email, age} = req.body;
    
    if(!name || !email || !age){        
        return res.status(400).json({
            message: "Missing required fields"
        })
    }

    const customerList = await axios.get("http://localhost:3069/customers");
    const existingCustomerEmail = customerList.data.find(customer => customer.email == email);

    if(existingCustomerEmail){
        return res.status(400).json({
            message: "Email already exists"
        })
    }
    
    const newCustomer = {
        id: genId(),
        name,
        email,
        age
    }

    const {data} = await axios.post("http://localhost:3069/customers", newCustomer);

    res.json({
        message: "Customer created successfully",
        data: data
    })
})

// B5: Chạy server
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})
