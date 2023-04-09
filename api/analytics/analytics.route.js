import express from "express"

import AnalyticsController from "./analytics.controller.js"

const router = express.Router()

router.route("/").post(AnalyticsController.apiGetAnalytics)

export default router
