const jwt = require('jsonwebtoken')

var userSchema = require("../models/userSchema")

const cnn = require("../database/cnn")
module.exports = (app, params) => {
    // CORS
    app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*')
        res.header('Access-Control-Allow-Headers', '*')
        res.header('Access-Control-Expose-Headers', 'Content-Range, Range')
        res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE')
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
        res.type("json")
        if (req.method == "OPTIONS") return res.send()
        next()
    })

    // Set the bodyparser
    bodyParser = require("body-parser")
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json())
    // Load User
    const umod = userSchema(params.userSchema)
    const userCnn = cnn(db => db.model('User', umod))
    //create user
    app.all("*", (req, res, next) => {

        var bearerHeader = req.headers['authorization']
        var token = null
        req.userCnn = userCnn
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

                }
            })
        }
        next()
    })
    if (params.beforeLoad) params.beforeLoad(app)

    //set Custom CRUD
    require("./loadRoutes")(app, params)
    require("../routes/auth")(app, params)
} 
