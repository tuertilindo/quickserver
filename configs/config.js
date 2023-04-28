module.exports = (app, loadAuth = false) => {
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
    if (!loadAuth){
        require("../routes/auth")(app)
        //set Custom CRUD
        require("./loadRoutes")(app)
    }

    
} 
