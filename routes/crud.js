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
            // Validate request
            if (template.onGetAll != null) {
                request = await template.onGetAll(request)
            }

            const { filter = "{}", sort, range = "[0, 9]" } = request.query
            const [a, b] = JSON.parse(range)
            const sorted = sort ? JSON.parse(sort) : undefined
            const paginate = a + b > 0 ? { offset: a, limit: b, sort: sorted } : null
            const query = { ...JSON.parse(filter), ...(request.filter || {}) }
            var result = await request.cnn[name].getEntities(query, paginate)

            //validate result
            if (template.afterGetAll != null) {
                result = await template.afterGetAll(request, result)
            }
            res.set('Content-Range', path.slice(1) + ' ' + a + "-" + b + "/" + result.total)
            const rest = res.json(result)
            return rest
        } catch (err) {
            return res.status(400).send({ message: err.message })
        }

    })

    app.get(path + "/:id", async function (request, res) {
        try {
            // Validate request
            if (template.onGet != null) {
                request = await template.onGet(request)
            }
            var item = await request.cnn[name].getOne(extractId(request))
            //validate result
            if (template.afterGet != null) {
                item = await template.afterGet(request, item)
            }
            return res.json(item)
        } catch (err) {
            return res.status(400).send({ message: err.message })
        }
    })

    app.put(path + "/:id", async function (request, res) {
        try {
            // Validate request
            if (template.onEdit != null) {
                request = await template.onEdit(request)
            }

            request.body._id = extractId(request)
            var item = await request.cnn[name].saveEntity(request.body)

            //validate result
            if (template.afterEdit != null) {
                item = await template.afterEdit(request, item)
            }
            return res.json(item)
        } catch (err) {
            return res.status(400).send({ message: err.message })
        }

    })

    app.delete(path + "/:id", async function (request, res) {
        try {
            // Validate request
            if (template.onDelete != null) {
                request = await template.onDelete(request)
            }

            var item = await request.cnn[name].getOne(extractId(request))
            await request.cnn[name].deleteEntity(item.id)

            //validate result
            if (template.afterDelete != null) {
                item = await template.afterDelete(request, item)
            }
            return res.json(item)
        } catch (err) {
            return res.status(400).send({ message: err.message })
        }

    })

    app.post(path + "/", async function (request, res) {
        try {
            // Validate request
            if (template.onCreate != null) {
                request = await template.onCreate(request)
            }

            if (request.body._id) throw Error("Entity already created")
            var item = await request.cnn[name].saveEntity(request.body)

            // Validate Item
            if (template.afterCreate != null) {
                item = await template.afterCreate(request, item)
            }
            res.json(item)
        } catch (err) {
            return res.status(400).send({ message: err.message })
        }

    })
}