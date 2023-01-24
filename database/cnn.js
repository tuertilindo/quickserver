const db = require("./mongo")
module.exports = function (schema) {
    return {
        getEntity: async function (filter) {
            const ca = schema(db)
            return ca.findOne(filter).exec()
        },
        saveEntity: async function (entity) {
            const ca = schema(db)
            var id = entity._id ? entity._id : 0
            if (id == 0) {
                return ca.create(entity).then(person => person.save())
            }
            var query = { '_id': id }
            return ca.findOneAndUpdate(query, entity, { upsert: true }, function (err, doc) {
                if (err) return Promise.reject(err)
                return Promise.resolve(doc)
            })
        },
        deleteEntity: async function (id) {
            const ca = schema(db)
            var query = { '_id': id }
            return ca.deleteOne(query, function (err, doc) {
                if (err) return Promise.reject(err)
                return Promise.resolve()
            })
        },
        getEntities: async function (filter, options = null) {
            const ca = schema(db)
            return options ? ca.paginate(filter, options) : ca.find(filter, fields, range)
        }
    }


}