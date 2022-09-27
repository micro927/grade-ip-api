import * as dotenv from 'dotenv'
import { mysqlConnection } from '../../connection/mysql.js'
dotenv.config()

const courseList = async (req, res) => {
    const { courseList } = res.locals.UserDecoded
    const { gradeType } = req.query
    const connection = await mysqlConnection('online_grade_ip')
    await connection.query(`SELECT *,IF(filled_student>0,1,0) is_fill FROM
                            (SELECT *,
                                    IF(deptuser_submit_itaccountname IS NULL,'wait_dept',IF(facuser_submit_itaccountname IS NULL,'wait_fac',IF(deliver_id IS NULL,'wait_deliver',IF(reg_submit_itaccountname IS NULL,'wait_reg','complete')))) submit_status
                                    FROM tbl_class 
                            WHERE courseno IN (:courseList)) main
                            LEFT JOIN (SELECT bulletin_id,TRIM(title_short_en) course_title FROM db_center.tbl_bulletin) bulletin
                            USING(bulletin_id)
                            JOIN
                            (SELECT class_id,
                                    COUNT(*) all_student,
                                    COUNT(CASE WHEN(grade_new IS NOT NULL) THEN 1 END) filled_student
                                    FROM tbl_student_grade GROUP BY class_id) student
                            USING(class_id) WHERE ip_type = :gradeType
                            ORDER BY is_fill DESC,year DESC,semester DESC,courseno,seclec,seclab`,
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

export default courseList