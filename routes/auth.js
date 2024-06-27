var merge = require("../helper/merge.js")
const jwt = require('jsonwebtoken')
module.exports = function (app, params) {
    authenticate = async function (req, res) {
        try {
            const user = await req.cnn['User'].checkEntity({
                email: req.body.email,
            })
            const valid = await user.verifyPassword(req.body.password)
            if (user && valid) {
                var me = user.toJSON()
                jwt.sign(me, app.get('privateKey'), function (err, token) {
                    if (!err) {
                        res.json({ ...me, token: token })
                    } else {
                        throw Error("Error parsing user")
                    }
                })

            } else {
                return res.sendStatus(401)
            }
        } catch (error) {
            return res.status(401).send({ message: error.message })
        }
    }

    register = async function (req, res) {
        try {
            const user = await req.cnn['User'].checkEntity({
                email: req.body.email,
            })
            if (!user) {
                const newUser = await req.cnn['User'].saveEntity({
                    ...req.body,
                    role: "Guest",
                    name: req.body.name || 'Unknow'
                })
                return res.json(newUser)
            } else {

                throw new Error("The email provided already exists")
            }
        } catch (error) {
            return res.status(400).send({ message: error.message })

        }

    }
    updateMe = function (req, res) {
        delete req.body._id
        delete req.body.email
        delete req.body.password
        const user = merge(req.user, req.body)
        return res.send(req.cnn['User'].saveEntity(user))
    }

    profile = (req, res) =>

        app.all("*", (req, res, next) => {
            if (req.user) {
                next()
            } else if (req.path == '/' || req.path == '/login' || ((params?.anonymous || {})[req.method] || []).find(x => x == req.path)) {
                next()

            } else {
                // Forbidden
                res.sendStatus(403)
            }
        })
    app.post("/login", authenticate)
    app.post("/register", register)
    app.post("/updateme", updateMe)
    app.get("/profile", profile)
    // Middware

}
