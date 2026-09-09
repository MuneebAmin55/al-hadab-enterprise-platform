import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { ENV } from "./config/env";
import { apiRouter } from "./routes/api.router";
import { errorMiddleware } from "./middleware/error.middleware";

const app = express();

// 1. Security Headers via Helmet
app.use(
  helmet({
    contentSecurityPolicy: false, // Managed at WAF/edge
    crossOriginEmbedderPolicy: false
  })
);

// 2. CORS Policy
const allowedOrigins = ENV.CORS_ORIGIN.split(",").map((o) => o.trim());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl) or matched origins
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Blocked by CORS security policy"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
  })
);

// 3. Body Parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// 4. Global Rate Limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Max 300 requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: 429,
    error: {
      code: "RATE_LIMIT_EXCEEDED",
      message: "Too many requests from this IP. Please try again after 15 minutes."
    }
  }
});
app.use("/api/", globalLimiter);

// 5. Correlation ID tracking middleware
app.use((req, res, next) => {
  const correlationId = (req.headers["x-correlation-id"] as string) || `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  res.setHeader("X-Correlation-ID", correlationId);
  req.headers["x-correlation-id"] = correlationId;
  next();
});

// 6. System Health Check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "HEALTHY",
    service: "alhadab-enterprise-api",
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    sovereignCloudZone: "KSA-Riyadh-01"
  });
});

// 7. API Resource Endpoints
app.use("/api/v1", apiRouter);

// 8. Global Error Interceptor
app.use(errorMiddleware);

// 9. Server Initialization
if (process.env.NODE_ENV !== "test") {
  app.listen(ENV.PORT, () => {
    console.log(`========================================================`);
    console.log(` AL-HADAB Trading & Contracting Co. - Enterprise API   `);
    console.log(` Running on port: http://localhost:${ENV.PORT}              `);
    console.log(` Environment:     ${ENV.NODE_ENV}                           `);
    console.log(` Health Check:    http://localhost:${ENV.PORT}/health       `);
    console.log(`========================================================`);
  });
}

export default app;
