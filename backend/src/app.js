import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import userRoutes from "../routes/user.routes.js";
import tweetRoutes from "../routes/tweet.routes.js";
import aiRoutes from "../routes/ai.routes.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.FRONTEND_URL,
].filter(Boolean);

const corsOptions = {
  origin: ["https://echo-socials.vercel.app"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());

app.use(cors(corsOptions));

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/tweet", tweetRoutes);
app.use("/api/v1/ai", aiRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

export default app;
