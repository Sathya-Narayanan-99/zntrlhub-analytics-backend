import AnalyticsDAO from "../../dao/analyticsDAO.js";
import { validate_filters } from "../utils.js"
import { createObjectCsvWriter } from 'csv-writer';
import path from 'path';
import fs from 'fs';

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
    static async apiGetAnalyticsExport(req, res, next) {

        var filters = req.body ? req.body : []
        const date_gte = req.query.date_gte ? new Date(req.query.date_gte) : null
        const date_lte = req.query.date_lte ? new Date(req.query.date_lte) : null

        const { validated_filters, isValid, error } = validate_filters(filters)
        if (!isValid){
            res.status(400).send(error)
        } else {
            const { results, count }  = await AnalyticsDAO.getAnalytics({
                filters: filters,
                date_gte: date_gte,
                date_lte: date_lte,
                use_pagination: false
            })

            const sanitized_results = results.map((item) => ({
                ...item,
                button_clicked: item.button_clicked && item.button_clicked.button_name ? item.button_clicked.button_name.replace(/\n|\t/g, '') : '',
              }));

            const csvWriter = createObjectCsvWriter({
                path: 'output.csv',
                header: [
                    { id: 'browser_name', title: 'Browser Name' },
                    { id: 'button_clicked', title: 'Button Clicked' },
                    { id: 'date_created', title: 'Date Created' },
                    { id: 'device_type', title: 'Device Type' },
                    { id: 'lat', title: 'Latitude' },
                    { id: 'longi', title: 'Longitude' },
                    { id: 'location', title: 'Location' },
                    { id: 'page_name', title: 'Page Name' },
                    { id: 'page_url', title: 'Page URL' },
                    { id: 'timezone', title: 'Timezone' },
                    { id: 'total_time_stayed', title: 'Total Time Stayed' },
                ]
            });
            await csvWriter.writeRecords(sanitized_results)

            const __dirname = path.dirname(new URL(import.meta.url).pathname);
            const filePath = path.join(__dirname, '../../output.csv');

            res.download(filePath, (err) => {
                if (err) {
                  console.error('Error sending file:', err);
                } else {
                  fs.unlink(filePath, (err) => {
                    if (err) {
                      console.error('Error deleting file:', err);
                    }
                  });
                }
            });
        }
    }
}