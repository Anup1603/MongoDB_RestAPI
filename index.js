const express = require("express");
const mongoose = require("mongoose");
const mongoDB = require("./db");
const Student = require("./schema")
const bodyParser = require('body-parser');
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8000;


// MIDDLE WARE - 
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));


// Database Connection
mongoDB();

app.get("/", (req, res) => {
    res.send("<h1>connected ...</h1>");
})


// GET data
app.get("/api/students", async (req, res) => {
    const studentsData = await Student.find();
    return res.json(studentsData);
})


app.get("/name", async (req, res) => {
    const std = await Student.find();
    const html = `
        <ul>
            ${std.map((s) => `<li> <span>${s.id}</span> ${s.first_name}</li>`).join("")}
        </ul>
    `
    res.send(html);
})


// POST - create new student
app.post("/api/students", async (req, res) => {

    const lastStudent = await Student.findOne().sort({ id: -1 });

    const newId = lastStudent ? lastStudent.id + 1 : 1;

    const std = await new Student({
        id: newId,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        gender: req.body.gender,
        job_title: req.body.job_title
    });


    try {
        const newStd = await std.save();
        return res.json({ message: "Successfully create a new student", data: newStd })
    } catch (err) {
        return res.json({ message: `ERROR: ${err.message}` })
    }
})


// ROUTE if same path
// Dynamic path parameter
app.route("/api/students/:id")
    .get(async (req, res) => {
        const id = Number(req.params.id);
        const std = await Student.findOne({ id: id });
        try {
            return res.json({ message: `Here ${id}'s Details`, data: std });
        } catch (err) {
            return res.json({ message: `ERROR:${err.message}` })
        }
    })

    // PATCH- update data using id
    .patch(async (req, res) => {
        const id = Number(req.params.id);
        const updateStd = await Student.findOneAndUpdate({ id: id }, req.body, { new: true, runValidators: true });

        if (!updateStd) {
            return res.json({ message: `Update not happen in this id:${id}` });
        }

        return res.json({ message: `Update successfull in id:${id}`, data: updateStd });
    })

    // DELETE- delete data using id
    .delete(async (req, res) => {
        const id = Number(req.params.id);
        const deleteStd = await Student.findOneAndDelete({ id: id });

        if (!deleteStd) {
            return res.json({ message: `id:${id} not found` });
        }

        return res.json({ message: `id:${id} is successfully Deleted`, data: deleteStd });
    })


app.listen(PORT, () => {
    console.log(`Server is connected @ http://localhost:${PORT}`);
})