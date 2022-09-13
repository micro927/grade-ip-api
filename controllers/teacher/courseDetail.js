import * as dotenv from 'dotenv'
import getCourseData from '../../models/getCourseData.js'
dotenv.config()

const courseDetail = async (req, res) => {
    const classId = req.params.classId
    const { instructorId, courseList } = res.locals.UserDecoded
    const result = await getCourseData(classId, instructorId, courseList)

    if (result.status) {
        res.status(200).json(result.content)
    }
    else {
        console.log(result.content);
        res.status(500).json(result.content)

    }
}

export default courseDetail