import * as dotenv from 'dotenv'
import { mysqlConnection } from '../../connection/mysql.js'
import { createHash } from 'crypto'
import { putLogDeptUserSubmit } from '../../models/putLog.js'


dotenv.config()

const courseSubmit = async (req, res) => {
    const { classId } = req.params || {}
    const { cmuitaccount_name, role } = res.locals.UserDecoded
    const { userCourseList } = res.locals
    const courseList = userCourseList.length > 0 ? userCourseList : ['']

    if (classId.length == 19 && role >= 2) {
        const connection = await mysqlConnection('online_grade_ip')
        const datetime = new Date()
        const submissionIdNew = createHash('sha256')
            .update(`submit ${classId} ${cmuitaccount_name} ${datetime}`)
            .digest('hex');

        await connection.query(`UPDATE tbl_class
                                        JOIN
                                        (SELECT class_id,
                                                COUNT(*) all_student,
                                                COUNT(CASE WHEN(grade_new IS NOT NULL) THEN 1 END) filled_student
                                                FROM tbl_student_grade GROUP BY class_id) student
                                        USING(class_id)
                                    SET submission_id = :submissionIdNew,
                                            deptuser_submit_itaccountname = :cmuitaccount_name,
                                            deptuser_submit_datetime = :datetime
                                    WHERE class_id = :classId
                                    AND courseno IN (:courseList)
                                    AND filled_student > 0
                                    AND submission_id IS NULL
                                    AND last_date > NOW()
                                    `,
            {
                submissionIdNew,
                cmuitaccount_name,
                datetime,
                classId,
                courseList
            }
        ).then(async ([rows]) => {
            const affectedRows = await rows?.affectedRows || 0
            await putLogDeptUserSubmit(classId, submissionIdNew, 's', cmuitaccount_name)
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
        console.log("notvalid");
    }
}

export default courseSubmit