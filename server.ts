//Importing Express function as well as Request, Response, NextFunction types to
//later use them in the GET http controller
import Express, {NextFunction, Request, Response} from 'express'
import bodyParser from "body-parser"
import dotenv from 'dotenv'
import {validateDate} from './helpers/validateDate'
import axios from "axios";

//Calling the Express function and creating an instance 'app'
const app = Express()

//This library loads a '.env' file in to the memory
dotenv.config()

//Express middleware to decode and parse incoming data to JSON
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

//This middleware checks if the incoming JSON body is valid or not,
//If invalid, this will return http code 400
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    // This check makes sure this is a JSON parsing issue, but it might be
    // coming from any middleware, not just body-parser:

    //@ts-ignore
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.sendStatus(400) // Bad request
    }
    next()
})


//Creating a base url const variable, since this remains the same
//throughout the lifecycle of our app
const BASE_API_URL = 'https://jsonmock.hackerrank.com/api/stocks'

//We could definitely separate this controller function into
//its own folder and file structure, but for the sake of simplicity
//I wrote the logic here
app.get('/api/stocks', async (req: Request, res: Response) => {
    const {date = ''} = req.query
    if(!validateDate(date)) return res.status(400).json('Invalid date')

    const {data} = await axios.get(`${BASE_API_URL}?date=${date}`)

    res.status(200).json({
        open: data.data[0].open,
        high: data.data[0].high,
        low: data.data[0].low,
        close: data.data[0].close,
    })
})

//Defining the application starting PORT, either via environment variable
//or hardcoded, preference is given to environment variable
const PORT = process.env.PORT || 3000

//Starting the application on the defined PORT
app.listen(PORT, () => console.log(`SERVER STARTED ON PORT ${PORT}`))
