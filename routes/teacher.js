import express from 'express'
import courseList from '../controllers/teacher/courseList.js'
import courseDetail from '../controllers/teacher/courseDetail.js'
import studentGradeList from '../controllers/teacher/studentGradeList.js'
import studentGradeSave from '../controllers/teacher/studentGradeSave.js'
import excelDownload from '../controllers/teacher/excelDownload.js'
import cmr54 from '../controllers/teacher/pdf/cmr54.js'
const router = express.Router()

router.get('/', (req, res) => {
    res.status(400).json()
})

router
    .get('/courselist', courseList)
    .get('/coursedetail/:classId', courseDetail)
    .get('/studentlist/:classId', studentGradeList)
    .post('/save/:classId', studentGradeSave)
    .get('/exceldownload/:classId', excelDownload)
    .get('/cmr54/:classId', cmr54)


export default router