const fs = require('fs');
module.exports = (folder, func) => {
    console.log("loading: " + folder);
    if (folder)
        fs.readdirSync(folder).forEach(file => {
            midware = require(folder + "/" + file)
            func(midware, file)
            console.log("Loaded: " + file);
        });
}