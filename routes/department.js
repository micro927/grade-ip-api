import express from 'express'
import courseList from '../controllers/department/courseList.js'

const router = express.Router()
router.get('/', (req, res) => {
    res.status(400).json()
})

router.get('/courselist', courseList)
// router.get('/coursedetail/:classId', courseDetail)

export default router