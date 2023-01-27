
const crud = require("../routes/crud")
const { resolve } = require('path');

const folders = require("../helper/loadFolder")

module.exports = (app) => {
    if (process.env.MODELS_PATH) {
        folders(resolve(process.env.MODELS_PATH), (template, file) => {
            var name = file.substring(0, file.indexOf('.'))
            crud(app, name, template)
        });
    }

}