import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import * as dotenv from 'dotenv'
import coursesRoutes from './routes/courses.js'
import authenticationRoutes from './routes/authentication.js'
import prepareRoutes from './routes/prepare.js'

dotenv.config()
const app = express()
app.use(cors('*'))
app.use(bodyParser.json())
app.get("/", (req, res) => res.status(401).json("Unauthorized"))


const abc = (req, res, next) => {
    const a = req.query
    const islogin = true
    if (islogin) {
        next()
    }
    else {
        res.status(200).json(a)
    }
}

app.use('/', authenticationRoutes)


app.use(abc)
app.use('/prepare', prepareRoutes)
app.use('/courses', coursesRoutes)

app.listen((process.env.HOST, process.env.PORT), () => {
    console.log(`Running on http://${process.env.HOST}:${process.env.PORT}`);
});

export default app;