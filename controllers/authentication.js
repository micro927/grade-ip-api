import * as dotenv from 'dotenv'
import axios from 'axios'
import mysqlConnection from '../connection/mysql.js'
dotenv.config()


async function getRole(cmuitaccount_name) {
    let result = {
        status: 'error',
        errorCode: null,
        httpStatusCode: 200,
        message: '',
        role: null,
        userRegId: null,
    }
    const connection = await mysqlConnection('reg-micro')
    await connection.query("SELECT * FROM tbl_user WHERE cmuitaccount_name = :cmuitaccount_name",
        { cmuitaccount_name: cmuitaccount_name }
    ).then(([rows]) => {
        if (rows.length > 0) {
            result.status = 'ok'
            result.role = 'admin'
            result.userRegId = 'reg'
        }
        else {
            /// เช็คว่าเป็น ภาค/อ/คณะ ตาม ลำดับ โดยซ้อน if ไปเรื่อยๆ รวม 4 ชั้น
            const getSomeRole = true  // for dev
            if (getSomeRole === true) { // for dev
                result.status = 'ok'
                result.role = 'advisor'
                result.userRegId = 'LF05'
            }
            else {
                result.errorCode = 'R1'
                result.httpStatusCode = 401
                result.message = 'Unauthorized'
            }// end find roles
        }
    })
        .catch((err) => {
            result.errorCode = 'R2'
            result.httpStatusCode = 500
            result.message = err.sqlMessage
        }).then(() => {
            connection.end()
        });

    return result
}

const login = (req, res) => {
    console.log("USER LOGIN")
    var oauthCode = req.query.code
    axios({
        method: "post",
        url: "https://oauth.cmu.ac.th/v1/GetToken.aspx",
        timeout: 4000, // 4 seconds timeout
        params: {
            code: oauthCode,
            redirect_uri: process.env.APP_REDIRECT,
            client_id: process.env.OAUTH_CLIENT_ID,
            client_secret: process.env.OAUTH_CLIENT_SECRET,
            grant_type: "authorization_code",
        },
    }).then((response) => {
        const token = response.data.access_token
        axios({
            method: "get",
            url:
                "https://misapi.cmu.ac.th/cmuitaccount/v1/api/cmuitaccount/basicinfo",
            timeout: 5000, // 5 seconds timeout
            headers: {
                'Authorization': 'Bearer ' + token
            },
        }).then(async (response) => {
            const basicInfo = response.data
            const cmuitaccount_name = basicInfo.cmuitaccount_name
            // console.log(cmuitaccount_name);
            const roleObject = await getRole(cmuitaccount_name)
            // console.log(roleObject);

            if (roleObject.status === 'ok') {
                basicInfo.role = roleObject.role
                basicInfo.userRegId = roleObject.userRegId
                console.log(basicInfo);
                res.json(basicInfo)
            } else {
                const response = {
                    'code': roleObject.errorCode,
                    'message': roleObject.message,
                    'httpStatusCode': roleObject.httpStatusCode
                }
                console.error(response.code + ' ' + response.message);
                res.status(response.httpStatusCode).json(response)
            }

        }).catch((error) => {
            const response = {
                'code': 'L2',
                'message': error.code
            }
            console.error(response.code + ' ' + response.message);
            res.status(500).json(response)
        })
    })
        .catch((error) => {
            const response = {
                'code': 'L1',
                'message': error.code
            }
            console.error(response.code + ' ' + response.message);
            res.status(500).json(response)
        });
}

const verify = (req, res) => res.json('bbb')

export { login, verify }