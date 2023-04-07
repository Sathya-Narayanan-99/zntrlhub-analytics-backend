import express from "express"

import ButtonsController from "./buttons.controller.js"

const router = express.Router()

router.route("/").get(ButtonsController.apiGetButtons)

export default router