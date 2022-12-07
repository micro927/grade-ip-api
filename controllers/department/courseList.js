import * as dotenv from 'dotenv'
import { mysqlConnection } from '../../connection/mysql.js'
dotenv.config()

const courseList = async (req, res) => {
    const { gradeType } = req.query
    const { role } = res.locals.UserDecoded
    const { userCourseList } = res.locals
    const courseList = userCourseList.length > 0 ? userCourseList : ['']
    if (role >= 2) {
        const connection = await mysqlConnection('online_grade_ip')
        await connection.query(`SELECT *,
                            IF(filled_student = 0,0,IF(deptuser_submit_itaccountname IS NULL,1,IF(facuser_submit_itaccountname IS NULL,2,IF(deliver_id IS NULL,3,IF(reg_submit_itaccountname IS NULL,4,5))))) submit_status 
                            FROM
                            (SELECT * FROM tbl_class WHERE courseno IN (:courseList)) tbl_class
                            LEFT JOIN (SELECT bulletin_id,TRIM(title_short_en) course_title FROM db_center.tbl_bulletin) bulletin
                            USING(bulletin_id)
                            JOIN
                            (SELECT class_id,
                                    COUNT(*) all_student,
                                    COUNT(CASE WHEN(grade_new IS NOT NULL) THEN 1 END) filled_student
                                    FROM tbl_student_grade GROUP BY class_id) student
                            USING(class_id) WHERE ip_type = :gradeType
                            ORDER BY FIELD(submit_status,1,2,3,4,5,0), year DESC,semester DESC,courseno,seclec,seclab`,
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
        console.log("courselist notvalid");
    }
}

export default courseList