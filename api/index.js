
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Replace with your MongoDB Atlas connection string
const mongoAtlasUri = "mongodb+srv://bhargav26k:Bhargav@54321@dynamictasktracker.wudkwj7.mongodb.net/?retryWrites=true&w=majority&appName=dynamictasktracker";

mongoose.connect(mongoAtlasUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(() => console.log("Database connected successfully"))
  .catch(err => console.error("Database connection error:", err));

const trySchema = new mongoose.Schema({
    name: String
});
const Item = mongoose.model("Task", trySchema);

app.get("/", async (req, res) => {
    try {
        const foundItems = await Item.find({});
        res.render("list", { dayej: foundItems });
    } catch (err) {
        console.error("Error fetching items:", err);
        res.status(500).send("Internal Server Error");
    }
});

app.post("/", async (req, res) => {
    const itemName = req.body.ele1;
    const newItem = new Item({
        name: itemName
    });
    try {
        await newItem.save();
        res.redirect("/");
    } catch (err) {
        console.error("Error saving item:", err);
        res.status(500).send("Internal Server Error");
    }
});

app.post("/delete", async (req, res) => {
    const checked = req.body.checkbox1;
    try {
        await Item.findByIdAndDelete(checked);
        res.redirect("/");
    } catch (err) {
        console.error("Error deleting item:", err);
        res.status(500).send("Internal Server Error");
    }
});

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});

module.exports = app;
