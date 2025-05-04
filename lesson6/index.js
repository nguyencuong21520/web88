import express from "express";
import { connectDB } from "./src/config/dataBase.js";
import { Customer } from "./src/model/customer.model.js";
import { authorization } from "./src/middlewares/authorization.js";
import { randomString } from "./src/config/common.config.js";

const app = express();
const PORT = 3045;


app.use(express.json());

//connect to DB
connectDB()

app.get("/", (req, res) => {
  res.status(200).json({
    message: "server is running",
  });
});

//create a token
app.get("/customters/getApikey/:id" , async (req, res) =>{

  //get user id
  const {id} = req.params

  //get user from db by id
  const user = await Customer.findById(id)
  if(!user){
    return res.status(404).json({
      message: "user not found"
    })
  }
  const email = user.email

  const token =  `web-$${id}$-$${email}$-$${randomString}$`

  res.status(200).json({
    message: "token created",
    token
  })
})

//get all customers
app.get("/customers", authorization,  async (req, res) => {

  const customers = await Customer.find();

  if (!customers) {
    return res.status(404).json({
      message: "customers not found",
    });
  }

  res.status(200).json({
    message: "get all customers",
    customers,
  });
});


app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});