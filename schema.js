const mongoose = require("mongoose")

const studentSchema = new mongoose.Schema({
    id: Number,
    first_name: String,
    last_name: String,
    email: String,
    gender: String,
    job_title: String
}, { timestamps: true });

const StudentModel = mongoose.model("students", studentSchema);

module.exports = StudentModel;