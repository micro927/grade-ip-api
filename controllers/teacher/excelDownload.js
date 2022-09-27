import writeXlsxFile from "write-excel-file/node"
import * as dotenv from 'dotenv'
import getStudentData from '../../models/teacher/getStudentData.js'
import getCourseData from '../../models/teacher/getCourseData.js'

dotenv.config()

const excelDownload = async (req, res) => {
    const classId = req.params.classId
    const { instructorId, courseList } = res.locals.UserDecoded
    const studentDataObject = await getStudentData(classId, instructorId, courseList)
    const courseDataObject = await getCourseData(classId, instructorId, courseList)

    if (studentDataObject.status && courseDataObject.status) {
        const studentData = studentDataObject.content
        const courseData = courseDataObject.content

        // Title
        const pageHeader = `ส่งเกรดแก้ไขอักษรลำดับขั้น ${classId.substr(-1)} ภาคการศึกษา ${process.env.THIS_SEMESTER}/${process.env.THIS_YEAR}`
        const pageCourseInfo = [
            { title: 'COURSE NO', value: courseData.courseno },
            { title: 'TITLE', value: courseData.course_title },
            { title: 'SECTION(lec / lab)', value: `${courseData.seclec}/${courseData.seclab}` },
            { title: 'LECTURER', value: `${courseData.instructor_name} ${courseData.instructor_middle_name} ${courseData.instructor_surname}` },
            { title: 'DATE', value: new Date().toLocaleString('en-US', { dateStyle: 'full', }) }
        ]
        const tableHeader = ['No.', 'Student ID', 'Name', 'Surname', 'Grade', 'Note']

        // Data
        const data = await studentData.map((row, index) => {
            return (
                [
                    index + 1,
                    row.student_id,
                    row.name,
                    row.surname,
                    row.grade_new,
                    '',
                ]
            )
        })

        // Tramsfrom to Excel object
        const excelPageHeader = [{
            value: pageHeader,
            type: String,
            align: 'center',
            alignVertical: 'center',
            fontWeight: 'bold',
            span: 6,
            height: '30',
        }]

        const excelPageCourseInfo = pageCourseInfo.map(info => {
            return [
                {
                    value: info.title,
                    align: 'left',
                    fontWeight: 'bold',
                    span: '2',

                }, null,
                {
                    value: info.value,
                    align: 'left',
                    span: '4',
                }
            ]
        })

        const excelTableHeader = tableHeader.map(title => {
            return {
                value: title,
                borderColor: "#000000",
                align: 'center',
                fontWeight: 'bold',
                backgroundColor: "#dddddd",
            }
        })
        const excelData = data.map(row => {
            return row.map(value => {
                return {
                    value: value,
                    borderColor: "#000000",
                }
            })
        })

        // combine all row
        const excelWorkbook = [
            excelPageHeader,
            ...excelPageCourseInfo,
            excelTableHeader,
            ...excelData
        ]

        // option
        const columns = [
            { width: 5 },
            { width: 15 },
            { width: 20 },
            { width: 20 },
            { width: 10 },
            { width: 10 },
        ]

        const exceloptions = {
            columns,
            fontSize: 12,
            wrap: true,
            buffer: true
        }

        const excelFile = await writeXlsxFile(excelWorkbook, exceloptions)
        res.status(200).send(excelFile)
    }
    else {
        res.status(500).json('error')
    }







    // // console.log(studentData);

    // const HEADER_ROW = [
    //     {
    //         value: 'Name',
    //         fontWeight: 'bold'
    //     },
    //     {
    //         value: 'Date of Birth',
    //         fontWeight: 'bold'
    //     },
    //     {
    //         value: 'Cost',
    //         fontWeight: 'bold'
    //     },
    //     {
    //         value: 'Paid',
    //         fontWeight: 'bold'
    //     }
    // ]

    // const DATA_ROW_1 = [
    //     // "Name"
    //     {
    //         type: String,
    //         value: 'John Smith'
    //     },

    //     // "Date of Birth"
    //     {
    //         type: Date,
    //         value: new Date(),
    //         format: 'mm/dd/yyyy'
    //     },

    //     // "Cost"
    //     {
    //         type: Number,
    //         value: 1800
    //     },

    //     // "Paid"
    //     {
    //         type: Boolean,
    //         value: true
    //     }
    // ]



    // const result = await writeXlsxFile(data, {
    //     buffer: true
    // })

    // res.status(200).send(result)
}


export default excelDownload