const cnn = require("../database/cnn")
const vlt = require("../helper/validateTemplate")
const builder = require("../models/schemaBuilder");
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
            const req = vlt(template, request)
            var id = req.params && req.params.id ? req.params.id : 0
            if (id == 0) {
                throw Error("No id provided")
            }
            return await cnnschema.getEntity({ _id: id }).then(entity =>
                entity ? res.json(entity) : Promise.reject("Entity not found")
            )
        } catch (err) {
            return res.status(400).send({ message: err.message })
        }
    })

    app.put(path + "/:id", async function (request, res) {
        const req = vlt(template, request)
        var id = req.params && req.params.id ? req.params.id : 0
        if (id == 0) return res.status(400).send({ message: "No entity found" })
        delete req.body.id
        req.body._id = id
        return await cnnschema.saveEntity(req.body).then(entity =>
            entity ? res.json(entity) : Promise.reject("Entity not found"))
            .catch(err => res.status(400).send({ message: err }))
    })

    app.delete(path + "/:id", async function (request, res) {
        const req = vlt(template, request)
        var id = req.params && req.params.id ? req.params.id : 0
        if (id == 0) return res.status(400).send({ message: "No entity found" })


        return await cnnschema.deleteEntity(id).then(() => res.json({ id }))
            .catch(err => {
                console.log(err)
                return res.status(400).send({ message: err })
            })
    })

    app.post(path + "/", async function (request, res) {
        const req = vlt(template, request)
        if (req.body._id) return res.status(400).send({ message: "Entity already created" })
        return await cnnschema.saveEntity(req.body).then(entity =>
            entity ? res.json(entity) : Promise.reject("Entity not found"))
            .catch(err => res.status(400).send({ message: err }))
    })
}