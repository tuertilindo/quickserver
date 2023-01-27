const db = require("./mongo")
module.exports = function (schema) {
    return {
        getEntity: async function (filter) {
            const ca = schema(db)
            var item = await ca.findOne(filter)
            if (item == null) throw Error("Item not found")
            return item
        },
        saveEntity: async function (entity) {
            const ca = schema(db)
            var id = entity._id ? entity._id : 0
            if (id == 0) {
                return ca.create(entity).then(person => person.save())
            }
            var query = { '_id': id }
            delete entity._id
            delete entity.id
            var result = await ca.findOneAndUpdate(query, entity, { upsert: true })
            if (result == null) {
                throw new Error("No item was changed")
            }
            return result
        },
        deleteEntity: async function (id) {
            const ca = schema(db)
            var query = { '_id': id }
            var deleted = await ca.deleteOne(query)
            if (!deleted.acknowledged || deleted.deletedCount == 0) {
                throw new Error("No item was deleted")
            }
        },
        getEntities: async function (filter, options = null) {
            const ca = schema(db)
            return options ? ca.paginate(filter, options) : ca.find(filter, fields, range)
        }
    }


}