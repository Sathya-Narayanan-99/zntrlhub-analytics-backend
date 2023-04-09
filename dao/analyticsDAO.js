let analytics

export default class AnalyticsDAO {
    static async injectDB(conn) {
        if (analytics){
            return
        }
        try {
            analytics = await conn.db(process.env.DB_NAME).collection('tracks')
        } catch (e) {
            console.error(
                `Unable to establish connection handle in AnalyticsDAO: ${e}`
            )
        }
    }
    static async getAnalytics({
        filters=null,
        page=0,
        resultsPerPage=20,
        date_gte=null,
        date_lte=null,
        use_pagination=true
    } = {}) {
        let query
        if (filters.length == 3) {
            if (filters[1].group == filters[2].group){
                let operation = filters[1].group
                query = { [operation]: [] }
                for (let i=0; i<filters.length; i++){
                    let cur_query = {[filters[i].filter]: {[filters[i].condition]: filters[i].value}}
                    query[operation].push(cur_query)
                }
            } else {
                let and_presedence
                let or_presedence
                for (let i=0; i<filters.length; i++){
                    if (filters[i].group === '$and'){
                        and_presedence = i
                    } else if (filters[i].group === '$or'){
                        or_presedence = i
                    }
                }
                query = {
                    $or: [
                        { $and: [
                            { [filters[and_presedence-1].filter]: {[filters[and_presedence-1].condition]: filters[and_presedence-1].value} },
                            { [filters[and_presedence].filter]: {[filters[and_presedence].condition]: filters[and_presedence].value} }
                        ]},
                        { [filters[or_presedence].filter]: {[filters[or_presedence].condition]: filters[or_presedence].value} }
                    ]
                }
            }
        } else if (filters.length === 2) {
            query = {
                [filters[1].group]: [
                    { [filters[0].filter]: {[filters[0].condition]: filters[0].value} },
                    { [filters[1].filter]: {[filters[1].condition]: filters[1].value} }
                ]
            }
        } else if (filters.length === 1){
            query = {
                [filters[0].filter]: {[filters[0].condition]: filters[0].value}
            }
        } else {
            query = {}
        }

        let dt_query
        if (date_lte && date_gte){
            dt_query = {
                $and:[
                    query,
                    {"date_created": {$gte: date_gte, $lte: date_lte}}
                ]
            }
        } else {
            dt_query = query
        }
        
        let cursor

        try {
            cursor = await analytics.find(dt_query)
        } catch (e) {
            console.error(`Unable to issue find command in AnalyticsDAO, ${e}`)
            return { results: [], count: 0}
        }
        
        let dispCursor
        if (use_pagination){
            dispCursor = cursor.limit(resultsPerPage).skip(resultsPerPage*page)
        } else {
            dispCursor = cursor
        }

        try{
            const results = await dispCursor.toArray()
            const count = await analytics.countDocuments(dt_query)

            return { results, count }
        } catch(e) {
            console.error(
                `Unable to convert cursor to array or problem counting documents in AnalyticsDAO, ${e}`,
            )
            return { results: [], count: 0}
        }
    }
}