
import express, {
  ErrorRequestHandler,
} from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import imageRoutes from "./routes/image.routes";
dotenv.config();

const app = express();

app.use(cors({
  exposedHeaders: ["X-Processing-Time-Ms"],
}));

app.use(express.json());

// Health Check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "edge-cloud-api",
    timestamp: new Date().toISOString(),
  });
});

// Image Routes
app.use(imageRoutes);

// Global Error Handler
const errorHandler: ErrorRequestHandler = (
  error,
  req,
  res,
  next
) => {
  if (error instanceof multer.MulterError) {
    const statusCode =
      error.code === "LIMIT_FILE_SIZE" ? 413 : 400;

    res.status(statusCode).json({
      status: "error",
      message:
        error.code === "LIMIT_FILE_SIZE"
          ? "Image exceeds 10 MB limit."
          : "Invalid file upload.",
    });

    return;
  }

  console.error(error);

  res.status(500).json({
    status: "error",
    message: "Internal server error.",
  });
};

app.use(errorHandler);

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
