import { imageFiles, type ImageFile, type InsertImageFile } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<any | undefined>;
  getUserByUsername(username: string): Promise<any | undefined>;
  createUser(user: any): Promise<any>;
  
  // Image file operations
  saveImageFile(imageFile: InsertImageFile): Promise<ImageFile>;
  getImageFileById(id: number): Promise<ImageFile | undefined>;
  getRecentImageFiles(limit: number): Promise<ImageFile[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, any>;
  private images: Map<number, ImageFile>;
  currentUserId: number;
  currentImageId: number;

  constructor() {
    this.users = new Map();
    this.images = new Map();
    this.currentUserId = 1;
    this.currentImageId = 1;
  }

  async getUser(id: number): Promise<any | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<any | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: any): Promise<any> {
    const id = this.currentUserId++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async saveImageFile(insertImageFile: InsertImageFile): Promise<ImageFile> {
    const id = this.currentImageId++;
    const imageFile: ImageFile = { ...insertImageFile, id };
    this.images.set(id, imageFile);
    return imageFile;
  }

  async getImageFileById(id: number): Promise<ImageFile | undefined> {
    return this.images.get(id);
  }

  async getRecentImageFiles(limit: number): Promise<ImageFile[]> {
    const allImages = Array.from(this.images.values());
    return allImages.sort((a, b) => parseInt(b.conversionDate) - parseInt(a.conversionDate)).slice(0, limit);
  }
}

export const storage = new MemStorage();
