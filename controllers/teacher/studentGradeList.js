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
                                    grade_new,
                                    fill_itaccountname,
                                    fill_datetime
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
            let inputGradeList = {}
            if (rows.length > 0) {
                rows.map((row, index) => {
                    inputGradeList[row.student_id] = row.grade_new ?? ''
                })
                res.status(200).json([rows, inputGradeList])
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