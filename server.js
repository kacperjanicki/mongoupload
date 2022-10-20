if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
const bodyParser = require("body-parser");
const express = require("express"); //npm i express ejs express-ejs-layouts
const app = express();
const mongoose = require("mongoose");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var fs = require("fs");

mongoose.connect(
    process.env.MONGO_URL,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
    (err) => console.log("connected" || err)
);

const imgModel = require("./model");
const store = require("./multer");

app.get("/", async (req, res) => {
    const images = await imgModel.find({});
    res.render("index", { images: images });
});
app.post("/", store.single("Image"), async (req, res, next) => {
    const file = req.file;
    if (!file) {
        const error = new Error("Please choose a file");
        error.httpStatusCode = 400;
        return next(error);
    }
    //convert image to base64
    let img = fs.readFileSync(file.path).toString("base64");
    let finalImg = {
        filename: req.file.originalname,
        contentType: req.file.mimetype,
        imageBase64: img,
    };
    //save image
    const image = new imgModel(finalImg);
    await image.save();
    res.json(img);
});

app.listen(process.env.PORT || 2137);
