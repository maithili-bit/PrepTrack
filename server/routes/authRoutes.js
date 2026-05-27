const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const pool = require("../db");

const router = express.Router();


// ================= SIGNUP =================
router.post("/signup", async (req, res) => {

    try {

        const { name, email, password } = req.body;

        // Check existing user
        const user = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (user.rows.length > 0) {

            return res.status(400).json({
                message: "User already exists"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        await pool.query(
            "INSERT INTO users(name, email, password) VALUES($1, $2, $3)",
            [name, email, hashedPassword]
        );

        res.status(201).json({
            message: "Signup successful"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});



// ================= LOGIN =================
router.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        // Find user
        const user = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        // Check user exists
        if (user.rows.length === 0) {

            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        // Compare password
        const validPassword = await bcrypt.compare(
            password,
            user.rows[0].password
        );

        if (!validPassword) {

            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                id: user.rows[0].id,
                email: user.rows[0].email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.json({
            message: "Login successful",
            token
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Server error"
        });
    }
});


module.exports = router;