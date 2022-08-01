import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import * as dotenv from 'dotenv'
import courses from './routes/courses.js'
import authenticationRoutes from './routes/authentication.js'

dotenv.config()
const app = express()
app.use(cors('*'))
app.use(bodyParser.json())
app.get("/", (req, res) => res.status(401).json("Unauthorized"))

app.use('/', authenticationRoutes)
app.use('/courses', courses)

app.listen((process.env.HOST, process.env.PORT), () => {
    console.log(`Running on http://${process.env.HOST}:${process.env.PORT}`);
});

export default app;