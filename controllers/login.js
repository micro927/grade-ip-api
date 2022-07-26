import * as dotenv from 'dotenv'
dotenv.config()

const qcode = req.body.code;
// const qstate = req.body.state;
// const qline = req.body.line || false;

axios({
    method: "post",
    url: "https://oauth.cmu.ac.th/v1/GetToken.aspx",
    timeout: 4000, // 4 seconds timeout
    params: {
        code: req.body.code,
        redirect_uri: process.env.APP_REDIRECT,
        client_id: process.env.OAUTH_CLIENT_ID,
        client_secret: process.env.OAUTH_CLIENT_SECRET,
        grant_type: "authorization_code",
    },
}).then((response) => {
    axios({
        method: "get",
        url:
            "https://misapi.cmu.ac.th/cmuitaccount/v1/api/cmuitaccount/basicinfo",
        timeout: 5000, // 5 seconds timeout
        headers: {
            'Authorization': 'Bearer' + response.data.access_token
        },
    }).then((response) => {
        return (response.data)
    })
})
    .catch((error) => {
        console.error(error);
    });