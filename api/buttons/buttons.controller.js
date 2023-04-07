import ButtonsDAO from "../../dao/buttonsDAO.js";

export default class ButtonsController {
    static async apiGetButtons(req, res, next) {

        let results  = await ButtonsDAO.getButtons()
        results = results.map((str) => str.replace(/\n|\t/g, ''))

        let response = {
            results: results,
        }
        res.json(response)
    }
}