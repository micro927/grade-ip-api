import express from 'express'
import courseList from '../controllers/faculty/courseList.js'
import courseSubmit from '../controllers/faculty/courseSubmit.js'
import courseSubmitCancel from '../controllers/faculty/courseSubmitCancel.js'
import courseForDeliverList from '../controllers/faculty/courseForDeliverList.js'

const router = express.Router()
router.get('/', (req, res) => {
    res.status(400).json()
})

router
    .get('/courselist', courseList)
    .post('/submit/:classId', courseSubmit)
    .post('/submitcancel/:classId', courseSubmitCancel)
    .get('/coursefordeliverlist', courseForDeliverList)

export default router