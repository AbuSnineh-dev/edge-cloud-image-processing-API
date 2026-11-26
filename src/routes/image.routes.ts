
import { Router } from "express";
import { uploadImge } from "../middleware/upload.middleware";
import { processImageController } from "../controllers/image.controllers";

const router = Router();

router.post(
  "/process-image",
  uploadImge.single("image"),
  processImageController
);

export default router;
