import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { Upload } from "lucide-react";
import { FileWithPreview } from "@/hooks/use-file-conversion";

interface FileUploaderProps {
  onFilesAdded: (files: FileWithPreview[]) => void;
}

export const FileUploader = ({ onFilesAdded }: FileUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files) {
      const filesArray = Array.from(e.dataTransfer.files) as FileWithPreview[];
      onFilesAdded(filesArray);
    }
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files) as FileWithPreview[];
      onFilesAdded(filesArray);
      // Reset input to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-3xl mx-auto mb-12">
      <div
        className={`flex justify-center px-6 pt-8 pb-8 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ease-in-out ${
          isDragging 
            ? "border-primary bg-primary/5 shadow-lg" 
            : "border-gray-300 hover:border-primary/60 hover:bg-primary/5"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <div className="space-y-3 text-center">
          <Upload className="mx-auto h-14 w-14 text-primary opacity-80" />
          <div className="flex flex-col sm:flex-row items-center justify-center text-sm text-gray-600">
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
            >
              <span>Upload a JPG file</span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                accept=".jpg,.jpeg"
                multiple
                ref={fileInputRef}
                onChange={handleFileSelect}
              />
            </label>
            <p className="sm:pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">JPG only, up to 10MB per file</p>
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
