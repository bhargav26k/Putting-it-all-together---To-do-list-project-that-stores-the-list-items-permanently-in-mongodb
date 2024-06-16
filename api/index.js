const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Replace with your MongoDB Atlas connection string
const mongoAtlasUri = "mongodb+srv://bhargav26k:brgv@dynamictasktracker.wudkwj7.mongodb.net/?retryWrites=true&w=majority&appName=dynamictasktracker";

mongoose.connect(mongoAtlasUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("Database connected successfully"))
  .catch(err => console.error("Database connection error:", err));

// Extend schema with more fields for a professional task tracker
const taskSchema = new mongoose.Schema({
    name: String,
    description: String,
    dueDate: Date,
    priority: String
});

const Task = mongoose.model("Task", taskSchema);

// Example mock data for tasks
const mockTasks = [
    { name: "Develop project roadmap", description: "Outline key milestones and deliverables for the project.", dueDate: new Date("2024-07-01"), priority: "High" },
    { name: "Sprint planning meeting", description: "Plan tasks and assign team members for the upcoming sprint.", dueDate: new Date("2024-07-05"), priority: "Medium" },
    // Add more mock tasks here...
];

// Populate database with mock data if empty
Task.find({}).then(tasks => {
    if (tasks.length === 0) {
        Task.insertMany(mockTasks)
            .then(() => console.log("Mock tasks inserted successfully"))
            .catch(err => console.error("Error inserting mock tasks:", err));
    }
});

app.get("/", async (req, res) => {
    try {
        const foundTasks = await Task.find({});
        res.render("list", { dayej: foundTasks });
    } catch (err) {
        console.error("Error fetching tasks:", err);
        res.status(500).send("Internal Server Error");
    }
});

app.post("/", async (req, res) => {
    const { ele1: name, description, dueDate, priority } = req.body;
    const newTask = new Task({ name, description, dueDate, priority });
    try {
        await newTask.save();
        res.redirect("/");
    } catch (err) {
        console.error("Error saving task:", err);
        res.status(500).send("Internal Server Error");
    }
});

app.post("/delete", async (req, res) => {
    const checked = req.body.checkbox1;
    try {
        await Task.findByIdAndDelete(checked);
        res.redirect("/");
    } catch (err) {
        console.error("Error deleting task:", err);
        res.status(500).send("Internal Server Error");
    }
});

app.listen(5000, () => {
    console.log("Server is running on port 5000");
});

module.exports = app;
