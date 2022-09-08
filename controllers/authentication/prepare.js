import * as dotenv from 'dotenv'
import mysqlConnection from '../../connection/mysql.js'
dotenv.config()

const getStudentStatusList = async (req, res) => {
    res.json('5555555555555555')
    // const thisSemester = process.env.THIS_SEMESTER
    // const thisYear = process.env.THIS_YEAR
    // const thisSemesterYear = thisSemester + thisYear
    // const connection = await mysqlConnection('online_grade_ip')
    // let studentList = []
    // let statusList = null

    // const studentListQuery = `SELECT DISTINCT(student_id) FROM tbl_student_grade`
    // await connection.query(studentListQuery).then(async ([rows]) => {
    //     studentList = rows
    //     const statusQuery = `
    //             SELECT DISTINCT(student_id),'reg' term_status FROM tbl_reg WHERE semester = :semester AND year = :year AND student_id IN (:studentList)
    //             UNION
    //             SELECT DISTINCT(student_id),'service' term_status FROM tbl_reg_service WHERE semester = :semester AND year = :year AND student_id IN (:studentList)
    //             UNION
    //             SELECT DISTINCT(student_id),CONCAT('zero_',paid) term_status FROM db_regist.tbl_reg_zero WHERE semester = :semester AND year = :year AND student_id IN (:studentList)
    //             UNION
    //             SELECT DISTINCT(student_id),'leave' term_status FROM tbl_leave_detail
    //                 WHERE :semesteryear IN ( sem_year_1, sem_year_2, sem_year_3, sem_year_4, sem_year_5, sem_year_6, sem_year_7, sem_year_8, sem_year_9, sem_year_10, sem_year_11, sem_year_12 )
    //                 AND student_id IN (:studentList)
    //             UNION
    //             SELECT DISTINCT(student_id),'reg_yearly' term_status FROM tbl_reg_yearly WHERE year = :year AND student_id IN (:studentList)`

    //     await connection.query(statusQuery, {
    //         studentList: studentList,
    //         semester: thisSemester,
    //         year: thisYear,
    //         semesteryear: thisSemesterYear,
    //     })
    //         .then(([rows]) => {
    //             statusList = rows
    //             res.status(200).json(statusList)
    //         })
    // })
    // await connection.end()

}

export default getStudentStatusList 