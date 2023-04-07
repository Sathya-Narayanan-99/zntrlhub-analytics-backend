import express from "express"

import PagesController from "./pages.controller.js"

const router = express.Router()

router.route("/").get(PagesController.apiGetPages)

export default router