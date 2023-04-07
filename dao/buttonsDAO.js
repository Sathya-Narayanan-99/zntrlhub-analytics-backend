let buttons

export default class ButtonsDAO {
    static async injectDB(conn) {
        if (buttons){
            return
        }
        try {
            buttons = await conn.db(process.env.DB_NAME).collection('tracks')
        } catch (e) {
            console.error(
                `Unable to establish connection handle in buttonsDAO: ${e}`
            )
        }
    }
    static async getButtons({
    } = {}){
        let results
        try {
            results = await buttons.distinct("button_clicked.button_name", {})
            return results 
        } catch (e) {
            console.error(`Unable to issue find command, ${e}`)
            return { results: [] }
        }
    }
}