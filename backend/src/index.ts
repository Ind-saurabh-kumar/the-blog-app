import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import usersRoutes from "./routes/users";
import postsRoutes from "./routes/posts";
import authRoutes from "./routes/auth";
import likesRoutes from "./routes/likes";
import commentsRoutes from "./routes/comments";
import { errorMiddleware } from "./middleware/errorMiddleware";
import { v2 as cloudinary } from "cloudinary";

// Load .env (adjust path only if needed)
dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:4173",
    process.env.FRONTEND_SERVER_PROD || "",
  ],
  credentials: true,
};
app.use(cors(corsOptions));

// Cloudinary configuration (fail fast if not configured)
if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  console.error("❌ Missing Cloudinary environment variables!");
  process.exit(1); // Stop deployment to avoid timeout
}
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Static + Routes
app.use("/uploads/", express.static(path.join(process.cwd(), "/uploads/")));
app.use("/posts", postsRoutes);
app.use("/posts", likesRoutes);
app.use("/users", usersRoutes);
app.use("/auth", authRoutes);
app.use("/comments", commentsRoutes);

// Error middleware
app.use(errorMiddleware);

// Start server
app.listen(Number(PORT), "0.0.0.0", () => {
  console.log(`✅ Server running on http://0.0.0.0:${PORT}`);
});
