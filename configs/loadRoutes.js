
const crud = require("../routes/crud")
const { resolve } = require('path');

const folders = require("../helper/loadFolder")

module.exports = (app, path) => {
    if (process.env.MODELS_PATH || path) {
        const absolutePath = resolve(process.env.MODELS_PATH || path);
        folders(absolutePath, (template, file) => {
            var name = file.substring(0, file.indexOf('.'))
            crud(app, name, template)
        });
    }

}