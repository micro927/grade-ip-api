import * as dotenv from 'dotenv'
import { mysqlConnection } from '../../connection/mysql.js'
dotenv.config()

const courseDetail = async (req, res) => {
    const userInfo = res.locals.UserDecoded
    const classId = req.params.classId
    const connection = await mysqlConnection('online_grade_ip')
    await connection.query(`SELECT tbl_class.*,course_title 
                            FROM tbl_class
                            LEFT JOIN (SELECT courseno,bulletin_id,TRIM(title_short_en) course_title FROM db_center.tbl_bulletin) bulletin
                            USING(courseno,bulletin_id) 
                            WHERE class_id = :classId AND(tbl_class.courseno IN (:courseList) OR instructor_id IN(:instructorId)) LIMIT 1`,
        {
            classId: classId,
            courseList: userInfo.courseList,
            instructorId: userInfo.instructorId,
        }
    )
        .then(([rows]) => {
            if (rows.length > 0) {
                res.status(200).json(rows[0])
            }
            else {
                res.status(403).json([])
            }
        })
        .catch((error) => {
            res.status(500)
            console.log("mysqlConnection ERROR: ", error.code);
        })
    await connection.end()

}

export default courseDetail