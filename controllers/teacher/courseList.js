import * as dotenv from 'dotenv'
import { mysqlConnection } from '../../connection/mysql.js'
dotenv.config()

const courseList = async (req, res) => {
    const { instructorId, courseList } = res.locals.UserDecoded
    const { gradeType } = req.query
    const connection = await mysqlConnection('online_grade_ip')
    await connection.query(`SELECT *,
                            IF(filled_student = 0,0,IF(deptuser_submit_itaccountname IS NULL,1,IF(facuser_submit_itaccountname IS NULL,2,IF(deliver_id IS NULL,3,IF(reg_submit_itaccountname IS NULL,4,5))))) submit_status
                            FROM
                            (SELECT *, 'inList' class_type
                            FROM tbl_class WHERE courseno IN (:courseList)
                            UNION
                            SELECT *, 'teach' class_type
                            FROM tbl_class WHERE instructor_id IN(:instructorId)) main
                            LEFT JOIN (SELECT bulletin_id,TRIM(title_short_en) course_title FROM db_center.tbl_bulletin) bulletin
                            USING(bulletin_id)
                            JOIN
                            (SELECT class_id,COUNT(*) all_student ,COUNT(CASE WHEN(grade_new IS NOT NULL) THEN 1 END) filled_student FROM tbl_student_grade GROUP BY class_id) student
                            USING(class_id) WHERE ip_type = :gradeType
                            ORDER BY submit_status,year,semester,courseno,seclec,seclab`,
        {
            courseList,
            instructorId,
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
            console.log("mysqlConnection ERROR: ", error.sqlMessage || error);
        })
    await connection.end()
}

export default courseList