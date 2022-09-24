import { mysqlConnection } from "../connection/mysql.js"

const putLogFill = async (classId, fillAmount, fillMethod, fillItaccountname) => {
    const isValidFillAmount = fillAmount.isInteger()
    const isValidFillMethod = fillMethod == 'fill' || fillMethod == 'excel'
    if (isValidFillAmount && isValidFillMethod) {

        const logData = {
            classId,
            fillAmount,
            fillMethod,
            fillItaccountname
        }
        const connection = await mysqlConnection('online_grade_ip')
        await connection.query(
            `INSERT INTO tbl_log_fill VALUES(NULL,:classId,:fillAmount,:fillMethod,:fillItaccountname,NOW())`,
            logData
        )
            .then(([rows]) => {
                return rows.affectedRows
            })
            .catch((error) => {
                console.log("putLogFill ERROR: " + error?.sqlMessage);
                return 0
            })
        await connection.end()
    }
    else {
        console.log("putLogFill ERROR: PARAM");
        return 0
    }
}


const putLogDeptUserSubmit = async (submissionId, action, deptUserItaccountname) => {
    const isValidAction = action == 'submit' || action == 'cancel'
    // const isValidFillAmount = fillAmount.isInteger()
    // if (isValidAction && isValidFillMethod) {
    //     const logData = {
    //         submissionId,
    //         action,
    //         deptUserItaccountname
    //     }

    //     const connection = await mysqlConnection('online_grade_ip')
    //     await connection.query(
    //         `INSERT INTO tbl_log_fill VALUES(NULL,:classId,:fillAmount,:fillMethod,:fillItaccountname,NOW())`,
    //         logData
    //     )
    //         .then(([rows]) => {
    //             return rows.affectedRows
    //         })
    //         .catch((error) => {
    //             console.log("putLogFill ERROR: " + error?.sqlMessage);
    //             return 0
    //         })
    //     await connection.end()
    // }
    // else {
    //     console.log("putLogFill ERROR: PARAM");
    //     return 0
    // }
}

const putLogFacUserSubmit = () => { }
const putLogDeliver = () => { }
const putLogRegSubmit = () => { }

export { putLogFill, putLogDeptUserSubmit, putLogFacUserSubmit, putLogDeliver, putLogRegSubmit }