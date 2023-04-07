import PagesDAO from "../../dao/pagesDAO.js";

export default class PagesController {
    static async apiGetPages(req, res, next) {

        const results  = await PagesDAO.getPages()

        let response = {
            results: results,
        }
        res.json(response)
    }
}