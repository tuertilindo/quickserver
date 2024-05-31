
module.exports = (db, userschema) => db.model("User", require("./userSchema")(userschema))
