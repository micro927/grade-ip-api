import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import * as dotenv from 'dotenv'
import { login, checkUserToken, verifyMiddleware, testRole } from './controllers/authentication/index.js'
import teacherRoutes from './routes/teacher.js'
import departmentRoutes from './routes/department.js'
import facultyRoutes from './routes/faculty.js'
import adminRoutes from './routes/admin.js'

dotenv.config()
const app = express()

//starting config
app.use(cors('*'))
app.use(bodyParser.json())
// app.use(bodyParser.json({ limit: '50mb' }));
// app.use(bodyParser.urlencoded({ extended: false }));
app.get("/", (req, res) => res.status(400).json('HELLO MARS')) // should disable on production.


// for authentication
app.get('/login', login)
app.get('/testrole', testRole)
app.get('/checkusertoken', checkUserToken)

// for application function
app.use('/teacher', verifyMiddleware, teacherRoutes)
app.use('/department', verifyMiddleware, departmentRoutes)
app.use('/faculty', verifyMiddleware, facultyRoutes)
app.use('/admin', verifyMiddleware, adminRoutes)


// default error response
// app.use((req, res, next) => {
//     console.log('Route does not exist')
//     res.status(404).send({
//         status: 404,
//         message: 'Not Found',
//     })
// })
app.listen((process.env.HOST, process.env.PORT), () => {
    console.log(`Running on http://${process.env.HOST}:${process.env.PORT}`);
});

export default app;