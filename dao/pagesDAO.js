let pages

export default class PagesDAO {
    static async injectDB(conn) {
        if (pages){
            return
        }
        try {
            pages = await conn.db(process.env.DB_NAME).collection('tracks')
        } catch (e) {
            console.error(
                `Unable to establish connection handle in pagesDAO: ${e}`
            )
        }
    }
    static async getPages({
    } = {}){
        let results
        try {
            results = await pages.distinct("page_name", {})
            return results 
        } catch (e) {
            console.error(`Unable to issue find command, ${e}`)
            return { results: [] }
        }
    }
}