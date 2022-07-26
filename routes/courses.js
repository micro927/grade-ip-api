import express from 'express'

const router = express.Router()

router.get('/', (req, res) => {
    res.send('HERES ARE ALL COURSES')
})

router.get('/course/:id', (req, res) => {
    res.send(req.params.id)
})

router.get('/add', (req, res) => {
    res.send("ADD COURSES")
})


export default router