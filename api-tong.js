const express = require("express");
// const admin = require("firebase-admin");
require("dotenv").config();
const db = admin.firestore();
const router = express.Router();
const db_user = "ced2022_user";
const axios = require("axios").default;
const json2csv = require("json2csv").parse;
const baseurl =
    process.env.NODE_ENV === "production"
        ? "https://vote.cmuelectionday.com"
        : "http://localhost:8080";
const jwt = require("jwt-simple");

router.post("/linegetinfo", async (req, res, next) => {
    try {
        const user = await db.collection(db_user).where('line_userId', '==', req.body.lineinfo.userId).get();
        if (user.empty) {
            console.log('ไม่มี user');
            return res.send({
                user: user,
                formline: req.body.lineinfo,
                message: "ไม่มี user",
            });
        }
        user.forEach(doc => {
            console.log(doc.id, '=>', doc.data());
            const token = jwt.encode(
                doc.data(),
                "ced#inTheCmUna$start2020juThisNoW2021gCome15000huuuwTFVeryHbuTVerrySmall"
            );
            return res.send({
                user: doc.data(),
                token: token,
                right2vote: true,
            });
        });
    } catch (e) {
        return res.status(500).json(e);
    }
});

router.post("/savelineinfo", async (req, res, next) => {
    try {
        if (req.body.cmuinfo.cmuitaccount_name) {
            // เงื่อนไขการมีสิทธิ์เลือกตั้ง
            if (
                req.body.cmuinfo.cmuitaccount_name == "nattapong.tan" ||
                req.body.cmuinfo.cmuitaccount_name == "ekkarat.boonchieng" ||
                req.body.cmuinfo.cmuitaccount_name == "chatchai.b" ||
                (req.body.cmuinfo.itaccounttype_id == "StdAcc" &&
                    req.body.cmuinfo.student_id.substring(4, 5) == 1)
            ) {
                // มีสิทธิ์เลือกตั้ง
                const userRef = db
                    .collection(db_user)
                    .doc(
                        req.body.cmuinfo.organization_code +
                        "-" +
                        req.body.cmuinfo.cmuitaccount_name
                    );
                const user = await userRef.get();
                if (!user.exists) {
                    /////////////
                    //ยังไม่มี User
                    /////////////
                    console.log("Creat user!");
                    const student = req.body.cmuinfo;
                    student.regist_date = new Date();
                    student.line_displayName = req.body.lineinfo.displayName;
                    student.line_pictureUrl = req.body.lineinfo.pictureUrl;
                    student.line_userId = req.body.lineinfo.userId;
                    db.collection(db_user)
                        .doc(
                            student.organization_code +
                            "-" +
                            student.cmuitaccount_name
                        )
                        .set(student);
                    const token = jwt.encode(
                        req.body.cmuinfo,
                        "ced#inTheCmUna$start2020juThisNoW2021gCome15000huuuwTFVeryHbuTVerrySmall"
                    );
                    return res.send({
                        user: req.body.cmuinfo,
                        lineinfo: req.body.lineinfo,
                        token: token,
                        right2vote: true,
                    });
                } else {
                    /////////////
                    //มี User แล้ว
                    /////////////
                    console.log("มี User แล้ว");
                    const student = req.body.cmuinfo;

                    // ถ้ายังไม่มี info line เก็บไว้ใน firebase
                    if (!user.line_userId) {
                        // เพิ่ม info จาก line
                        student.line_displayName = req.body.lineinfo.displayName;
                        student.line_pictureUrl = req.body.lineinfo.pictureUrl;
                        student.line_userId = req.body.lineinfo.userId;
                        db.collection(db_user)
                            .doc(
                                student.organization_code +
                                "-" +
                                student.cmuitaccount_name
                            )
                            .update({
                                line_displayName: student.line_displayName,
                                line_pictureUrl: student.line_pictureUrl,
                                line_userId: student.line_userId
                            });
                    }

                    const token = jwt.encode(
                        req.body.cmuinfo,
                        "ced#inTheCmUna$start2020juThisNoW2021gCome15000huuuwTFVeryHbuTVerrySmall"
                    );
                    return res.send({
                        user: student,
                        token: token,
                        right2vote: true,
                    });
                }
            } else {
                // ไม่มีสิทธิ์เลือกตั้ง
                return res.send({
                    right2vote: false,
                    token: response.data.access_token,
                    user: req.body.cmuinfo,
                });
            }
        } else {
            return res.send({
                error: true,
                message: "กรุณา Login ใหม่!",
                relogin: true,
            });
        }
    } catch (e) {
        return res.status(500).json(e);
    }
});

