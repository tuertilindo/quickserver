var mongoose = require("mongoose"),
    Schema = mongoose.Schema

module.exports = (structure) => {
    var myschema = new Schema(structure, { versionKey: false })
    myschema.plugin(require('mongoose-paginate'))
    myschema.methods.toJSON = function () {
        var obj = this.toObject()
        obj.id = obj._id
        delete obj._id
        return obj
    }
    return myschema
}