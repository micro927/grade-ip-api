import * as dotenv from 'dotenv'
import getCourseData from '../../models/teacher/getCourseData.js'
dotenv.config()

const courseDetail = async (req, res) => {
    const classId = req.params.classId
    const { instructorId } = res.locals.UserDecoded
    const { userCourseList } = res.locals
    const courseList = userCourseList.length > 0 ? userCourseList : ['']
    const result = await getCourseData(classId, instructorId, courseList)

    if (result.status) {
        res.status(200).json(result.content)
    }
    else {
        res.status(500).json(result.content)
    }
}

export default courseDetail