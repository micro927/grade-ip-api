import * as dotenv from 'dotenv'
import createPdfFile from "../../../pdfs/createPdfFile.js";
import getDeliverData from "../../../models/faculty/getDeliverData.js";
import getDeliverSummary from "../../../models/faculty/getDeliverSummary.js";
import createBarcodeSvg from '../../../utils/createBarcodeSvg.js';

dotenv.config()


const cmr541 = async (req, res) => {
  const deliverId = req.params.deliverId
  const { organization_code, role } = res.locals.UserDecoded
  const facultyId = organization_code
  const thisSemester = process.env.THIS_SEMESTER
  const thisYear = process.env.THIS_YEAR
  const deliverDataObject = await getDeliverData(deliverId, facultyId)
  const deliverSummaryObject = await getDeliverSummary(deliverId, facultyId)
  if (!deliverDataObject.status || !deliverSummaryObject.status || role < 3) {
    res.status(404).json(deliverDataObject)
    return
  }

  const { faculty_id, class_amount, ip_type, count_all, null_submission_id } = deliverSummaryObject.content
  const deliverData = deliverDataObject.content
  const fileName = `รายงานสรุปการส่งเกรดแก้ไขอักษรลำดับขึั้น ${ip_type}_${thisSemester}${thisYear}_${deliverId}`
  const fontFamily = "THSarabunNew"
  const deliverBarcode = createBarcodeSvg(deliverId, {
    height: 25,
    width: 1,
    displayValue: true,
    fontSize: 14
  })
  const htmlContent = ` <div>
  <h5 style='text-align:center'>รายงานสรุปการส่งเกรดแก้ไขอักษรลำดับขึั้น ${ip_type} ภาคการศึกษา ${thisSemester}/${thisYear}</h5>
  <table width='100%' style='text-align:center;margin: 0;padding: 0'>
  <tr>
  <td style='width: 10%;border:none;'>
  </td>
  <td style='width: 80%;border:none;'>
  ${deliverBarcode}
  </td>
  <td style='width: 10%;border:none;'>
  </td>
  </tr>
  </table>

  <table width='100%' style='border:none; border-collapse:collapse; cellspacing:0; cellpadding:0'>
  <tbody>
  <tr>
  <td style="border:none;width:20%">คณะ</td>
  <td style="border:none;width: 80%">${faculty_id}</td>
  </tr>
  </tbody>
  </table>
 
<table style='width:100%;text-align:center'>
  <thead>
  <tr>
  <th>No.</th>
  <th>รหัสกระบวนวิชา</th>
  <th>ชื่อกระบวนวิชา</th>
  <th>seclec</th>
  <th>seclab</th>
  <th>ภาคที่ได้รับ ${ip_type}</th>
  </tr>
  </thead>
  <tbody>
  ${deliverData.map((course, index) => {
    return `<tr>
    <td style='width: 5%'>${index + 1}</td>
    <td style='width: 15%'>${course.courseno}</td>
    <td style='width: 25%'>${course.course_title}</td>
    <td style='width: 15%'>${course.seclec}</td>
    <td style='width: 15%'>${course.seclab}</td>
    <td style='width: 25%'>${course.semester}/${course.year}</td>
    </tr>`
  })}
  </tbody>
  </table>
  </div>`
  const otherOptions = {

  }
  createPdfFile(htmlContent, fontFamily, fileName, otherOptions)
    .then(response => {
      // console.log(response)
      res.type('application/pdf');
      res.download(response.path, fileName + '.pdf')
    })
    .catch(err => {
      console.log('PDF ERR')
      // console.log(err)
      res.status(404).json(err.message)

    })

}

export default cmr541