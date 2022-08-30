import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import * as dotenv from 'dotenv'
import { login, checkUserToken, verifyMiddleware } from './controllers/authentication/index.js'
import teacherRoutes from './routes/teacher.js'
import departmentRoutes from './routes/department.js'

dotenv.config()
const app = express()
app.use(cors('*'))
app.use(bodyParser.json())
app.get("/", (req, res) => res.status(400).json('HELLO MARS'))

// for authentication
app.get('/login', login)
app.get("/checkusertoken", checkUserToken)

// for application function
app.use('/teacher', verifyMiddleware, teacherRoutes)
app.use('/department', verifyMiddleware, departmentRoutes)

app.listen((process.env.HOST, process.env.PORT), () => {
    console.log(`Running on http://${process.env.HOST}:${process.env.PORT}`);
});

export default app;