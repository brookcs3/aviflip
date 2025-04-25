import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const imageFiles = pgTable("image_files", {
  id: serial("id").primaryKey(),
  originalName: text("original_name").notNull(),
  convertedName: text("converted_name").notNull(),
  originalSize: integer("original_size").notNull(),
  convertedSize: integer("converted_size").notNull(),
  path: text("path").notNull(),
  conversionDate: text("conversion_date").notNull(),
});

export const insertImageFileSchema = createInsertSchema(imageFiles).omit({
  id: true,
});

export type InsertImageFile = z.infer<typeof insertImageFileSchema>;
export type ImageFile = typeof imageFiles.$inferSelect;

// Validation schema for upload
export const uploadSchema = z.object({
  file: z.any()
    .refine(file => file !== undefined, "File is required")
    .refine(file => {
      if (!file || !file.mimetype) return false;
      return file.mimetype === 'image/jpeg';
    }, "Only JPG/JPEG files are allowed")
    .refine(file => {
      if (!file || !file.size) return false;
      return file.size <= 10 * 1024 * 1024; // 10MB limit
    }, "File size must be less than 10MB"),
});

// Response types for frontend use
export type ConvertedFile = {
  id: number;
  originalName: string;
  convertedName: string;
  originalSize: number;
  convertedSize: number;
  url: string;
  savings: number;
};
