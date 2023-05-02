import SheetsDAO from "../../dao/sheetsDAO.js";

export default class SheetsController {
    static async apiGetSheets(req, res, next) {

        const page = req.query.page ? parseInt(req.query.page, 10) : 0
        const resultsPerPage = req.query.resultsPerPage ? parseInt(req.query.resultsPerPage, 10) : 20

        const { results, count }  = await SheetsDAO.getSheets({
            page,
            resultsPerPage
        })

        let response = {
            count: count,
            page: page,
            results: results,
        }
        res.json(response)
    }
}