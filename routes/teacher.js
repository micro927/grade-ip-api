import express from 'express'
import courseList from '../controllers/teacher/courseList.js'
import studentGradeList from '../controllers/teacher/studentGradeList.js'

const router = express.Router()
router.get('/', (req, res) => {
    res.status(400).json()
})

router.get('/courselist', courseList)
router.get('/fill/:classId', studentGradeList)

export default router