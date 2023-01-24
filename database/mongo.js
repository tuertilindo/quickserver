const mongoose = require('mongoose')
const uri = process.env.DATABASE_URL
if (uri == null) throw Error("The database URL is not set, please add it to environment: DATABASE_URL")
mongoose.set('strictQuery', true);
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
console.log("database connected to: " + uri)

module.exports = mongoose