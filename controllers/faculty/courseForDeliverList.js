import * as dotenv from 'dotenv'
import { mysqlConnection } from '../../connection/mysql.js'
dotenv.config()

const courseForDeliverList = async (req, res) => {
    const { organization_code, role } = res.locals.UserDecoded
    const { gradeType } = req.query
    const facultyId = organization_code
    if (role >= 3) {
        const connection = await mysqlConnection('online_grade_ip')
        await connection.query(`SELECT *
                            FROM
                            (SELECT * FROM tbl_class 
                                WHERE (course_faculty_id = :facultyId OR :facultyId = 52)
                                AND submission_id IS NOT NULL
                                AND deptuser_submit_itaccountname IS NOT NULL
                                AND facuser_submit_itaccountname IS NOT NULL
                                AND ip_type = :gradeType
                                ) tbl_class
                            LEFT JOIN (SELECT bulletin_id,TRIM(title_short_en) course_title FROM db_center.tbl_bulletin) bulletin
                            USING(bulletin_id)
                            JOIN
                            (SELECT class_id,
                                    COUNT(*) all_student,
                                    COUNT(CASE WHEN(grade_new IS NOT NULL) THEN 1 END) filled_student
                                    FROM tbl_student_grade GROUP BY class_id) student
                            USING(class_id)
                            ORDER BY class_id`,
            {
                facultyId,
                gradeType
            }
        )
            .then(async ([rows]) => {
                let result = {}
                if (rows.length > 0) {
                    await connection.query(`SELECT tbl_log_deliver.*,tbl_log_reg_submit.reg_submit_itaccountname,tbl_log_reg_submit.reg_submit_datetime FROM tbl_log_deliver
                                                    LEFT JOIN (SELECT DISTINCT(deliver_id) deliver_id FROM tbl_class
                                                        WHERE (course_faculty_id = :facultyId OR :facultyId = 52)
                                                        AND ip_type = :gradeType
                                                        AND facuser_submit_itaccountname IS NOT NULL
                                                        AND deliver_id IS NOT NULL
                                                        ) a USING(deliver_id)
                                                        LEFT JOIN tbl_log_reg_submit USING(deliver_id)
                                                        ORDER BY tbl_log_deliver.facuser_deliver_datetime DESC`, {
                        facultyId,
                        gradeType
                    })
                        .then(([rows]) => {
                            result.deliverIdList = rows
                        })
                    result.courseForDeliverList = rows
                    res.status(200).json(result)
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
        console.log("coursefordeliverlist notvalid");
    }
}

export default courseForDeliverList