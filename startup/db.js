const mongoose = require("mongoose");
const config = require("config");

module.exports = function(){
    const options = {
        useNewUrlParser: true,
        useFindAndModify: false
    };
    
    console.log('DB STR:', config.get('dbConStr'));

    mongoose.connect(config.get("dbConStr").toString(), options)
        .then(() => console.log("Connect to db..."))
        .catch((err) => console.log("Could not connect to db:", err));
}
