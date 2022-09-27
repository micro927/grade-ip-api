import { mysqlConnection } from "../../connection/mysql.js"

const getStudentData = async (classId, instructorId, courseList) => {
    let result = {
        status: true,
        content: null
    }
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
            classId: classId,
            instructorId: instructorId,
            courseList: courseList,
        }
    )
        .then(([rows]) => {
            result.content = rows.length > 0 ? rows : []
        })
        .catch((error) => {
            result.status = false
            result.content = "getStudentData ERROR: " + error?.sqlMessage || 'API error'
            console.log(result.content);
        })
    await connection.end()
    return result
}

export default getStudentData