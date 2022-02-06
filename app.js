const express = require('express')
const app = express()
const mongoose = require('mongoose') 
const dotenv = require('dotenv')
const userRouter = require('./routes/userRouter')
const customerRouter = require('./routes/customerRouter')
const cookieParser = require('cookie-parser')
const cors = require('cors')


dotenv.config()
app.use(cookieParser());
app.use(express.json())
app.use(cors({
    origin:["http://localhost:3001","https://user-authication.netlify.app"],
    credentials:true
}))


//routers
app.use('/api/v1/user',userRouter)
app.use('/api/v1/customer',customerRouter)


PORT = process.env.PORT || 3000

const start = async() => {
   try{
        mongoose.connect(process.env.MONGOSE_URI)
        console.log("connected to database...")
        app.listen(PORT,() => {
            console.log(`server is started at port ${PORT}...`);
        })
   }
   catch(err){
       console.log(err)
   }
}

start()