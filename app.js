// console.log("hello")
//  var user =require("./user")
//  console.log(user)
//  console.log(user.userName)
//  console.log(user.userAge)
//  user.printUserData(100)




const express = require("express")
const mongoose = require("mongoose")

const cors = require("cors")
require('dotenv').config();

// const app =express()
// app.use(cors())
// app.use(express.json())

const app = express()
app.use(cors({
    origin: "https://legal-consultation-market-place.vercel.app",
    credentials: true
  }));
app.use(express.json())

// router.post("/user", (req, res) => {
//     console.log("Received data:", req.body); // Log the incoming data

//     // Mock response
//     res.status(201).json({ message: "User data received", data: req.body });
// });

const roleRoutes = require("./src/routes/RoleRoutes")
app.use(roleRoutes)

const userRoutes = require("./src/routes/UsersRoutes")
app.use(userRoutes)

const lawyerRoutes = require("./src/routes/LawyerRoutes")
app.use(lawyerRoutes)

const appointmentRoutes = require("./src/routes/AppointmentRoutes")
app.use(appointmentRoutes)

const queryRoutes = require("./src/routes/QueryRoutes")
app.use(queryRoutes)

const contactUsRoutes = require("./src/routes/ContactUsRoutes")
app.use(contactUsRoutes)

const reviewRoutes = require("./src/routes/ReviewRoutes")
app.use(reviewRoutes)

const paymentRoutes = require("./src/routes/PaymentRoutes")
app.use(paymentRoutes) 

const adminRoutes = require("./src/routes/AdminRoutes");
const router = require("./src/routes/PaymentRoutes");
app.use(adminRoutes) 

// mongoose.connect("mongodb://127.0.0.1:27017/25_node_internship").then(()=>{
//     console.log("database connected...")
// })


const mongoURI = process.env.MONGO_URI;
console.log("Connecting to MongoDB URI:", mongoURI);

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log("Database connected...");
})
.catch((err) => {
    console.error("MongoDB connection error:", err);
});

app.get('/', (req, res) => {
    res.send('Legal Consultation Marketplace backend is running ✅');
  });


app.get('/ping', (req, res) => {
    res.send('pong');
  });

app.get("/test",(req,res)=>{
    res.send("hello test api called")
})



app.get("/user",(req,res)=>{
    res.json({
        message:"user api called..",
        data:["dhruv","vatsal","raj"]
    })
})

app.get("/employee",(req,res)=>{
    res.json({
        message:"employee api called..",
        data:[{name:"Dhruv",age:22,mobile_no:9924939512,salary:100},{name:"Vatsal",age:21,mobile_no:9924939556,salary:1000000},{name:"Raj",age:20,mobile_no:9737026559,salary:10000}]
    })
})



















const PORT =3010
app.listen(PORT,()=>{
    console.log("Server started on port number  ",PORT)
})

