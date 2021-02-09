const express = require('express')
const colors = require('colors')
const dotenv = require('dotenv')
const path = require('path')
const morgan = require('morgan')

const app = express();
const PORT = process.env.port || 5000 ; 


/** IMPORTING FILES **/
const userRouters = require('./Routes/userRoutes')
const missionRouters = require('./Routes/missionRoutes')
const { Check_token} = require('./middleware/userMiddleware')

//link the config.env
dotenv.config({path : './Config/config.env'})

// import connectDB function 
const { connectDB } = require('./Config/db');
const cookieParser = require('cookie-parser')
connectDB();

//link morgan 

if ( process.NODE_ENV === 'development') app.use(morgan('dev'))



app.use(express.json())
app.use(cookieParser())
/*************************  Middleware        ************** */
app.use(Check_token)

/************************ Api Routes ***************/
app.use('/api/v1/', userRouters )
app.use('/api/v2/', missionRouters)



/***************************************/

app.listen(PORT, console.log(`Server is Running in ${process.env.NODE_ENV} mode at port ${PORT}`.yellow.bold))