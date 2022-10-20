var mongoose = require("mongoose");
var imageSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true,
        unique: true,
    },
    contentType: {
        type: String,
        required: true,
    },
    imageBase64: {
        type: String,
        required: true,
    },
});
module.exports = mongoose.model("cos", imageSchema); //collection name in mongodb
