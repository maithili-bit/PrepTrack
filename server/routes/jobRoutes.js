const express = require("express");

const pool = require("../db");

const authMiddleware =
    require("../middleware/authMiddleware");

const router = express.Router();


// ================= ADD JOB =================
router.post("/add", authMiddleware,
async (req, res) => {

    try {

        const {
            company_name,
            role,
            status,
            applied_date,
            notes
        } = req.body;

        const user_id = req.user.id;

        await pool.query(
            `
            INSERT INTO job_applications
            (
                company_name,
                role,
                status,
                applied_date,
                notes,
                user_id
            )
            VALUES($1, $2, $3, $4, $5, $6)
            `,
            [
                company_name,
                role,
                status,
                applied_date,
                notes,
                user_id
            ]
        );

        res.json({
            message: "Job application added"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});



// ================= GET JOBS =================
router.get("/all", authMiddleware,
async (req, res) => {

    try {

        const user_id = req.user.id;

        const jobs = await pool.query(
            `
            SELECT * FROM job_applications
            WHERE user_id = $1
            ORDER BY id DESC
            `,
            [user_id]
        );

        res.json(jobs.rows);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});



// ================= DELETE JOB =================
router.delete("/delete/:id", authMiddleware,
async (req, res) => {

    try {

        const { id } = req.params;

        const user_id = req.user.id;

        await pool.query(
            `
            DELETE FROM job_applications
            WHERE id = $1
            AND user_id = $2
            `,
            [id, user_id]
        );

        res.json({
            message: "Application deleted"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


module.exports = router;