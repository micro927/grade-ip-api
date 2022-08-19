import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import * as dotenv from 'dotenv'
import coursesRoutes from './routes/courses.js'
import { login, checkUserToken, verifyMiddleware } from './controllers/authentication.js'
import prepareRoutes from './routes/prepare.js'

dotenv.config()
const app = express()
app.use(cors('*'))
app.use(bodyParser.json())
app.get("/", (req, res) => res.status(400).json('HELLO MARS'))

app.get('/login', login)
app.get("/checkusertoken", checkUserToken)

app.use('/prepare', verifyMiddleware, prepareRoutes)
app.use('/courses', verifyMiddleware, coursesRoutes)

app.listen((process.env.HOST, process.env.PORT), () => {
    console.log(`Running on http://${process.env.HOST}:${process.env.PORT}`);
});

export default app;