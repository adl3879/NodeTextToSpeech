const path = require("path");
const express = require("express");
const gTTS = require("gtts");
const fs = require("fs");

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set("view engine","ejs")

app.locals.filename = "";
app.get("/", (_req, res) => {
    res.render("index");
})

app.post("/", (req, res) => {
    let text = req.body.text || "Please say something";
    const gtts = new gTTS(text, "en");
    const filename = Date.now() + ".mp3";
    gtts.save(`./audio/${filename}`, function (err, _result) {
        if(err) 
            res.render("index");
        else {
            fs.readdir("./audio", (err, files) => {
                if (err) throw new Error(err);

                for (file of files) {
                    if (file !== filename) {  
                        fs.unlink(`./audio/${file}`, (err) => {
                            if (err) throw new Error(err);
                        })
                    }
                }
            })

            res.render("index", { filename: filename })
        }
    })
});

app.use("/audio", express.static(path.join(__dirname, "./audio")));

app.listen(5000, function () {
    console.log("Server is listening on Port 5000");
});
