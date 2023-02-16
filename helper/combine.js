const combineObject = function (o1, o2) {
    if (o1 == null) return o2
    for (var i in o1) {
        if (o2[i] == null) continue
        if (typeof o1[i] == "object" && typeof o2[i] == "object") {
            o1[i] = combineObject(o1[i], label)
        } if (typeof o1[i] == "number" && typeof o2[i] == "number") {
            o1[i] = o1[i] + o2[i]
        } else if (Array.isArray(o1[i])) {
            if (Array.isArray(o2[i])) {
                o1[i].concat(o2[i])
            } else {
                o1[i].push(o2[i])
            }
        } else {
            o1[i] = o2[i]
        }
        delete o2[i]

    }
    return { ...o1, ...o2 }
}
const unCombineObject = function (o1, o2) {
    if (o2 == null) return o1
    for (var i in o1) {
        if (o2[i] == null) continue
        if (typeof o1[i] == "object" && typeof o2[i] == "object") {
            o1[i] = unCombineObject(o1[i], o2[i])
        } if (typeof o1[i] == "number" && typeof o2[i] == "number") {
            o1[i] = o1[i] - o2[i]
        } else if (Array.isArray(o1[i])) {
            if (Array.isArray(o2[i])) {
                o1[i] = o1[i].filter(x => o2[i].filter(y => y != x) != null)
            } else {
                o1[i] = o1[i].filter(x => x != o2[i])
            }
        } else if (o1[i] == o2[i]) {
            delete o1[i]
        }

    }
    return o1
}



module.exports = (obj1, obj2, remove = false) => remove ? unCombineObject(obj1, obj2) : combineObject(obj1, obj2)