import { mysqlConnection } from "../connection/mysql.js"

const putLogFill = async (classId, fillAmount, fillMethod, fillItaccountname) => {
    const isValidFillAmount = fillAmount == parseInt(fillAmount)
    const isValidFillMethod = fillMethod == parseInt(fillMethod) && (fillMethod == 1 || fillMethod == 2)
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
        console.log("putLogFill ERROR: PARAM", fillAmount);
        return 0
    }
}


const putLogDeptUserSubmit = async (classId, submissionId, action, deptUserItaccountname) => {
    const isValidAction = action == 's' || action == 'c'
    const isValidSubmissionId = submissionId.length == 64

    if (isValidAction && isValidSubmissionId) {
        const logData = {
            classId,
            submissionId,
            action,
            deptUserItaccountname
        }

        const connection = await mysqlConnection('online_grade_ip')
        await connection.query(
            `INSERT INTO tbl_log_deptuser_submit VALUES(NULL,:classId,:submissionId,:action,:deptUserItaccountname,NOW())`,
            logData
        )
            .then(([rows]) => {
                return rows.affectedRows
            })
            .catch((error) => {
                console.log("putLogDeptUserSubmit ERROR: " + error?.sqlMessage);
                return 0
            })
        await connection.end()
    }
    else {
        console.log("putLogDeptUserSubmit ERROR: PARAM");
        return 0
    }
}

const putLogFacUserSubmit = async (classId, submissionId, action, facUserItaccountname) => {
    const isValidAction = action == 's' || action == 'c'
    const isValidSubmissionId = submissionId.length == 64

    if (isValidAction && isValidSubmissionId) {
        const logData = {
            classId,
            submissionId,
            action,
            facUserItaccountname
        }

        const connection = await mysqlConnection('online_grade_ip')
        await connection.query(
            `INSERT INTO tbl_log_facuser_submit VALUES(NULL,:classId,:submissionId,:action,:facUserItaccountname,NOW())`,
            logData
        )
            .then(([rows]) => {
                return rows.affectedRows
            })
            .catch((error) => {
                console.log("putLogFacUserSubmit ERROR: " + error?.sqlMessage);
                return 0
            })
        await connection.end()
    }
    else {
        console.log("putLogFacUserSubmit ERROR: PARAM");
        return 0
    }
}

const putLogDeliver = async (deliverId, facultyId, classAmount, status, itaccountName, classDeliverListText = '', gradeType = '') => {
    const isValidStatus = status == 0 || status == 1
    const isValidDeliverId = deliverId.length == 32
    const isValidclassAmount = classAmount > 0

    if (isValidStatus && isValidDeliverId && isValidclassAmount) {
        const logData = {
            deliverId,
            facultyId,
            classAmount,
            gradeType,
            status,
            itaccountName,
            classDeliverListText
        }

        const connection = await mysqlConnection('online_grade_ip')
        await connection.query(
            `
                INSERT INTO tbl_log_deliver VALUES(:deliverId,:facultyId,:classAmount,:gradeType,:status,:itaccountName,NOW(),NULL,NULL,:classDeliverListText)
                ON DUPLICATE KEY UPDATE status = :status , facuser_cancel_itaccountname = IF(:status = 0,:itaccountName,NULL), facuser_cancel_datetime = IF(:status = 0,NOW(),NULL)
            `,
            logData
        )
            .then(([rows]) => {
                return rows.affectedRows
            })
            .catch((error) => {
                console.log("putLogDeliver ERROR: " + error?.sqlMessage);
                return 0
            })
        await connection.end()
    }
    else {
        console.log("putLogDeliver ERROR: PARAM");
        return 0
    }
}


const putLogRegSubmit = async (deliverId, action, regItaccountname) => {
    const isValidAction = action == 's' || action == 'c'
    const isValidDeliverId = deliverId.length == 32

    if (isValidAction && isValidDeliverId) {
        const logData = {
            deliverId,
            action,
            regItaccountname
        }

        const connection = await mysqlConnection('online_grade_ip')
        await connection.query(
            `INSERT INTO tbl_log_reg_submit VALUES(NULL,:deliverId,:action,:regItaccountname,NOW())`,
            logData
        )
            .then(([rows]) => {
                return rows.affectedRows
            })
            .catch((error) => {
                console.log("putLogRegSubmit ERROR: " + error?.sqlMessage);
                return 0
            })
        await connection.end()
    }
    else {
        console.log("putLogRegSubmit ERROR: PARAM");
        return 0
    }
}

export { putLogFill, putLogDeptUserSubmit, putLogFacUserSubmit, putLogDeliver, putLogRegSubmit }