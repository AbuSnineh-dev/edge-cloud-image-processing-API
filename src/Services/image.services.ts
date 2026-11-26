import { AppError } from "../utils/app-error";
import sharp from "sharp"
import { performance } from "node:perf_hooks";
const MAX_PIXELS=25_000_000;
interface ProcessImageResult{
imageBuffer:Buffer;
processingTimeMs:number;
 width: number;
  height: number;
}
export const processImage = async (
  input: Buffer
): Promise<ProcessImageResult> => {
  const startTime = performance.now();

  try {
    const metadata = await sharp(input, {
      limitInputPixels: MAX_PIXELS,
    }).metadata();

    if (
      !metadata.format ||
      !["jpeg", "png"].includes(metadata.format)
    ) {
      throw new AppError(
        400,
        "Only JPEG and PNG images are supported."
      );
    }

    if (!metadata.width || !metadata.height) {
      throw new AppError(
        400,
        "Invalid image dimensions."
      );
    }

    if (metadata.width * metadata.height > MAX_PIXELS) {
      throw new AppError(
        400,
        "Image exceeds the maximum pixel limit."
      );
    }

    const outputBuffer = await sharp(input, {
      limitInputPixels: MAX_PIXELS,
    })
      .greyscale()
      .png()
      .toBuffer();

    const processingTimeMs = Number(
      (performance.now() - startTime).toFixed(2)
    );

    return {
      imageBuffer: outputBuffer,
      processingTimeMs,
      width: metadata.width,
      height: metadata.height,
    };

  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      400,
      "Invalid or corrupted image."
    );
  }
};