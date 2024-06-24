const db = require("./mongo")
var ObjectId = require('mongoose').Types.ObjectId;
module.exports = function (schema) {
    return {
        create: async function (entity){
            const ca = schema(db)
            
            try {
                const person = await ca.create(entity)
                person.save()
            } catch (error) {
                throw error
            }
        },
        checkEntity: async function (filter) {
            const ca = schema(db)
            var item = await ca.findOne(filter)
            return item
        },
        getEntity: async function (filter) {
            const ca = schema(db)
            var item = await ca.findOne(filter)
            if (item == null) throw Error("Item not found")
            return item
        },
        getOne: async function (id) {
            const ca = schema(db)
            if (!ObjectId.isValid(id)) throw Error(ca.modelName + " id is not provider or incorrect")

            var item = await ca.findOne({ _id: id })
            if (item == null) throw Error(ca.modelName + " not found")
            return item
        },
        saveEntity: async function (entity) {
            const ca = schema(db)
            var id = entity._id ? entity._id : 0
            if (id == 0) {
                return await ca.create(entity).then(person => person.save())
            }
            var query = { '_id': id }
            delete entity._id
            delete entity.id
            var result = await ca.findOneAndUpdate(query, entity, { upsert: true })
            if (result == null) {
                throw new Error(ca.modelName + " was not changed")
            }
            return result
        },
        unsetDocument: async function (id, key) {
            const ca = schema(db)
            var query = { '_id': id }
            var value = {}
            value[key] = 1
            var result = await ca.findOneAndUpdate(query, { "$unset": value })
            if (result == null) {
                throw new Error(ca.modelName + " was not changed")
            }
            return result
        },
        deleteEntity: async function (id) {
            const ca = schema(db)
            if (!ObjectId.isValid(id)) throw Error(ca.modelName + " id is not provider or incorrect")
            var query = { '_id': id }
            var deleted = await ca.deleteOne(query)
            if (!deleted.acknowledged || deleted.deletedCount == 0) {
                throw new Error(ca.modelName + " was not deleted")
            }
            return deleted
        },
        deleteEntities: async function (query) {
            const ca = schema(db)
            var deleted = await ca.deleteMany(query)
            if (!deleted.acknowledged || deleted.deletedCount == 0) {
                throw new Error(ca.modelName + "s were not deleted")
            }
            return deleted
        },
        getEntities: async function (filter, options = null) {
            const ca = schema(db)
            return options ? ca.paginate(filter, options) : ca.find(filter, options?.fields, options?.range)
        }
    }


}