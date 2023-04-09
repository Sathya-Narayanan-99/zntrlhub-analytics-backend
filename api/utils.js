export function validate_filters(filters) {
    if (filters.length === 0){
        let isValid = true
        let error = {}
        return { filters, isValid, error }
    }
    if (filters.length > 3){
        let isValid = false
        let error = {
            detail: "Length of filter should be 1 or less than or equal to 3."
        }
        return { filters, isValid, error}
    } 
    for (let i=0; i < filters.length; i++){
        let obj = filters[i]
        
        let field = obj.filter
        if (!['PAGE', 'TIME_SPENT', 'BUTTON_CLICK'].includes(field)){
            let isValid = false
            let error = {
                detail: `Invalid filter ${field}.`
            }
            return { filters, isValid, error} 
        }

        let condition = obj.condition
        if (condition && !['GREATER_THAN', 'LESSER_THAN'].includes(condition)){
            let isValid = false
            let error = {
                detail: `Invalid condition ${condition}.`
            }
            return { filters, isValid, error} 
        }
        let units = obj.units
        if (units && !['HOURS', 'MINUTES', 'SECONDS'].includes(units)){
            let isValid = false
            let error = {
                detail: `Invalid units ${units}.`
            }
            return { filters, isValid, error} 
        }
        let group = obj.group
        if (group && !['AND', 'OR'].includes(group)){
            let isValid = false
            let error = {
                detail: `Invalid group ${group}.`
            }
            return { filters, isValid, error} 
        }
    }
    sanitize_filters(filters)
    let isValid = true
    let errors = {}
    return { filters, isValid, errors }
}

function sanitize_filters(filters) {
    for (let i=0; i < filters.length; i++){
        let obj = filters[i]
        if (obj.condition){
            if (obj.condition === "GREATER_THAN"){
                obj.condition = "$gt"
            } else if (obj.condition === "LESSER_THAN"){
                obj.condition = "$lt"
            }
        } else {
            obj.condition = "$eq"
        }
        if (obj.group){
            if (obj.group === "AND"){
                obj.group = "$and"
            } else if (obj.group === "OR"){
                obj.group = "$or"
            } 
        }
        if (obj.filter){
            if (obj.filter === "PAGE"){
                obj.filter = "page_name"
            } else if (obj.filter === "TIME_SPENT"){
                obj.filter = "total_time_stayed"
            } else if (obj.filter === "BUTTON_CLICK"){
                obj.filter = "button_clicked.button_name"
            }
        }
        if (obj.units){
            if (obj.units === "HOURS"){
                obj.value *= 60 * 60
            } else if (obj.units === "MINUTES"){
                obj.value *= 60
            }
        }
    }
}