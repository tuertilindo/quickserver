const qs = require('./index.js');
qs.init({ port: 8080 }, app => {
    app.get("/", function (req, res) {
        res.send("test world!")
    })
})