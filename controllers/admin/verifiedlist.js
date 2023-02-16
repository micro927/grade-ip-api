import * as dotenv from 'dotenv'
import { mysqlConnection } from '../../connection/mysql.js'
dotenv.config()
const courseForVerifyList = async (req, res) => {
    const { role } = res.locals.UserDecoded
    const { gradeType, deliverRowLimit } = req.query
    const isDeliverRowLimitValid = Number.isInteger(parseInt(deliverRowLimit)) && parseInt(deliverRowLimit) > 0
    if (role >= 9 && isDeliverRowLimitValid) {
        const connection = await mysqlConnection('online_grade_ip')
        await connection.query(`SELECT *
                            FROM
                            (SELECT * FROM tbl_class 
                                WHERE submission_id IS NOT NULL
                                AND deliver_id IS NOT NULL
                                AND reg_submit_itaccountname IS NOT NULL
                                AND ip_type = :gradeType
                                ) tbl_class
                            LEFT JOIN (SELECT bulletin_id,TRIM(title_short_en) course_title FROM db_center.tbl_bulletin) bulletin
                            USING(bulletin_id)
                            ORDER BY reg_submit_datetime DESC
                            LIMIT ${deliverRowLimit}`,
            {
                gradeType
            }
        )
            .then(([rows]) => {
                if (rows.length > 0) {
                    res.status(200).json(rows)
                }
                else {
                    res.status(200).json([])
                }
            })
            .catch((error) => {
                res.status(500)
                console.log("mysqlConnection ERROR: ", error);
            })
        await connection.end()
    }
    else {
        res.status(400).json({ status: 'not valid' })
        console.log("notvalid");
    }
}

export default courseForVerifyList