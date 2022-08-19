import * as dotenv from 'dotenv'
import axios from 'axios'
import mysqlConnection from '../connection/mysql.js'
dotenv.config()

const courseList = async (req, res) => {
    const userInfo = res.locals.UserDecoded
    const gradeType = req.query.gradeType
    const connection = await mysqlConnection('online_grade_ip')
    await connection.query(`SELECT * FROM
                            (SELECT class_id, 'inList' class_type,semester,year,courseno,seclec,seclab,ip_type,yearly,bulletin_id FROM tbl_class WHERE courseno IN (:courseno)
                            UNION
                            SELECT class_id, 'teach' class_type,semester,year,courseno,seclec,seclab,ip_type,yearly,bulletin_id FROM tbl_class WHERE instructor_id IN(:instructorId)) main
                            LEFT JOIN (SELECT bulletin_id,TRIM(title_short_en) course_title FROM db_center.tbl_bulletin) bulletin
                            USING(bulletin_id)
                            JOIN
                            (SELECT class_id,COUNT(*) all_student ,COUNT(CASE WHEN(grade_new IS NOT NULL) THEN 1 END) filled_student FROM tbl_student_grade GROUP BY class_id) student
                            USING(class_id) WHERE ip_type = :ip_type`,
        {
            courseno: userInfo.courseList,
            instructorId: userInfo.instructorId,
            ip_type: gradeType
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
}

export default courseList