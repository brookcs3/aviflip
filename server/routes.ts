import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import fs from "fs";
import { convertToAvif, createConvertedFileResponse } from "./services/imageConverter";
import { uploadSchema, insertImageFileSchema } from "@shared/schema";
import { z } from "zod";
import { ZodError } from "zod-validation-error";

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadsDir = path.join(process.cwd(), 'uploads');
      // Ensure directory exists
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
      // Create unique filename
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
  }),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check if file is JPEG
    if (file.mimetype !== 'image/jpeg') {
      return cb(new Error('Only JPG/JPEG files are allowed'));
    }
    cb(null, true);
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Create HTTP server
  const httpServer = createServer(app);
  
  // Health check endpoint
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok' });
  });
  
  // Upload and convert endpoint
  app.post('/api/convert', upload.single('file'), async (req: Request, res: Response) => {
    try {
      // Validate uploaded file
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      
      const validationResult = uploadSchema.safeParse({ file: req.file });
      if (!validationResult.success) {
        const errorMessage = validationResult.error.issues[0]?.message || 'Invalid file';
        return res.status(400).json({ message: errorMessage });
      }
      
      // Convert image to AVIF
      const { convertedPath, originalSize, convertedSize } = await convertToAvif(req.file.path);
      
      // Save file information to storage
      const now = Date.now().toString();
      const insertData = {
        originalName: req.file.originalname,
        convertedName: path.basename(convertedPath),
        originalSize: originalSize,
        convertedSize: convertedSize,
        path: convertedPath,
        conversionDate: now
      };
      
      // Validate using schema
      const parseResult = insertImageFileSchema.safeParse(insertData);
      if (!parseResult.success) {
        throw new Error('Invalid file data');
      }
      
      // Save to storage
      const savedFile = await storage.saveImageFile(insertData);
      
      // Create response with base URL
      const protocol = req.headers['x-forwarded-proto'] || req.protocol;
      const host = req.headers.host;
      const baseUrl = `${protocol}://${host}`;
      
      const response = createConvertedFileResponse(
        savedFile.id,
        savedFile.originalName,
        savedFile.convertedName,
        savedFile.originalSize,
        savedFile.convertedSize,
        baseUrl
      );
      
      res.status(200).json(response);
    } catch (error) {
      console.error('Conversion error:', error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : 'Failed to convert image' 
      });
    }
  });
  
  // Download converted file
  app.get('/api/download/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid file ID' });
      }
      
      const file = await storage.getImageFileById(id);
      if (!file) {
        return res.status(404).json({ message: 'File not found' });
      }
      
      // Check if file exists on disk
      if (!fs.existsSync(file.path)) {
        return res.status(404).json({ message: 'File not found on disk' });
      }
      
      // Set headers and send file
      res.setHeader('Content-Disposition', `attachment; filename="${file.convertedName}"`);
      res.setHeader('Content-Type', 'image/avif');
      
      // Stream the file
      const fileStream = fs.createReadStream(file.path);
      fileStream.pipe(res);
    } catch (error) {
      console.error('Download error:', error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : 'Failed to download file' 
      });
    }
  });
  
  // Get recent conversions (for demo/history purposes)
  app.get('/api/recent', async (req: Request, res: Response) => {
    try {
      const recentFiles = await storage.getRecentImageFiles(10);
      
      // Create responses for each file
      const protocol = req.headers['x-forwarded-proto'] || req.protocol;
      const host = req.headers.host;
      const baseUrl = `${protocol}://${host}`;
      
      const responses = recentFiles.map(file => 
        createConvertedFileResponse(
          file.id,
          file.originalName,
          file.convertedName,
          file.originalSize,
          file.convertedSize,
          baseUrl
        )
      );
      
      res.status(200).json(responses);
    } catch (error) {
      console.error('Error fetching recent files:', error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : 'Failed to fetch recent files' 
      });
    }
  });

  return httpServer;
}
