import AnalyticsDAO from "../../dao/analyticsDAO.js";
import { validate_filters } from "../utils.js"

export default class AnalyticsController {
    static async apiGetAnalytics(req, res, next) {

        var filters = req.body ? req.body : []
        const page = req.query.page ? parseInt(req.query.page, 10) : 0
        const resultsPerPage = req.query.resultsPerPage ? parseInt(req.query.resultsPerPage, 10) : 20
        const date_gte = req.query.date_gte ? new Date(req.query.date_gte) : null
        const date_lte = req.query.date_lte ? new Date(req.query.date_lte) : null

        const { validated_filters, isValid, error } = validate_filters(filters)
        if (!isValid){
            res.status(400).send(error)
        } else {
            const { results, count }  = await AnalyticsDAO.getAnalytics({
                filters,
                page,
                resultsPerPage,
                date_gte,
                date_lte
            })
    
            let response = {
                count: count,
                page: page,
                results: results,
            }
            res.json(response)
        }
    }
}