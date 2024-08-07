const { ObjectId } = require('mongodb')
const multer = require('multer');
exports.init = (params, load) => {
    var express = require("express"),
        app = express(),
        http = require("http"),
        server = http.createServer(app)
    //Database
    if (!process.env.DATABASE_URL) process.env["DATABASE_URL"] = params.dbConnectionString
    // Set the config
    // Get Private key from env
    const pk = process.env.PRIVATE_KEY || params.privatekey
    if (!pk) throw Error("The Private key is not set, please add it to enviorement: PRIVATE_KEY ")
    app.set('privateKey', pk)
    require("./configs/config")(app, params)
    if (load) load(app)

    const port = params.port || 8080
    if (!params.noserve) {
        server.listen(port, function () {
            console.log("Quickserver running on http://localhost:" + port)
        })
    }

    return app
}
exports.helper = {
    checkId: (id) => ObjectId.isValid(id),
    generateId: (id) => new ObjectId(id.padStart(24, "0")),
    processFile: (field) => multer({ storage: multer.memoryStorage() }).single(field),
    model: (name, schema) => require('mongoose').model(name, schema)
}

