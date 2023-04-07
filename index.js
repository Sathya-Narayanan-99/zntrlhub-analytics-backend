import mongodb from "mongodb"
import dotenv from "dotenv"

import app from "./server.js"

import PagesDAO from "./dao/pagesDAO.js"

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
    app.listen(port, () => {
        console.log(`listining on port ${port}`)
    })
})