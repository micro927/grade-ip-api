import express from 'express'
import courseForVerifyList from '../controllers/admin/courseForVerifyList.js'
import submit from '../controllers/admin/submit.js'

const router = express.Router()
router.get('/', (req, res) => {
    res.status(400).json()
})

router
    .get('/courseforverifylist', courseForVerifyList)
    .get('/submit/:deliverId', submit)


export default router