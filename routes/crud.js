const vlt = require("../helper/validateTemplate")
const { ObjectId } = require('mongodb');
const extractId = (req) => {
    var id = req.params && req.params.id ? req.params.id : 0
    if (!ObjectId.isValid(id)) {
        throw Error("Provided Id is not valid")
    }
    return id
}
module.exports = function (app, name, template) {
    const path = "/" + name
    app.get(path + "/", async function (request, res) {
        try {
            const req = await vlt(template, request)
            const { filter = "{}", sort, range = "[0, 9]" } = req.query
            const [a, b] = JSON.parse(range)
            const paginate = a + b > 0 ? { offset: a, limit: b } : null
            const query = { ...JSON.parse(filter), ...(request.filter || {}) }
            var result = await request.cnn[name].getEntities(query, paginate)
            res.set('Content-Range', path.slice(1) + ' ' + a + "-" + b + "/" + result.total)
            return res.json(result)
        } catch (err) {
            return res.status(400).send({ message: err.message })
        }

    })

    app.get(path + "/:id", async function (request, res) {
        try {
            return res.json(await request.cnn[name].getOne(extractId(await vlt(template, request))))
        } catch (err) {
            return res.status(400).send({ message: err.message })
        }
    })

    app.put(path + "/:id", async function (request, res) {
        try {
            const req = await vlt(template, request)
            req.body._id = extractId(req)
            return res.json(await request.cnn[name].saveEntity(req.body))
        } catch (err) {
            return res.status(400).send({ message: err.message })
        }

    })

    app.delete(path + "/:id", async function (request, res) {
        try {
            var item = await request.cnn[name].getOne(extractId(await vlt(template, request)))
            await request.cnn[name].deleteEntity(item.id)
            if (template.afterDelete != null) {
                template.afterDelete(request, item)
            }
            return res.json(item)
        } catch (err) {
            return res.status(400).send({ message: err.message })
        }

    })

    app.post(path + "/", async function (request, res) {
        try {
            const req = await vlt(template, request)
            if (req.body._id) throw Error("Entity already created")
            res.json(await request.cnn[name].saveEntity(req.body))
        } catch (err) {
            return res.status(400).send({ message: err.message })
        }

    })
}