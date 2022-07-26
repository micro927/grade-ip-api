import express from 'express'
import bodyParser from 'body-parser'
import * as dotenv from 'dotenv'
import courses from './routes/courses.js'

dotenv.config()
const app = express()
app.use(bodyParser.json())


app.get("/", (req, res) => res.send("Hello, World!"))

app.use('/courses', courses)

app.listen((process.env.HOST, process.env.PORT), () => {
    console.log(`Running on http://${process.env.HOST}:${process.env.PORT}`);
});

export default app;