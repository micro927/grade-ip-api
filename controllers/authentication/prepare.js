import * as dotenv from 'dotenv'
import mysqlConnection from '../../connection/mysql.js'
dotenv.config()

async function getStudentStatusList(studentIdRows) {
    const thisSemester = process.env.THIS_SEMESTER
    const thisYear = process.env.THIS_YEAR
    const thisSemesterYear = thisSemester + thisYear
    const connection = await mysqlConnection('db_center')
    let studentStatusList = null

    const mainQuery = `
                SELECT DISTINCT(student_id),'reg' term_status FROM tbl_reg WHERE semester = :semester AND year = :year AND student_id IN (:studentIdRows)
                UNION
                SELECT DISTINCT(student_id),'service' term_status FROM tbl_reg_service WHERE semester = :semester AND year = :year AND student_id IN (:studentIdRows)
                UNION
                SELECT DISTINCT(student_id),CONCAT('zero_',paid) term_status FROM db_regist.tbl_reg_zero WHERE semester = :semester AND year = :year AND student_id IN (:studentIdRows)
                UNION
                SELECT DISTINCT(student_id),'leave' term_status FROM tbl_leave_detail
                    WHERE :semesteryear IN ( sem_year_1, sem_year_2, sem_year_3, sem_year_4, sem_year_5, sem_year_6, sem_year_7, sem_year_8, sem_year_9, sem_year_10, sem_year_11, sem_year_12 )
                    AND student_id IN (:studentIdRows)
                UNION
                SELECT DISTINCT(student_id),'reg_yearly' term_status FROM tbl_reg_yearly WHERE year = :year AND student_id IN (:studentIdRows)`

    await connection.query(mainQuery, {
        studentIdRows: studentIdRows,
        semester: thisSemester,
        year: thisYear,
        semesteryear: thisSemesterYear,
    })
        .then(([rows]) => {
            studentStatusList = rows
        })

    return studentStatusList
}

const createMainListTable = async (req, res) => {
    // Migrate to Admin/Backoffice auth middleWare
    // const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
    // console.log('Get request from : ' + ip)
    const app_grade = 'I'
    const connection = await mysqlConnection('db_center')

    await connection.query("SELECT * FROM tbl_reg_ipt WHERE grade_old = :app_grade ORDER BY student_id",
        { app_grade: app_grade }
    ).then(async ([rows]) => {
        // get Distinct StudentId
        const studentIdArray = Object.values(rows).map((val) => val.student_id)
        const studentIdSet = [...new Set(studentIdArray)]

        // get Status of all student
        const studentStatusList = await getStudentStatusList(studentIdSet)

        // Map rows from database with student status
        const rowsWithStatus = rows.map((row) => {
            const student_id = row.student_id
            const studentStatus = studentStatusList.find((studentWithStatus) => {
                return studentWithStatus.student_id === student_id
            })
            row.status = studentStatus?.term_status ?? null
            return row
        })
        return rowsWithStatus
    }).then((rowsWithStatus) => {
        console.log(':Create Main Table Complete');
        connection.end()
        res.status(200).json(rowsWithStatus)
    })
        .catch((err) => {
            console.log(err);
        })
    // const semester = req.query.semester ?? false
    // const year = req.query.year ?? false
    // console.log(semester + year + '5555')

    // res.status(500).json(semester + year + '5555')
}



export { createMainListTable }