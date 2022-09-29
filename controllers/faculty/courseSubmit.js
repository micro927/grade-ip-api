import * as dotenv from 'dotenv'
import { mysqlConnection } from '../../connection/mysql.js'
import { putLogFacUserSubmit } from '../../models/putLog.js'
dotenv.config()

const courseSubmit = async (req, res) => {
    const { courseList, cmuitaccount_name, role } = res.locals.UserDecoded
    const { classId } = req.params || {}
    const { submissionId } = req.body || {}

    if (classId.length == 19 && submissionId?.length == 64 && role >= 3) {
        const datetime = new Date()
        const connection = await mysqlConnection('online_grade_ip')
        await connection.query(`UPDATE tbl_class
                                    SET
                                        facuser_submit_itaccountname = :cmuitaccount_name,
                                        facuser_submit_datetime = :datetime
                                    WHERE class_id = :classId
                                    AND submission_id = :submissionId
                                    AND submission_id IS NOT NULL
                                    AND deptuser_submit_itaccountname IS NOT NULL
                                    AND courseno IN (:courseList)
                                    AND last_date > NOW()
                                    `,
            {
                submissionId,
                cmuitaccount_name,
                datetime,
                classId,
                courseList
            }
        ).then(async ([rows]) => {
            const affectedRows = await rows?.affectedRows || 0
            await putLogFacUserSubmit(classId, submissionId, 's', cmuitaccount_name)
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