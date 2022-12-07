import * as dotenv from 'dotenv'
import { mysqlConnection } from '../../connection/mysql.js'
import { putLogDeptUserSubmit } from '../../models/putLog.js'
dotenv.config()

const courseSubmitCancel = async (req, res) => {
    const { classId } = req.params || {}
    const { submissionId } = req.body || {}
    const { cmuitaccount_name, role } = res.locals.UserDecoded
    const { userCourseList } = res.locals
    const courseList = userCourseList.length > 0 ? userCourseList : ['']

    if (classId.length == 19 && submissionId.length == 64 && role >= 2) {
        const connection = await mysqlConnection('online_grade_ip')
        await connection.query(`UPDATE tbl_class
                                    SET submission_id = NULL,
                                        deptuser_submit_itaccountname = NULL,
                                        deptuser_submit_datetime = NULL
                                    WHERE class_id = :classId
                                    AND courseno IN (:courseList)
                                    AND submission_id = :submissionId
                                    AND facuser_submit_itaccountname IS NULL
                                    `,
            {
                classId,
                courseList,
                submissionId
            }
        ).then(async ([rows]) => {
            const affectedRows = await rows?.affectedRows || 0
            await putLogDeptUserSubmit(classId, submissionId, 'c', cmuitaccount_name)
            await res.status(200).json({
                status: 'ok',
                affectedRows
            })
        }).catch((error) => {
            res.status(500).json({ status: 'connection error' })
            console.log("mysqlConnection ERROR: ", error);
        })
        await connection.end()
    }
    else {
        res.status(400).json({ status: 'not valid' })
        console.log("DeptSubmitCancel notvalid");
    }
}

export default courseSubmitCancel