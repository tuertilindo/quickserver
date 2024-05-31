var users = require("../models/user.js")
var merge = require("../helper/merge.js")
const db = require("../database/mongo")
const jwt = require('jsonwebtoken')
module.exports = function (app, params) {
    const us = users(db, params.userSchema)
    authenticate = async function (req, res) {

        us.findOne({
            email: req.body.email,
        }).exec().then(user => {
            if (user && user.verifyPassword(req.body.password)) {
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
        }).catch(err => {
            res.status(401).send({ message: err.message })

        })
    }

    register = function (req, res) {
        us.findOne({
            email: req.body.email,
        }).exec().then(user => {
            if (!user) {
                return us.create({
                    ...req.body,
                    role: "Guest",
                    name: req.body.name || 'Unknow'
                }).then(newuser => newuser.save()
                    .then(saveduser => {

                        res.send(saveduser)
                    }))


            } else {

                throw new Error("The email provided already exists")
            }
        }).catch(err => {
            res.status(400).send({ message: err.message })

        })

    }
    updateMe = function (req, res) {
        delete req.body._id
        delete req.body.email
        delete req.body.password
        const user = merge(req.user, req.body)
        us.updateOne({ _id: user.id }, user).then(u => res.send(user))
    }

    profile = (req, res) => {
        return res.send(req.user)
    }
    app.all("*", (req, res, next) => {

        var bearerHeader = req.headers['authorization']
        var token = null
        if (bearerHeader) {
            const bearer = bearerHeader.split(' ')
            token = bearer[1]
        } else {
            token = req.query['token']
        }
        if (token) {

            jwt.verify(token, app.get('privateKey'), (err, decoded) => {
                if (err) {
                    return res.status(401).json({ mensaje: 'Invalid token' })
                } else {
                    req.user = decoded
                    next()
                }
            })
        } else if (req.path == '/' || req.path == '/login' || req.path == '/register' || ((params?.anonymous || {})[req.method] || []).find(x => x == req.path)) {
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
