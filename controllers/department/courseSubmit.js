import * as dotenv from 'dotenv'
import { mysqlConnection } from '../../connection/mysql.js'
dotenv.config()

const courseSubmit = async (req, res) => {
    const { courseList, instructorId } = res.locals.UserDecoded
    const { gradeType } = req.query
    const connection = await mysqlConnection('online_grade_ip')

    await connection.query(`UPDATE tbl_class WHERE class_id = :classId AND (courseno IN (:courseList) OR instructor_id = :instructorId)
    
    
    SELECT *,IF(filled_student>0,1,0) is_fill FROM
                            (SELECT * FROM tbl_class WHERE courseno IN (:courseList)) main
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
            instructorId,
            gradeType
        }
    )
}

export default courseSubmit