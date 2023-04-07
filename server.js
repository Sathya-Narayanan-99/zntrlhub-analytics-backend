import express from "express"
import cors from "cors"

import pages from "./api/pages/pages.route.js"
import buttons from "./api/buttons/buttons.route.js"

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/v1/pages", pages)
app.use("/api/v1/buttons", buttons)
app.use("*", (req, res) => res.status(404).json({detail: "Not found"}))

export default app