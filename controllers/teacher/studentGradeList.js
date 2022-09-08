import * as dotenv from 'dotenv'
import mysqlConnection from '../../connection/mysql.js'
dotenv.config()

const studentGradeList = async (req, res) => {
    const userInfo = res.locals.UserDecoded
    const classId = req.params.classId
    const connection = await mysqlConnection('online_grade_ip')
    await connection.query(`SELECT student_id,
                                    TRIM(name_th) name,
                                    TRIM(surname_th) surname,
                                    enroll_status,
                                    grade_old,
                                    IFNULL(grade_new,'') AS grade_new,
                                    fill_itaccountname,
                                    fill_datetime,
                                    IFNULL(grade_new,'') AS edit_grade,
                                    fill_itaccountname AS edit_by,
                                    fill_datetime AS edit_datetime
                            FROM tbl_student_grade
                            LEFT JOIN tbl_class USING(class_id)
                            LEFT JOIN db_center.tbl_student USING(student_id) 
                            WHERE class_id = :classId AND(tbl_class.courseno IN (:courseList) OR instructor_id IN(:instructorId))`,
        {
            courseList: userInfo.courseList,
            instructorId: userInfo.instructorId,
            classId: classId
        }
    )
        .then(([rows]) => {
            if (rows.length > 0) {
                res.status(200).json(rows)
            }
            else {
                res.status(403).json([])
            }
        })
        .catch((error) => {
            res.status(500)
            console.log("mysqlConnection ERROR: ", error);
        })
    await connection.end()
}

export default studentGradeList