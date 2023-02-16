import express from 'express'
import courseList from '../controllers/department/courseList.js'
import courseSubmit from '../controllers/department/courseSubmit.js'
import courseSubmitCancel from '../controllers/department/courseSubmitCancel.js'

const router = express.Router()
router.get('/', (req, res) => {
    res.status(400).json()
})

router
    .get('/courselist', courseList)
    .post('/submit/:classId', courseSubmit)
    .post('/submitcancel/:classId', courseSubmitCancel)

export default router