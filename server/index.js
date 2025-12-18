const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

// Configuration
dotenv.config();
const { connectToDB } = require("./database/db.connection.js");
const adminRouter = require("./routes/admin.route.js");
const empRouter = require("./routes/employee.route.js");

const app = express();

/**
 * 1. TRUST PROXY (Critical for Render/Vercel)
 * This tells Express that it is behind a proxy (Render's Load Balancer).
 * Without this, 'secure: true' cookies may not be sent because Express
 * thinks the connection is insecure HTTP.
 */
app.set("trust proxy", 1);

/**
 * 2. CORS CONFIGURATION
 * origin: Must be an exact match to your frontend URL (no trailing slash).
 * credentials: true is mandatory to allow cookies to be stored.
 */
app.use(cors({
    origin: [
        "https://taskflow-app-rose.vercel.app", 
        "http://localhost:5173" // For local development
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

/**
 * 3. MIDDLEWARE
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/**
 * 4. ROUTES
 */
app.use("/admin", adminRouter);
app.use("/employee", empRouter);

// Health Check Route (Good practice for Render)
app.get("/", (req, res) => {
    res.status(200).json({ message: "Server is healthy and running!" });
});

/**
 * 5. DATABASE & SERVER STARTUP
 * We wrap the listen in the connectToDB promise to ensure 
 * the app doesn't start accepting requests before the DB is ready.
 */
const startServer = async () => {
    try {
        await connectToDB();
        const PORT = process.env.PORT || 9998;
        app.listen(PORT, () => {
            console.log(`✅ MongoDB Connected`);
            console.log(`🚀 Server listening on port ${PORT}`);
        });
    } catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1); // Exit if DB connection fails
    }
};

startServer();