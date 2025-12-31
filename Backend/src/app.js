import express from "express";
import cors from "cors";

const app = express();

//configarations for CORS - MUST BE FIRST!
//through cors i want to tell where my frontend lies
// Configure CORS to allow frontend origins (supports comma-separated env var)
const rawCors = process.env.CORS_ORIGIN || "http://localhost:3000,http://localhost:8080";
const allowedOrigins = rawCors.split(",").map((s) => s.trim());

app.use(
    cors({
        origin: (origin, callback) => {
            // allow requests with no origin (like curl, mobile apps, or same-origin)
            if (!origin) return callback(null, true);
            if (allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            return callback(new Error("CORS policy: This origin is not allowed"));
        },
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
        exposedHeaders: ["Content-Length", "X-Request-Id"],
        maxAge: 86400, // 24 hours
        preflightContinue: false,
        optionsSuccessStatus: 204
    })
);

//Basic configs of express
app.use(express.json({ limit: "50mb" })); //--> expecting json data from users, including base64 images

// also i want through url i want to accept data
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
//the extended : true means we can accept nested objects,means the data which is coming through url can be nested objects

//also i want to serve static files from public folder,these part of app should be allowed publically viewable

app.use(express.static("public"));
//now the whole public folder is available now we can serve images through it

// import the routes 
import healthCheckRouter from "./routes/healthCheck.routes.js";
import DonationRouter from "./routes/formDonation.route.js";
import UserRouter from "./routes/user.route.js";

app.use("/api/v1/healthCheck", healthCheckRouter);
//once someone hits the url healthCheckRouter will taKE OVER And goes to the healthcheck.route.js 
//file and serve the home page 

app.use("/api/v1/donation", DonationRouter);
app.use("/api/v1", UserRouter);


app.get("/", (req, res) => {
    res.send("Hello guys I am happy");
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error("Global Error Handler Catch:", err);

    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.error,
            stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
        });
    }

    return res.status(500).json({
        success: false,
        message: err.message || "Internal Server Error",
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
});

export default app;