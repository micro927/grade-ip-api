import express from 'express'
import verifiedList from '../controllers/admin/verifiedList.js'
import submit from '../controllers/admin/submit.js'

const router = express.Router()
router.get('/', (req, res) => {
    res.status(400).json()
})

router
    .get('/verifiedlist', verifiedList)
    .post('/submit', submit)


export default router