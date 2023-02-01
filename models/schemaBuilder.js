var mongoose = require("mongoose"),
    Schema = mongoose.Schema

module.exports = (structure) => {
    var myschema = new Schema(structure.model, { versionKey: false })
    myschema.plugin(require('mongoose-paginate'))
    myschema.methods.toJSON = function () {
        var obj = this.toObject()

        obj.id = obj._id
        delete obj._id
        const { hide, mask } = structure.mask || {}

        for (const key in (hide || [])) {
            delete obj[hide[key]]
        }
        for (const key in (mask || {})) {
            obj[mask[key]] = obj[key]
            delete obj[key]
        }
        return obj
    }
    return myschema
}