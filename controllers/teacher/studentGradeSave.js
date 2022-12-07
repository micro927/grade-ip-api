import * as dotenv from 'dotenv'
import { mysql2, mysqlConnection } from '../../connection/mysql.js'
import { putLogFill } from '../../models/putLog.js'
dotenv.config()

const studentGradeSave = async (req, res) => {
    const { classId } = req.params
    const data = req.body

    const { instructorId, cmuitaccount_name } = res.locals.UserDecoded
    const { userCourseList } = res.locals
    const courseList = userCourseList.length > 0 ? userCourseList : ['']

    if (data?.length > 0) {
        const gradeChangeStudent = data.filter((student) => student.edit_datetime == '*กำลังแก้ไข*')
        let queries = ''
        gradeChangeStudent.map((student) => {
            const gradeNew = student.edit_grade == '' ? null : student.edit_grade
            queries += mysql2.format(`UPDATE tbl_student_grade 
                                        JOIN tbl_class USING(class_id) 
                                        JOIN db_center.tbl_grade USING(grade_id) 
                                        SET
                                        grade_new = ?, 
                                        fill_itaccountname = ?,
                                        fill_datetime = NOW()
                                        WHERE student_id = ?
                                        AND class_id = ?
                                        AND LEFT(enroll_status,2) = '1_'
                                        AND (courseno IN (?) OR instructor_id = ?)
                                        AND grade_accept LIKE ?
                                        AND last_date > NOW()
                                        ;`,
                [
                    gradeNew,
                    student.edit_by,
                    student.student_id,
                    classId,
                    courseList,
                    instructorId,
                    `%${student.edit_grade}%`,
                ]
            )
        })
        if (queries != '') {
            let affectedRows = 0
            const connection = await mysqlConnection('online_grade_ip')
            await connection.query(queries)
                .then(async ([rows]) => {
                    if (typeof rows.affectedRows == 'number') {
                        affectedRows = rows.affectedRows
                    }
                    else if (rows.length > 1) {
                        const sumaffectedRows = rows.reduce((prevAffectedRow, row) => {
                            return prevAffectedRow + row.affectedRows
                        }, 0)
                        affectedRows = sumaffectedRows
                    }
                    await putLogFill(classId, affectedRows, 1, cmuitaccount_name)
                    await res.status(200).json({
                        status: 'ok',
                        affectedRows
                    })
                })
                .catch((error) => {
                    res.status(500).json({ status: 'connection error' })
                    console.log("mysqlConnection ERROR: ", error);
                })
            await connection.end()
        }
        else {
            res.status(403).json({ status: 'no update' })
        }
    } else {
        res.status(400).json({ status: 'no data' })
    }
}

export default studentGradeSave