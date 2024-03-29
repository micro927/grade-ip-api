import * as dotenv from 'dotenv'
import { mysql2, mysqlConnection } from '../../connection/mysql.js'
import { createHash } from 'crypto'
import { putLogDeliver } from '../../models/putLog.js'
dotenv.config()

const deliverCreate = async (req, res) => {
    const { gradeType } = req.query
    const classIdList = req.body?.classIdList || []
    const facultyId = req.body?.facultyId || 0
    const { cmuitaccount_name, role } = res.locals.UserDecoded
    const { userCourseList } = res.locals
    const courseList = userCourseList.length > 0 ? userCourseList : ['']
    const isClassIdListVerify = classIdList.length > 0 && (classIdList.filter(classId => classId.length == 19).length == classIdList.length)

    console.log(gradeType);
    // console.log(facultyId);
    // res.json({
    //     classIdList,
    //     facultyId
    // })
    if (isClassIdListVerify && role >= 3) {
        const datetime = new Date()
        const countClassIdList = classIdList.length
        const deliverIdNew = createHash('md5')
            .update(`deliver ${countClassIdList} ${cmuitaccount_name} ${datetime}`)
            .digest('hex');
        let queries = ''
        classIdList.map((classId) => {
            queries += mysql2.format(`UPDATE tbl_class
                                SET
                                    deliver_id = ?,
                                    facuser_deliver_itaccountname = ?,
                                    facuser_deliver_datetime = ?
                                WHERE class_id = ? 
                                AND courseno IN (?)
                                AND (course_faculty_id = ? OR ? = 52)
                                AND facuser_submit_itaccountname IS NOT NULL
                                AND deliver_id IS NULL
                                AND reg_submit_itaccountname IS NULL
                                AND last_date > NOW();`,
                [
                    deliverIdNew,
                    cmuitaccount_name,
                    datetime,
                    classId,
                    courseList,
                    facultyId,
                    facultyId
                ])
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
                    const classDeliverListText = classIdList.join()
                    console.log(facultyId)
                    await putLogDeliver(deliverIdNew, facultyId, affectedRows, 1, cmuitaccount_name, classDeliverListText, gradeType)
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
            res.status(403).json({ status: 'no classlist' })
        }
    }
    else {
        res.status(400).json({ status: 'not valid' })
    }
}

export default deliverCreate