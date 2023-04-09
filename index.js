import mongodb from "mongodb"
import dotenv from "dotenv"
import serverless from "serverless-http"

import app from "./server.js"

import PagesDAO from "./dao/pagesDAO.js"
import ButtonsDAO from "./dao/buttonsDAO.js"
import AnalyticsDAO from "./dao/analyticsDAO.js"

dotenv.config()

const MongoClient = mongodb.MongoClient

const port = process.env.PORT || 8000

MongoClient.connect(
    process.env.MONGODB_URI,
    {
        maxPoolSize: 50,
        wtimeoutMS: 2500,
        useNewUrlParser: true
    }
).catch( err => {
    console.error(err.stack)
    process.exit(1)
}).then( async client => {
    await PagesDAO.injectDB(client)
    await ButtonsDAO.injectDB(client)
    await AnalyticsDAO.injectDB(client)
    if (process.env.STAGE == 'PROD'){
        exports.handler = serverless(app)
    } else {
        app.listen(port, () => {
            console.log(`listining on port ${port}`)
        })
    }
})