import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { ConvertedFile } from '@shared/schema';

const mkdir = promisify(fs.mkdir);
const access = promisify(fs.access);

// Ensure upload directory exists
const createUploadsDir = async () => {
  const uploadsDir = path.join(process.cwd(), 'uploads');
  try {
    await access(uploadsDir);
  } catch (error) {
    await mkdir(uploadsDir, { recursive: true });
  }
  return uploadsDir;
};

// Convert JPEG image to AVIF format
export const convertToAvif = async (
  imagePath: string,
  quality: number = 60
): Promise<{
  convertedPath: string;
  originalSize: number;
  convertedSize: number;
}> => {
  try {
    const uploadsDir = await createUploadsDir();
    
    // Get original file size
    const originalSize = fs.statSync(imagePath).size;
    
    // Prepare output path
    const filename = path.basename(imagePath);
    const nameWithoutExt = filename.substring(0, filename.lastIndexOf('.'));
    const convertedFilename = `${nameWithoutExt}.avif`;
    const convertedPath = path.join(uploadsDir, convertedFilename);
    
    // Convert image to AVIF
    await sharp(imagePath)
      .avif({ quality, effort: 5 }) // Higher effort for better compression (range 0-9)
      .toFile(convertedPath);
    
    // Get converted file size
    const convertedSize = fs.statSync(convertedPath).size;
    
    return {
      convertedPath,
      originalSize,
      convertedSize
    };
  } catch (error) {
    console.error('Error converting image:', error);
    throw new Error(`Failed to convert image: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Create response object for frontend
export const createConvertedFileResponse = (
  id: number,
  originalName: string,
  convertedName: string,
  originalSize: number,
  convertedSize: number,
  baseUrl: string
): ConvertedFile => {
  // Calculate savings percentage
  const savings = Math.round((1 - (convertedSize / originalSize)) * 100);
  
  return {
    id,
    originalName,
    convertedName,
    originalSize,
    convertedSize,
    url: `${baseUrl}/api/download/${id}`,
    savings
  };
};
