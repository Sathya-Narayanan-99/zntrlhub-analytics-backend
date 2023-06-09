import express from "express"
import cors from "cors"

import pages from "./api/pages/pages.route.js"
import buttons from "./api/buttons/buttons.route.js"
import analytics from "./api/analytics/analytics.route.js"
import sheets from "./api/sheets/sheets.route.js"

const app = express()

app.use(cors())
app.use(express.json())

app.use("/api/v1/pages", pages)
app.use("/api/v1/buttons", buttons)
app.use("/api/v1/analytics", analytics)
app.use("/api/v1/sheets", sheets)
app.use("*", (req, res) => res.status(404).json({detail: "Not found"}))

export default app