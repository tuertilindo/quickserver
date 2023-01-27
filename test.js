const qs = require('./index.js');
qs.init({ port: 8081 }, app => {
    app.get("/", function (req, res) {
        res.send("test world!")
    })
})