router.post("/logincmu", async (req, res, next) => {
    const qcode = req.body.code;
    const qstate = req.body.state;
    const qline = req.body.line || false;
    try {
        if (qcode && qstate === "ced") {
            axios({
                method: "post",
                url: "https://oauth.cmu.ac.th/v1/GetToken.aspx",
                timeout: 4000, // 4 seconds timeout
                params: {
                    code: req.body.code,
                    redirect_uri: baseurl + (qline ? "/line-regist" : "") + "/callback",
                    client_id: "xwF7wGrXjCtn4gMCPfKBDJbbYRbhud4aFrdukf2z",
                    client_secret: "xh7K51Rbebr7XYWZvEjSFgDfJsTPctsGqkdwMCf6",
                    grant_type: "authorization_code",
                },
            })
                .then((response) => {
                    // ต่อเลย ไปเอา info มาก่อน
                    axios({
                        method: "get",
                        url:
                            "https://misapi.cmu.ac.th/cmuitaccount/v1/api/cmuitaccount/basicinfo",
                        timeout: 5000, // 5 seconds timeout
                        headers: { Authorization: Bearer ${ response.data.access_token } },
          })
    .then(async (res2) => {
        try {
            if (res2.data.cmuitaccount_name) {
                // เงื่อนไขการมีสิทธิ์เลือกตั้ง
                if (
                    res2.data.cmuitaccount_name == "nattapong.tan" ||
                    res2.data.cmuitaccount_name == "ekkarat.boonchieng" ||
                    res2.data.cmuitaccount_name == "chatchai.b" ||
                    (res2.data.itaccounttype_id == "StdAcc" &&
                        res2.data.student_id.substring(4, 5) == 1)
                ) {
                    // มีสิทธิ์เลือกตั้ง
                    const userRef = db
                        .collection(db_user)
                        .doc(
                            res2.data.organization_code +
                            "-" +
                            res2.data.cmuitaccount_name
                        );
                    const user = await userRef.get();
                    if (!user.exists) {
                        //ยังไม่มี User
                        console.log("Creat user!");
                        const student = res2.data;
                        student.regist_date = new Date();
                        db.collection(db_user)
                            .doc(
                                student.organization_code +
                                "-" +
                                student.cmuitaccount_name
                            )
                            .set(student);
                        const token = jwt.encode(
                            res2.data,
                            "ced#inTheCmUna$start2020juThisNoW2021gCome15000huuuwTFVeryHbuTVerrySmall"
                        );
                        return res.send({
                            user: res2.data,
                            token: token,
                            right2vote: true,
                        });
                    } else {
                        //มี User แล้ว
                        console.log("มี User แล้ว");
                        const token = jwt.encode(
                            res2.data,
                            "ced#inTheCmUna$start2020juThisNoW2021gCome15000huuuwTFVeryHbuTVerrySmall"
                        );
                        return res.send({
                            user: res2.data,
                            token: token,
                            right2vote: true,
                        });
                    }
                } else {
                    // ไม่มีสิทธิ์เลือกตั้ง
                    return res.send({
                        right2vote: false,
                        token: response.data.access_token,
                        user: res2.data,
                    });
                }
            } else {
                return res.send({
                    error: true,
                    message: "กรุณา Login ใหม่!",
                    relogin: true,
                });
            }
        } catch (e) {
            return res.status(500).json(e);
            // .json({ message: "Cannot get data from database." });
        }
    })
    .catch((error) => {
        console.error(error);
    });
        })
        .catch ((err) => {
    res.json(err.message + " code:" + qcode + " state:" + qstate);
});
    } else {
    res.json("invalid code/state (" + qcode + " " + qstate + ")");
}
  } catch (e) {
    console.log(e);
    return res.status(500).json(e);
}
});

router.get("/export2csv", async (req, res, next) => {
    const ordersRef = db.collection('ced2022_user');
    return ordersRef.get()
        .then((querySnapshot) => {
            const orders = [];
            querySnapshot.forEach(doc => {
                const order = doc.data();
                if (order.regist_date)
                    order.regist_date = order.regist_date.toDate().toLocaleString("en-US", { timeZone: "Asia/Bangkok" });
                if (order.advance_election_date)
                    order.advance_election_date = order.advance_election_date.toDate().toLocaleString("en-US", { timeZone: "Asia/Bangkok" });
                orders.push(order);
            });
            const csv = json2csv(orders);
            res.setHeader(
                "Content-disposition",
                "attachment; filename=report.csv"
            );
            res.set("Content-Type", "text/csv");
            res.status(200).send(csv)
        }).catch((err) => {
            console.log(err);
        });
});

module.exports = router;