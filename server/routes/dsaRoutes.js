const express = require("express");

const pool = require("../db");

const authMiddleware =
    require("../middleware/authMiddleware");

const router = express.Router();


// ================= ADD QUESTION =================
router.post("/add", authMiddleware,
async (req, res) => {

    try {

        const {
            title,
            difficulty,
            topic,
            notes
        } = req.body;

        const user_id = req.user.id;

        await pool.query(
            `
            INSERT INTO dsa_questions
            (
                title,
                difficulty,
                topic,
                notes,
                user_id
            )
            VALUES($1, $2, $3, $4, $5)
            `,
            [
                title,
                difficulty,
                topic,
                notes,
                user_id
            ]
        );

        res.json({
            message: "Question added successfully"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});



// ================= GET QUESTIONS =================
router.get("/all", authMiddleware,
async (req, res) => {

    try {

        const user_id = req.user.id;

        const questions = await pool.query(
            `
            SELECT * FROM dsa_questions
            WHERE user_id = $1
            ORDER BY id DESC
            `,
            [user_id]
        );

        res.json(questions.rows);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});



// ================= DELETE QUESTION =================
router.delete("/delete/:id", authMiddleware,
async (req, res) => {

    try {

        const { id } = req.params;

        const user_id = req.user.id;

        await pool.query(
            `
            DELETE FROM dsa_questions
            WHERE id = $1
            AND user_id = $2
            `,
            [id, user_id]
        );

        res.json({
            message: "Question deleted"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


module.exports = router;