const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const apiRoutes = require("./routes/api");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// API Routes
app.use("/api", apiRoutes);


// Serve SPA files
app.use(express.static("public"));


// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((err) => {
        console.error("MongoDB connection failed:", err.message);
    })
    .finally(() => {
        // Start server regardless of DB connection
        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    });