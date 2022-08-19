import express from 'express'
import courseList from '../controllers/courseList.js'

const router = express.Router()

router.get('/', courseList)

router.get('/course/:id', (req, res) => {
    res.send(req.params.id)
})

router.get('/add', (req, res) => {
    res.send("ADD COURSES")
})


export default router