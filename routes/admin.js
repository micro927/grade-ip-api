import express from 'express'
import courseForVerifyList from '../controllers/admin/courseForVerifyList.js'

const router = express.Router()
router.get('/', (req, res) => {
    res.status(400).json()
})

router
    .get('/courseforverifylist', courseForVerifyList)


export default router