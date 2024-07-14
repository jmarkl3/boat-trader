export function objectsToArray(objects){
    if(!objects || typeof objects !== "object") return []
    let tempArray = []
    Object.entries(objects).forEach(([key, value]) => {
        let tempObject = {...value, id: key}
        tempArray.push(tempObject)
    })
    return tempArray
}