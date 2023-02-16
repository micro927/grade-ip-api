import * as dotenv from 'dotenv'
import getStudentData from '../../models/teacher/getStudentData.js'
dotenv.config()

const studentGradeList = async (req, res) => {
    const classId = req.params.classId
    const { instructorId } = res.locals.UserDecoded
    const { userCourseList } = res.locals
    const courseList = userCourseList.length > 0 ? userCourseList : ['']
    const result = await getStudentData(classId, instructorId, courseList)

    if (result.status) {
        res.status(200).json(result.content)
    }
    else {
        console.log(result.content);
        res.status(500).json(result.content)

    }
}

export default studentGradeList