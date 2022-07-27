import Sequelize from 'sequelize';
import * as dotenv from 'dotenv'
dotenv.config()

function sequelizeConnection(dbName = process.env.DB_NAME) {
    const sequelizeConnection = new Sequelize(
        dbName,
        process.env.DB_USERNAME,
        process.env.DB_PASSWORD, {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        dialectOptions: {
            connectTimeout: 3000
        }
    }, {
        pool: {
            max: 50,
            min: 0,
            idle: 100
        }
    });

    return sequelizeConnection
}

export default sequelizeConnection