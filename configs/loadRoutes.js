
const crud = require("../routes/crud")
const { resolve } = require('path');
const builder = require("../models/schemaBuilder");
const folders = require("../helper/loadFolder")
const cnn = require("../database/cnn")
const combine = require("../helper/combine")
module.exports = (app) => {
    if (process.env.MODELS_PATH) {
        const cnns = { helper: { combine } }
        app.all("*", (req, res, next) => {
            if (req.cnn == null) req.cnn = {}
            req.cnn = cnns
            next()
        })
        folders(resolve(process.env.MODELS_PATH), (template, file) => {
            var name = file.substring(0, file.indexOf('.'))
            const mod = builder(template)
            cnns[name] = cnn(db => db.model(name, mod))

            crud(app, name, template)
        });

    }

}