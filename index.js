const { ObjectId } = require('mongodb')
const multer = require('multer');
exports.init = (params, load) => {
    var express = require("express"),
        app = express(),
        http = require("http")
    //Database
    if (!process.env.DATABASE_URL) process.env["DATABASE_URL"] = params.dbConnectionString
    // Set the config
    // Get Private key from env
    const pk = process.env.PRIVATE_KEY || params.privatekey
    if (!pk) throw Error("The Private key is not set, please add it to enviorement: PRIVATE_KEY ")
    app.set('privateKey', pk)
    console.log('configuring...')
    require("./configs/config")(app, params)
    console.log('Loading app...')
    if (load) load(app)

    const port = params.port || 8080
    if (!params.noserve) {
        console.log('starting server...')
        app.listen(port, function () {
            console.log("Quickserver running on http://localhost:" + port)
        })
    } else {
        console.log('serving is set to false...')
    }
    console.log('Quickserver initialized!')
    return app
}
exports.helper = {
    checkId: (id) => ObjectId.isValid(id),
    generateId: (id) => new ObjectId(id.padStart(24, "0")),
    processFile: (field) => multer({ storage: multer.memoryStorage() }).single(field),
    model: (name, schema) => require('mongoose').model(name, schema)
}

