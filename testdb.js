import mysqlConnection from "./connection/mysql.js";

const connection = await mysqlConnection('reg-micro')
connection.query("SELECT * FROM tbl_user WHERE cmuitaccount_name LIKE :cmuitaccount_name",
    { cmuitaccount_name: 'si%' }
).then(([rows]) => {
    rows[0]['role'] = 'admin'

    console.log(rows.length);
})
    .catch((err) => console.log(err.sqlMessage))
    .then(() => {
        connection.end()
    });