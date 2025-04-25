import { useState, useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import JSZip from 'jszip';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { 
  Cloud, 
  CheckCircle, 
  RefreshCw, 
  AlertTriangle, 
  X, 
  FileImage,
  Download,
  Loader,
  Zap,
  ArrowLeftRight
} from 'lucide-react';
import { 
  formatFileSize, 
  getBrowserCapabilities, 
  readFileOptimized,
  createDownloadUrl 
} from '@/lib/utils';
import { siteConfig } from '../config';

// Type for our accepted files
interface AcceptedFile extends File {
  path?: string;
}

// Simple object for tracking converted files
interface ConvertedFile {
  id: number;
  originalName: string;
  originalSize: number;
  convertedSize: number;
  convertedBlob: Blob;
  url: string;
  savings: number;
}

// Update the siteConfig to include default conversion mode
const defaultConversionMode = 'jpgToAvif'; // Correct this later if needed

const DropConvert = () => {
  const [files, setFiles] = useState<AcceptedFile[]>([]);
  const [status, setStatus] = useState<'idle' | 'ready' | 'processing' | 'error' | 'success'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [progress, setProgress] = useState(0);
  const [processingFile, setProcessingFile] = useState<number>(0);
  const [convertedFiles, setConvertedFiles] = useState<ConvertedFile[]>([]);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  
  // JPG to AVIF mode - hardcoded to true for this project
  const [jpgToAvif, setJpgToAvif] = useState(true);
  
  // Update document title based on mode
  const pageTitle = jpgToAvif ? "JPG to AVIF Converter" : "AVIF to JPG Converter";
  
  // Calculate total bytes processed
  const totalOriginalBytes = useMemo(() => {
    return files.reduce((sum, file) => sum + file.size, 0);
  }, [files]);
  
  const totalConvertedBytes = useMemo(() => {
    return convertedFiles.reduce((sum, file) => sum + file.convertedSize, 0);
  }, [convertedFiles]);
  
  // Calculate space savings
  const spaceSavings = useMemo(() => {
    if (!totalOriginalBytes || !totalConvertedBytes) return 0;
    return Math.max(0, Math.round((1 - totalConvertedBytes / totalOriginalBytes) * 100));
  }, [totalOriginalBytes, totalConvertedBytes]);
  
  // Dropzone configuration
  const { 
    getRootProps, 
    getInputProps, 
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({
    accept: jpgToAvif ? 
      { 'image/jpeg': ['.jpg', '.jpeg'], 'image/png': ['.png'] } : 
      { 'image/avif': ['.avif'] },
    onDrop: acceptedFiles => {
      // Reset any previous errors
      setErrorMessage('');
      
      // Check if files were accepted
      if (acceptedFiles.length === 0) {
        setErrorMessage('No valid files were selected. Please select JPG or JPEG files.');
        setStatus('error');
        return;
      }
      
      const newFiles = acceptedFiles as AcceptedFile[];
      setFiles(prevFiles => [...prevFiles, ...newFiles]);
      setStatus('ready');
    },
    maxFiles: 20 // Set a reasonable limit
  });
  
  // Clear all files and reset state
  const handleClearAll = useCallback(() => {
    setFiles([]);
    setConvertedFiles([]);
    setDownloadUrl(null);
    setStatus('idle');
    setProgress(0);
    setProcessingFile(0);
    setErrorMessage('');
    
    // Clean up any object URLs to prevent memory leaks
    convertedFiles.forEach(file => {
      if (file.url) URL.revokeObjectURL(file.url);
    });
  }, [convertedFiles]);
  
  // Remove a single file
  const handleRemoveFile = useCallback((index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    
    if (convertedFiles[index] && convertedFiles[index].url) {
      URL.revokeObjectURL(convertedFiles[index].url);
    }
    
    setConvertedFiles(prev => prev.filter((_, i) => i !== index));
    
    // Reset status if no files left
    if (files.length === 1) {
      setStatus('idle');
      setDownloadUrl(null);
    }
  }, [files, convertedFiles]);
  
  // JPG to AVIF conversion using our backend API
  const convertJpgToAvif = async (file: File): Promise<Blob> => {
    // Create a FormData to send to the server
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      const result = await response.json();
      
      // Fetch the converted file from the download URL
      const downloadResponse = await fetch(`/api/download/${result.id}`);
      
      if (!downloadResponse.ok) {
        throw new Error(`Download error: ${downloadResponse.status}`);
      }
      
      // Get the converted file as a blob
      const convertedBlob = await downloadResponse.blob();
      return convertedBlob;
    } catch (error) {
      console.error('Error converting file:', error);
      throw new Error('Failed to convert file');
    }
  };
  
  // Process all files
  const handleProcessFiles = async () => {
    if (files.length === 0) return;
    
    setStatus('processing');
    setProgress(0);
    setProcessingFile(0);
    setErrorMessage('');
    setConvertedFiles([]);
    
    const newConvertedFiles: ConvertedFile[] = [];
    
    try {
      for (let i = 0; i < files.length; i++) {
        setProcessingFile(i);
        
        const file = files[i];
        const originalSize = file.size;
        
        // Convert the file (JPG to AVIF)
        const convertedBlob = await convertJpgToAvif(file);
        const convertedSize = convertedBlob.size;
        
        // Calculate savings percentage
        const savings = Math.max(0, Math.round((1 - convertedSize / originalSize) * 100));
        
        // Create URL for the converted file
        const { url } = createDownloadUrl(convertedBlob, file.name);
        
        // Add to our converted files array
        newConvertedFiles.push({
          id: i,
          originalName: file.name,
          originalSize,
          convertedSize,
          convertedBlob,
          url,
          savings
        });
        
        // Update progress
        setProgress(Math.round(((i + 1) / files.length) * 100));
      }
      
      setConvertedFiles(newConvertedFiles);
      setStatus('success');
      
    } catch (error) {
      console.error('Conversion error:', error);
      setStatus('error');
      setErrorMessage('An error occurred during conversion. Please try again.');
    }
  };
  
  // Export all converted files as a ZIP
  const handleDownloadAll = async () => {
    if (convertedFiles.length === 0) return;
    
    try {
      const zip = new JSZip();
      
      // Add each converted file to the ZIP
      convertedFiles.forEach(file => {
        const fileExt = jpgToAvif ? '.avif' : '.jpg';
        const fileName = file.originalName.substring(0, file.originalName.lastIndexOf('.')) + fileExt;
        zip.file(fileName, file.convertedBlob);
      });
      
      // Generate the ZIP file
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      
      // Create download link
      const zipUrl = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = zipUrl;
      a.download = 'converted_images.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Clean up
      URL.revokeObjectURL(zipUrl);
      
    } catch (error) {
      console.error('Error creating ZIP:', error);
      setErrorMessage('Failed to create ZIP file. Please try downloading files individually.');
    }
  };
  
  // Download a single converted file
  const handleDownloadFile = (file: ConvertedFile) => {
    const a = document.createElement('a');
    a.href = file.url;
    const fileExt = jpgToAvif ? '.avif' : '.jpg';
    const fileName = file.originalName.substring(0, file.originalName.lastIndexOf('.')) + fileExt;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  
  // UI states based on current status
  const isProcessing = status === 'processing';
  const isSuccess = status === 'success';
  const isError = status === 'error';
  const isIdle = status === 'idle';
  const isReady = status === 'ready';
  
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
      {/* Mode selector (shown but disabled - always jpg to avif) */}
      <div className="flex justify-end mb-4">
        <div className="flex items-center space-x-2">
          <span className={jpgToAvif ? "text-gray-400" : "text-gray-900"}>AVIF to JPG</span>
          <Switch 
            checked={jpgToAvif} 
            onCheckedChange={setJpgToAvif}
            disabled={true}
          />
          <span className={jpgToAvif ? "text-gray-900" : "text-gray-400"}>JPG to AVIF</span>
          <ArrowLeftRight className="ml-2 h-4 w-4 text-gray-400" />
        </div>
      </div>
      
      {/* Drop Zone */}
      {(isIdle || isReady) && (
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-lg p-6 mb-4 transition-all duration-300 cursor-pointer transform hover:scale-[1.01] hover:shadow-md ${
            isDragActive ? "border-primary bg-primary/5" : "border-gray-200 hover:border-primary/50"
          } ${isReady ? "bg-gray-50" : "bg-gray-50/50"}`}
        >
          <input {...getInputProps()} />
          
          <div className="flex flex-col items-center justify-center text-center">
            {isDragActive ? (
              <Cloud className="h-12 w-12 text-primary mb-4 transition-all duration-300 transform hover:scale-110" />
            ) : (
              <Cloud className="h-12 w-12 text-gray-400 mb-4 transition-all duration-300 transform group-hover:text-primary" />
            )}
            
            <p className="text-sm font-medium text-gray-900 mb-1 transition-colors duration-300 hover:text-primary">
              {isDragActive ? "Drop files here..." : "Drag & drop files here"}
            </p>
            <p className="text-xs text-gray-500 mb-3">or click to select files</p>
            
            <div className="text-xs text-gray-400 mt-2">
              {jpgToAvif ? "JPG, JPEG or PNG files only" : "AVIF files only"}
            </div>
          </div>
        </div>
      )}
      
      {/* File List */}
      {files.length > 0 && (
        <div className="mb-4">
          <div className="mb-2 flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-900">{files.length} file(s) selected</h3>
            
            <button 
              onClick={handleClearAll}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Clear all
            </button>
          </div>
          
          <div className="max-h-60 overflow-y-auto border border-gray-100 rounded-md">
            {files.map((file, index) => (
              <div 
                key={`${file.name}-${index}`}
                className="flex items-center justify-between p-3 border-b border-gray-100 last:border-b-0 bg-gray-50 hover:bg-gray-100/80"
              >
                <div className="flex items-center space-x-3">
                  <FileImage className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-800 truncate max-w-xs">{file.name}</p>
                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {isSuccess && convertedFiles[index] && (
                    <>
                      <span className="text-xs text-green-600">
                        {convertedFiles[index].savings}% smaller
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleDownloadFile(convertedFiles[index])}
                      >
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Download</span>
                      </Button>
                    </>
                  )}
                  
                  {(isProcessing && processingFile === index) && (
                    <Loader className="h-4 w-4 text-primary animate-spin" />
                  )}
                  
                  {!isProcessing && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleRemoveFile(index)}
                    >
                      <X className="h-4 w-4" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Error Message */}
      {isError && (
        <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-800 rounded-md flex items-start">
          <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 text-red-500" />
          <div className="text-sm">{errorMessage || 'An error occurred. Please try again.'}</div>
        </div>
      )}
      
      {/* Processing Status */}
      {isProcessing && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-700">Converting {processingFile + 1} of {files.length}</span>
            <span className="text-sm text-gray-700">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}
      
      {/* Success Message */}
      {isSuccess && (
        <div className="mb-4 p-3 bg-green-50 border border-green-100 text-green-800 rounded-md flex items-start">
          <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0 text-green-500" />
          <div>
            <div className="text-sm font-medium">Conversion Complete!</div>
            <div className="text-xs mt-1">
              Total saved: {spaceSavings}% ({formatFileSize(totalOriginalBytes - totalConvertedBytes)})
            </div>
          </div>
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="flex justify-between">
        <div>
          {isSuccess && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleClearAll}
              className="mr-2"
            >
              Start Over
            </Button>
          )}
        </div>
        
        <div className="space-x-2">
          {isReady && (
            <Button
              variant="default"
              size="sm"
              onClick={handleProcessFiles}
              disabled={isProcessing || files.length === 0}
              className="transition-all duration-300 transform hover:scale-105 hover:shadow-md bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
            >
              {isProcessing ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Converting...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:rotate-180" />
                  Convert {files.length > 0 ? `${files.length} ${files.length === 1 ? 'File' : 'Files'}` : 'Files'}
                </>
              )}
            </Button>
          )}
          
          {isSuccess && (
            <Button
              variant="default"
              size="sm"
              onClick={handleDownloadAll}
              className="transition-all duration-300 transform hover:scale-105 hover:shadow-md bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
            >
              <Download className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
              Download All as ZIP
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DropConvert;