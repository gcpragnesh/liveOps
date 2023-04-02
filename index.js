const express = require("express");
const app=express();
const mongoose = require("mongoose");
const bodyparse = require("body-parser")
const userRoute = require("./routes/user")
const offerRoute=require("./routes/offer")
mongoose.connect("mongodb://localhost:27017/offers").then(()=>{
    console.log("connected to db")
}).catch((err)=>{
    console.log("connection failed"+err.message)
})
const server=process.env.Port||8082;
app.use(bodyparse.json());
app.listen(server,()=>{
    console.log("server is listening at port"+ server)
})
app.use("/user",userRoute);
app.use("/offer",offerRoute)