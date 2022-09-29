import * as dotenv from 'dotenv'
import { mysqlConnection } from '../../connection/mysql.js'
dotenv.config()

const courseForDeliverList = async (req, res) => {
    const { courseList, role } = res.locals.UserDecoded
    const { gradeType } = req.query
    if (role >= 3) {
        const connection = await mysqlConnection('online_grade_ip')
        await connection.query(`SELECT *
                            FROM
                            (SELECT * FROM tbl_class 
                                WHERE courseno IN (:courseList)
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
                courseList,
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
                console.log("mysqlConnection ERROR: ", error.code);
            })
        await connection.end()
    }
    else {
        res.status(400).json({ status: 'not valid' })
        console.log("coursefordeliverlist notvalid");
    }
}

export default courseForDeliverList