import express from "express"

import SheetsController from "./sheets.controller.js"

const router = express.Router()

router.route("/").get(SheetsController.apiGetSheets)

export default router