let sheets

export default class SheetsDAO {
    static async injectDB(conn) {
        if (sheets){
            return
        }
        try {
            sheets = await conn.db(process.env.DB_NAME).collection('filter_sheet_mapping')
        } catch (e) {
            console.error(
                `Unable to establish connection handle in SheetsDAO: ${e}`
            )
        }
    }
    static async getSheets({
        page=0,
        resultsPerPage=20,
    } = {}){
        let cursor
        try {
            cursor = await sheets.find()
        } catch (e) {
            console.error(`Unable to issue find command, ${e}`)
            return { results: [] }
        }

        let dispCursor
        dispCursor = cursor.skip(resultsPerPage*page).limit(resultsPerPage)

        try{
            const results = await dispCursor.toArray()
            const count = await sheets.countDocuments()

            return { results, count }
        } catch(e) {
            console.error(
                `Unable to convert cursor to array or problem counting documents in SheetsDAO, ${e}`,
            )
            return { results: [], count: 0}
        }
    }
}