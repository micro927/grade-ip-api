import * as dotenv from 'dotenv'
import { mysql2, mysqlConnection } from '../../connection/mysql.js'
dotenv.config()

const studentGradeSave = async (req, res) => {
    const userInfo = res.locals.UserDecoded
    const classId = req.params.classId
    const data = req.body

    if (data.length > 0) {
        const gradeChangeStudent = data.filter((student) => student.edit_datetime == '*กำลังแก้ไข*')
        let queries = ''
        gradeChangeStudent.map((student) => {
            queries += mysql2.format(`UPDATE tbl_student_grade JOIN tbl_class USING(class_id) SET
                                        grade_new = ?, 
                                        fill_itaccountname = ?,
                                        fill_datetime = NOW()
                                        WHERE student_id = ?
                                        AND class_id = ?
                                        AND LEFT(enroll_status,2) = '1_' ;`,
                [student.edit_grade, student.edit_by, student.student_id, classId]
            )
        })
        ////// เหลือเช็ควิชา กับ userInfo/courselist ใน jwt
        if (queries != '') {
            const connection = await mysqlConnection('online_grade_ip')
            await connection.query(queries)
                .then(([rows]) => {
                    console.log('affectedRows', rows.affectedRows)
                    res.status(200).json({
                        status: 'ok',
                        affectedRows: rows.affectedRows
                    })
                })
                .catch((error) => {
                    res.status(500)
                    console.log("mysqlConnection ERROR: ", error);
                })
            await connection.end()
        }
        else {
            res.status(400).json('no update')
        }
    } else {
        res.status(400).json('no data')
    }
}

export default studentGradeSave