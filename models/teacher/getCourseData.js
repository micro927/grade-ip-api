import { mysqlConnection } from "../../connection/mysql.js"

const getCourseData = async (classId, instructorId, courseList) => {
    let result = {
        status: false,
        content: null
    }
    const courseListForBind = courseList.length > 0 ? courseList : ['']
    const connection = await mysqlConnection('online_grade_ip')
    await connection.query(`SELECT tbl_class.*,
                            course_title,
                            TRIM(name_th) instructor_name,
                            TRIM(middle_name_th) instructor_middle_name,
                            TRIM(surname_th) instructor_surname
                            FROM tbl_class
                            LEFT JOIN db_center.tbl_instructor USING(instructor_id) 
                            LEFT JOIN (SELECT courseno,bulletin_id,TRIM(title_short_en) course_title FROM db_center.tbl_bulletin) bulletin
                            USING(courseno,bulletin_id) 
                            WHERE class_id = :classId AND(tbl_class.courseno IN (:courseListForBind) OR instructor_id IN(:instructorId)) LIMIT 1`,
        {
            classId,
            instructorId,
            courseListForBind,
        }
    )
        .then(([rows]) => {
            if (rows.length > 0) {
                result.status = true
                result.content = rows[0]
            }
        })
        .catch((error) => {
            result.content = "getCourseData ERROR: " + error?.sqlMessage || 'API error'
            console.log(result.content);
        })
    await connection.end()
    return result
}

export default getCourseData