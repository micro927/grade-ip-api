import { mysqlConnection } from "../../connection/mysql.js"

const getDeliverData = async (deliverId, facultyId) => {
    let result = {
        status: false,
        content: null
    }
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
                            WHERE deliver_id = :deliverId
                            AND (course_faculty_id = :facultyId OR :facultyId = 52)`,
        {
            deliverId,
            facultyId,
        }
    )
        .then(([rows]) => {
            if (rows.length > 0) {
                result.status = true
                result.content = rows
            }
        })
        .catch((error) => {
            result.content = "getDeliverData ERROR: " + error?.sqlMessage || 'API error'
            console.log(result.content);
        })
    await connection.end()
    return result
}

export default getDeliverData