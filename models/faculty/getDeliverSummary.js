import { mysqlConnection } from "../../connection/mysql.js"

const getDeliverSummary = async (deliverId, facultyId) => {
    let result = {
        status: false,
        content: null
    }
    const connection = await mysqlConnection('online_grade_ip')
    await connection.query(`SELECT *
                            FROM tbl_log_deliver
                            LEFT JOIN
                            (SELECT
                                deliver_id,
                                COUNT(*) count_all,
                                SUM(CASE WHEN submission_id IS NULL THEN 1 ELSE 0 END) null_submission_id
                                 FROM tbl_class WHERE deliver_id IS NOT NULL GROUP BY deliver_id) summary
                                 USING(deliver_id)
                            WHERE deliver_id = :deliverId
                            AND (faculty_id = :facultyId OR :facultyId = 52)`,
        {
            deliverId,
            facultyId,
        }
    )
        .then(([rows]) => {
            if (rows.length > 0) {
                result.status = true
                result.content = rows[0]
            }
        })
        .catch((error) => {
            result.content = "getDeliverSummary ERROR: " + error?.sqlMessage || 'API error'
            console.log(result.content);
        })
    await connection.end()
    return result
}

export default getDeliverSummary