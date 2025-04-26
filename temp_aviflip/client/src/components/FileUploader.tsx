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
    <div>
      <div
        className={`flex justify-center px-6 py-10 border-2 border-dashed rounded-t-lg cursor-pointer transition-all duration-200 ease-in-out ${
          isDragging 
            ? "border-primary bg-primary/5" 
            : "border-gray-200 hover:border-primary/40 hover:bg-gray-50"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <div className="space-y-4 text-center">
          <Upload className="mx-auto h-12 w-12 text-primary/70" />
          <div>
            <p className="text-sm text-gray-700 font-medium">Drop your JPG files here</p>
            <div className="flex items-center justify-center mt-2 text-sm text-gray-500">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer font-medium text-primary hover:text-primary/80 focus-within:outline-none"
              >
                <span>Upload files</span>
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
              <p className="pl-1">or drag and drop</p>
            </div>
          </div>
          <p className="text-xs text-gray-400">JPG and JPEG formats supported</p>
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
