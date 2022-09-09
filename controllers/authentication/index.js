import * as dotenv from 'dotenv'
import axios from 'axios'
// import mysqlConnection from '../connection/mysql.js'
import jwt from 'jsonwebtoken'
dotenv.config()


async function getRole(cmuitaccount_name) {
    const roleLevel = {
        instruc: 1,
        department: 2,
        faculty: 3,
        instrucdepartment: 2,
        instrucfaculty: 3,
        admin: 9
    }

    let result = {}
    await axios.get('https://www1.reg.cmu.ac.th/registrationoffice/api/check_user_dept_fac_course.php',
        {
            params: {
                itaccount: cmuitaccount_name,
                token: '2bd98a77c2be2835231b8c832901e240'
            }
        }).then(async (response) => {
            const data = await response.data
            if (response?.data ?? false) {
                result.status = 200
                result.role = roleLevel[data.typeuser]
                result.instructorId = data?.instructor_id ?? null
                result.courselist = data?.courseno ?? []
            }
            else {
                result.status = 401
                result.message = 'Not Found this user in registrationoffice'
            }
        })
        .catch((err) => {
            result.status = 500
            result.message = err.message
        })

    return result
}

const login = (req, res) => {
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
            const roleObject = await getRole(cmuitaccount_name)

            if (roleObject.status === 200) {
                try {
                    basicInfo.role = roleObject.role
                    // for dev
                    basicInfo.role = basicInfo.cmuitaccount_name == 'sitthiphon.s' ? 9 : basicInfo.role
                    // end dev
                    basicInfo.instructorId = roleObject.instructorId
                    basicInfo.courseList = roleObject.courselist
                    const userToken = jwt.sign(
                        {
                            cmuitaccount_name: basicInfo.cmuitaccount_name,
                            role: basicInfo.role,
                            instructorId: basicInfo.instructorId,
                            courseList: basicInfo.courseList
                        },
                        process.env.JWT_SECRET
                    )
                    basicInfo.userToken = userToken

                    // console.log(basicInfo);
                    res.json(basicInfo)
                }
                catch (err) {
                    console.error(err.message);
                    res.status(500).json(err.message)
                }
            } else {
                const response = {
                    'code': roleObject.status,
                    'message': roleObject.message,
                }
                console.error(response.code + ' ' + response.message);
                res.status(response.code).json(response)
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

const verifyMiddleware = (req, res, next) => {
    const AppAuthorization = req.headers.authorization ?? false
    const AppToken = AppAuthorization ? AppAuthorization.split(" ")[1] : 'failed'
    try {
        const UserDecoded = jwt.verify(AppToken, process.env.JWT_SECRET)
        res.locals.UserDecoded = {
            isAuthorized: true,
            ...UserDecoded
        }
        next()
    }
    catch (err) {
        err.isAuthorized = false
        res.status(401).json(JSON.stringify(err))
        console.log('verifyMiddleware', JSON.stringify(err))
    }
}

const checkUserToken = (req, res) => {
    try {
        const AppAuthorization = req.headers.authorization ?? false
        const AppToken = AppAuthorization ? AppAuthorization.split(" ")[1] : 'failed'
        const UserDecoded = jwt.verify(AppToken, process.env.JWT_SECRET)
        // console.log(UserDecoded.cmuitaccount_name);
        res.status(200).json({
            isAuthorized: true,
            cmuitaccount_name: UserDecoded.cmuitaccount_name,
            role: UserDecoded.role
        })
    }
    catch (err) {
        res.status(401).json({
            isAuthorized: false,
            message: err.message
        })
    }
    return
}

export { login, checkUserToken, verifyMiddleware }