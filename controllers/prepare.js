import * as dotenv from 'dotenv'
import axios from 'axios'
import mysqlConnection from '../connection/mysql.js'
dotenv.config()


const createMainListTable = async (req, res) => {
    const token = req.headers.authorization
    const app_grade = 'I'
    const connection = await mysqlConnection('db_center')
    await connection.query("SELECT * FROM tbl_reg_ipt WHERE grade_old = :app_grade",
        { app_grade: app_grade }
    ).then(([rows]) => {
        console.table(token);

        res.status(200).json(rows)
    })
        .catch((err) => {
            console.table(err);
            // result.errorCode = 'R2'
            // result.httpStatusCode = 500
            // result.message = err.sqlMessage
        }).then(() => {
            connection.end()
        });
    // const semester = req.query.semester ?? false
    // const year = req.query.year ?? false
    // console.log(semester + year + '5555')

    // res.status(500).json(semester + year + '5555')
}



export { createMainListTable }