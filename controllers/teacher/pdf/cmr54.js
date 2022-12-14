import createPdfFile from "../../../pdfs/createPdfFile.js";
import getCourseData from "../../../models/teacher/getCourseData.js";
import getStudentData from "../../../models/teacher/getStudentData.js";
import * as dotenv from 'dotenv'
dotenv.config()


const cmr54 = async (req, res) => {
  const classId = req.params.classId
  const { instructorId } = res.locals.UserDecoded
  const { userCourseList } = res.locals
  const courseList = userCourseList.length > 0 ? userCourseList : ['']
  const thisSemester = process.env.THIS_SEMESTER
  const thisYear = process.env.THIS_YEAR
  const studentDataObject = await getStudentData(classId, instructorId, courseList)
  const courseDataObject = await getCourseData(classId, instructorId, courseList)
  if (!courseDataObject.status) {
    res.status(404).json(courseDataObject)
    return
  }

  const { courseno, course_title, seclec, seclab, ip_type, instructor_name, instructor_surname } = courseDataObject.content
  const studentData = studentDataObject.content
  const fileName = classId
  const fontFamily = "THSarabunNew"
  const htmlContent = `
<div>
<h6 style='text-align:center'>ส่งเกรดแก้ไขอักษรลำดับขั้น ${ip_type} ภาคการศึกษา ${thisSemester}/${thisYear}</h6>
<table width='100%' style='border:none; border-collapse:collapse; cellspacing:0; cellpadding:0'>
<tbody>
<tr>
<td style="border:none;width:20%">COURSE NO</td>
<td style="border:none;width: 80%">${courseno}</td>
</tr>
<tr>
<td style="border:none;width:20%">TITLE</td>
<td style="border:none;width: 80%">${course_title}</td>
</tr>
<tr>
<td style="border:none;width:20%">SECTION (lec / lab)</td>
<td style="border:none;width: 80%">${seclec}/${seclab}</td>
</tr>
<tr>
<td style="border:none;width:20%">LECTURER</td>
<td style="border:none;width: 80%">${instructor_name} ${instructor_surname}</td>
</tr>
<tr>
<td style="border:none;width:20%">DATE</td>
<td style="border:none;width: 80%">${new Date().toLocaleString('en-US')}</td>
</tr>
</tbody>
</table>

<table style='width:100%;text-align:center'>
<thead>
<tr>
<th>No.</th>
<th>Student ID</th>
<th>Name</th>
<th>Surname</th>
<th>Grade</th>
<th>Note</th>
</tr>
</thead>
<tbody>
${studentData.map((student, index) => {
    return `<tr>
  <td style='width: 5%'>${index + 1}</td>
  <td style='width: 15%'>${student.student_id}</td>
  <td style='width: 25%'>${student.name}</td>
  <td style='width: 25%'>${student.surname}</td>
  <td style='width: 10%'>${student.grade_new}</td>
  <td style='width: 20%'></td>
  </tr >`
  })}
</tbody>
</table>
</div>
`
  const otherOptions = {

  }
  createPdfFile(htmlContent, fontFamily, fileName, otherOptions)
    .then(response => {
      // console.log(response)
      res.type('application/pdf');
      res.download(response.path, thisSemester + thisYear + ' ' + fileName + '.pdf')
    })
    .catch(err => {
      console.log('PDF ERR')
      console.log(err)
      res.status(404).json(err.message)

    })

}

export default cmr54