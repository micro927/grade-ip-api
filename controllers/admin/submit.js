import * as dotenv from 'dotenv'
import { mysqlConnection } from '../../connection/mysql.js'
import { putLogRegSubmit } from '../../models/putLog.js'
dotenv.config()

const submit = async (req, res) => {
    const { cmuitaccount_name, role } = res.locals.UserDecoded
    const { deliverId } = req.params || {}

    if (deliverId?.length == 64 && role >= 9) {
        const datetime = new Date()
        const connection = await mysqlConnection('online_grade_ip')
        await connection.query(`UPDATE tbl_class
                                    SET
                                        reg_submit_itaccountname = :cmuitaccount_name,
                                        reg_submit_datetime = :datetime
                                    WHERE deliver_id = :deliverId
                                    AND submission_id IS NOT NULL
                                    AND deptuser_submit_itaccountname IS NOT NULL
                                    AND facuser_submit_itaccountname IS NOT NULL
                                    AND deliver_id IS NOT NULL
                                    AND reg_submit_itaccountname IS NULL
                                    `,
            {
                cmuitaccount_name,
                datetime,
                deliverId,
            }
        ).then(async ([rows]) => {
            const affectedRows = await rows?.affectedRows || 0
            await putLogRegSubmit(deliverId, 's', cmuitaccount_name)
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

export default submit