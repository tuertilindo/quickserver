const cnn = require("../database/cnn")
const vlt = require("../helper/validateTemplate")
const builder = require("../models/schemaBuilder");
const { ObjectId } = require('mongodb');
const extractId = (req) => {
    var id = req.params && req.params.id ? req.params.id : 0
    if (!ObjectId.isValid(id)) {
        throw Error("Provided Id is not valid")
    }
    return id
}
module.exports = function (app, name, template) {
    const mod = builder(template.model)
    const cnnschema = cnn(db => db.model(name, mod))
    const path = "/" + name

    app.get(path + "/", async function (request, res) {
        try {
            const req = vlt(template, request)
            const { filter = "{}", sort, range = "[0, 9]" } = req.query
            const [a, b] = JSON.parse(range)
            const paginate = a + b > 0 ? { offset: a, limit: b } : null
            return await cnnschema.getEntities(JSON.parse(filter), paginate).then(list => {
                res.set('Content-Range', path.slice(1) + ' ' + a + "-" + b + "/" + list.total)
                return res.json(list.docs)
            })
        } catch (err) {
            return res.status(400).send({ message: err.message })
        }

    })

    app.get(path + "/:id", async function (request, res) {
        try {
            return res.json(await cnnschema.getEntity({ _id: extractId(vlt(template, request)) }))
        } catch (err) {
            return res.status(400).send({ message: err.message })
        }
    })

    app.put(path + "/:id", async function (request, res) {
        try {
            const req = vlt(template, request)
            req.body._id = extractId(req)
            return res.json(await cnnschema.saveEntity(req.body))
        } catch (err) {
            return res.status(400).send({ message: err.message })
        }

    })

    app.delete(path + "/:id", async function (request, res) {
        try {
            const req = vlt(template, request)
            var id = req.params && req.params.id ? req.params.id : 0
            if (id == 0) throw Error("Item not found")
            await cnnschema.deleteEntity(id)
            return res.json({ id })
        } catch (err) {
            return res.status(400).send({ message: err.message })
        }

    })

    app.post(path + "/", async function (request, res) {
        try {
            const req = vlt(template, request)
            if (req.body._id) throw Error("Entity already created")
            res.json(await cnnschema.saveEntity(req.body))
        } catch (err) {
            return res.status(400).send({ message: err.message })
        }

    })
}