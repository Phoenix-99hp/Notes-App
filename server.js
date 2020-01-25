var express = require("express");
var path = require("path");
var fs = require("fs");

var app = express();
var PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(express.static("db"));

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/api/notes", (req, res) => {
    var notes = fs.readFileSync("db/db.json");
    var notesParsed = JSON.parse(notes);
    return res.json(notesParsed);
});

app.post("/api/notes", function (req, res) {

    var newNote = req.body;

    fs.readFile('db/db.json', (err, data) => {
        var json = JSON.parse(data);
        json.push(newNote);

        for (var i = 0; i < json.length; i++) {
            json[i].id = i;
        }

        fs.writeFile("db/db.json", JSON.stringify(json), "utf8", (error) => {
            if (error) throw error;
        })
    })

    return res.json(newNote);
});

app.delete("/api/notes/:id", (req, res) => {

    var noteId = req.params.id;

    fs.readFile('db/db.json', (err, data) => {

        var json = JSON.parse(data);

        for (var i = 0; i < json.length; i++) {
            if (json[i].id == noteId) {
                json.splice(i, 1);
            }
        }

        for (var i = 0; i < json.length; i++) {
            json[i].id = i;
        }

        fs.writeFile("db/db.json", JSON.stringify(json), "utf8", (error) => {
            if (error) throw error;
        });

    })

    res.redirect(200, "/notes");
});

app.listen(PORT, function () {
    console.log("App listening on http://localhost:" + PORT);
});