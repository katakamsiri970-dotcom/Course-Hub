
const express = require("express");
const db = require("./db");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// HOME
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// GET ALL COURSES
app.get("/courses", (req, res) => {
    db.query("SELECT * FROM courses", (err, result) => {
        if (err) return res.status(500).send(err);
        res.json(result);
    });
});

// GET SINGLE COURSE
app.get("/courses/:id", (req, res) => {
    db.query(
        "SELECT * FROM courses WHERE course_id = ?",
        [req.params.id],
        (err, result) => {
            if (err) return res.status(500).send(err);
            if (result.length === 0)
                return res.status(404).send("Course not found");
            res.json(result[0]);
        }
    );
});

// UPDATE COURSE
app.put("/courses/:id", (req, res) => {
    const { course_code, course_name, credits, department, semester } = req.body;

    const sql = `UPDATE courses SET
        course_code=?, course_name=?, credits=?,
        department=?, semester=?
        WHERE course_id=?`;

    db.query(sql, [
        course_code, course_name, credits,
        department, semester, req.params.id
    ], (err, result) => {
        if (err) return res.status(500).send(err);
        if (result.affectedRows === 0)
            return res.status(404).send("Course not found");
        res.send("Course updated successfully");
    });
});

// DELETE COURSE
app.delete("/courses/:id", (req, res) => {
    db.query(
        "DELETE FROM courses WHERE course_id = ?",
        [req.params.id],
        (err, result) => {
            if (err) return res.status(500).send(err);
            if (result.affectedRows === 0)
                return res.status(404).send("Course not found");
            res.send("Course deleted successfully");
        }
    );
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
