import * as dotenv from 'dotenv'
import getStudentData from '../../models/getStudentData.js'
dotenv.config()

const studentGradeList = async (req, res) => {
    const classId = req.params.classId
    const { instructorId, courseList } = res.locals.UserDecoded
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