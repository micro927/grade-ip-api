import * as dotenv from 'dotenv'
import { mysqlConnection } from '../../connection/mysql.js'
import { putLogDeliver } from '../../models/putLog.js'
dotenv.config()

const deliverCancel = async (req, res) => {
    const { courseList, cmuitaccount_name, role } = res.locals.UserDecoded
    const { deliverId } = req.params || {}
    const facultyId = req.body?.facultyId || 0

    if (deliverId.length == 32 && role >= 3) {
        const connection = await mysqlConnection('online_grade_ip')
        await connection.query(`UPDATE tbl_class
                                SET
                                    deliver_id = NULL,
                                    facuser_deliver_itaccountname = NULL,
                                    facuser_deliver_datetime = NULL
                                WHERE deliver_id = :deliverId
                                AND courseno IN (:courseList)
                                AND (course_faculty_id = :facultyId  OR :facultyId = 52)
                                AND deliver_id IS NOT NULL
                                AND facuser_deliver_itaccountname IS NOT NULL
                                AND reg_submit_itaccountname IS NULL
                                AND last_date > NOW();`,
            {
                deliverId,
                courseList,
                facultyId
            }
        ).then(async ([rows]) => {
            const affectedRows = await rows?.affectedRows || 0
            await putLogDeliver(deliverId, facultyId, affectedRows, 0, cmuitaccount_name)
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
        console.log("DeliverCancel notvalid");
    }
}

export default deliverCancel