module.exports = (o1, o2) => {
    if (o1 == null) return o2
    if (o2 == null) return o1
    for (var i in o1) {
        o1[i] = o2[i]
        delete o2[i]

    }
    return { ...o1, ...o2 }
}