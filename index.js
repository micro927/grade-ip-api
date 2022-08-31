import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import * as dotenv from 'dotenv'
import { login, checkUserToken, verifyMiddleware } from './controllers/authentication/index.js'
import teacherRoutes from './routes/teacher.js'
import departmentRoutes from './routes/department.js'
// import { createHash } from 'crypto'

// const hash = createHash('sha256', 'submission_id')
//     .update('sitthiphon.s 2022-08-30 22:08:15')
//     .digest('hex');

// const rer = '9f8620f8ad80f254fdbc508b99b4aef0add2960e9db70339c0f0a5ac4f675da5' === hash ? 'OK' : 'NO'

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