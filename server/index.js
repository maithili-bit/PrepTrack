require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const dsaRoutes = require("./routes/dsaRoutes");

const jobRoutes = require("./routes/jobRoutes");

const app = express();

app.use(cors());
app.use(express.json());


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/dsa", dsaRoutes);
app.use("/api/jobs", jobRoutes);

app.get("/", (req, res) => {
    res.send("PrepTrack API Running");
});


app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});