
import { Request, Response } from "express";
import { processImage } from "../Services/image.services";
import { AppError } from "../utils/app-error";

export const processImageController = async (
  req: Request,
  res: Response
): Promise<void> => {

  if (!req.file) {
    res.status(400).json({
      status: "error",
      message: "Please upload a valid JPEG or PNG image.",
    });
    return;
  }

  try {
    const result = await processImage(req.file.buffer);

    res.setHeader(
      "X-Processing-Time-Ms",
      result.processingTimeMs.toString()
    );

    res.setHeader("Content-Type", "image/png");

    res.setHeader(
      "Content-Disposition",
      'inline; filename="grayscale.png"'
    );

    res.status(200).send(result.imageBuffer);

  } catch (error) {

    if (error instanceof AppError) {
      res.status(error.statusCode).json({
        status: "error",
        message: error.message,
      });
      return;
    }

    console.error(error);

    res.status(500).json({
      status: "error",
      message: "Image processing failed.",
    });
  }
};
