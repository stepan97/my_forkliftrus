const mongoose = require("mongoose");
const config = require("config");

module.exports = function(){
    const options = {
        useNewUrlParser: true,
        useFindAndModify: false
    };
    
    mongoose.connect(config.get("dbConStr"), options)
        .then(() => console.log("Connect to db..."))
        .catch((err) => console.log("Could not connect to db:", err));
}
