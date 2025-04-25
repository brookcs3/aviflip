import { FileWithStatus } from "@/hooks/use-file-conversion";
import { X, Image, ArrowRight, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface FileListProps {
  files: FileWithStatus[];
  onRemoveFile: (fileIndex: number) => void;
  onDownloadFile: (fileIndex: number) => void;
  onConvertFiles: () => void;
  onResetConverter: () => void;
  onDownloadAllFiles: () => void;
  isConverting: boolean;
}

export const FileList = ({
  files,
  onRemoveFile,
  onDownloadFile,
  onConvertFiles,
  onResetConverter,
  onDownloadAllFiles,
  isConverting,
}: FileListProps) => {
  const pendingFiles = files.filter(f => f.status === 'pending');
  const convertingFiles = files.filter(f => f.status === 'converting');
  const convertedFiles = files.filter(f => f.status === 'converted' && f.convertedData);
  const errorFiles = files.filter(f => f.status === 'error');
  
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };
  
  if (files.length === 0) {
    return (
      <div className="text-center py-10">
        <Image className="mx-auto h-16 w-16 text-gray-300" />
        <h3 className="mt-4 text-sm font-medium text-gray-900">No files selected</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by uploading a JPG file</p>
      </div>
    );
  }
  
  return (
    <div className="p-5 space-y-6">
      {pendingFiles.length > 0 && (
        <div>
          <h3 className="text-base font-medium text-gray-900 mb-3">Files to Convert</h3>
          <div className="space-y-3">
            {pendingFiles.map((fileItem, index) => (
              <div 
                key={`pending-${index}`} 
                className="bg-gray-50 rounded-md p-3 border border-gray-100 flex items-center justify-between"
              >
                <div className="flex items-center">
                  <div className="h-9 w-9 flex items-center justify-center bg-gray-100 rounded-md">
                    <Image className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-gray-800">{fileItem.file.name}</h4>
                    <p className="text-xs text-gray-500">{formatFileSize(fileItem.file.size)}</p>
                  </div>
                </div>
                <button 
                  className="text-gray-400 hover:text-gray-600 focus:outline-none"
                  onClick={() => onRemoveFile(files.indexOf(fileItem))}
                  disabled={isConverting}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {convertingFiles.length > 0 && (
        <div>
          <h3 className="text-base font-medium text-gray-900 mb-3">Converting</h3>
          <div className="space-y-3">
            {convertingFiles.map((fileItem, index) => (
              <div key={`converting-${index}`} className="bg-gray-50 rounded-md p-3 border border-primary/20">
                <div className="flex items-center">
                  <div className="h-9 w-9 flex items-center justify-center bg-primary/10 rounded-md">
                    <Loader2 className="h-5 w-5 text-primary animate-spin" />
                  </div>
                  <div className="ml-3 flex-1">
                    <h4 className="text-sm font-medium text-gray-800">{fileItem.file.name}</h4>
                    <div className="mt-2">
                      <Progress className="h-1.5" value={50} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {errorFiles.length > 0 && (
        <div>
          <h3 className="text-base font-medium text-gray-900 mb-3">Failed Conversions</h3>
          <div className="space-y-3">
            {errorFiles.map((fileItem, index) => (
              <div key={`error-${index}`} className="bg-red-50 rounded-md p-3 border border-red-100">
                <div className="flex items-center">
                  <div className="h-9 w-9 flex items-center justify-center bg-red-100 rounded-md">
                    <Image className="h-5 w-5 text-red-500" />
                  </div>
                  <div className="ml-3 flex-1">
                    <h4 className="text-sm font-medium text-gray-800">{fileItem.file.name}</h4>
                    <p className="text-xs text-red-500 mt-1">{fileItem.error || 'Conversion failed'}</p>
                  </div>
                  <button 
                    className="text-gray-400 hover:text-gray-600 focus:outline-none"
                    onClick={() => onRemoveFile(files.indexOf(fileItem))}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {convertedFiles.length > 0 && (
        <div>
          <h3 className="text-base font-medium text-gray-900 mb-3">Converted Files</h3>
          <div className="space-y-3">
            {convertedFiles.map((fileItem, index) => {
              const fileData = fileItem.convertedData!;
              return (
                <div key={`converted-${index}`} className="bg-gray-50 rounded-md p-3 border border-gray-100">
                  <div className="sm:flex sm:items-center sm:justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12 bg-gray-100 rounded-md overflow-hidden">
                        {fileItem.file.preview && (
                          <img 
                            src={fileItem.file.preview} 
                            alt="Preview" 
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-gray-800">{fileData.convertedName}</h4>
                        <div className="mt-1 flex items-center">
                          <span className="text-xs text-gray-500">{formatFileSize(fileData.originalSize)}</span>
                          <ArrowRight className="mx-1 h-3 w-3 text-gray-400" />
                          <span className="text-xs text-green-600 font-medium">{formatFileSize(fileData.convertedSize)}</span>
                          <Badge variant="outline" className="ml-2 text-xs bg-green-50 text-green-600 hover:bg-green-50 border-green-100">
                            -{fileData.savings}%
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 sm:mt-0">
                      <Button 
                        onClick={() => onDownloadFile(files.indexOf(fileItem))}
                        className="h-8 px-3 text-xs bg-primary hover:bg-primary/90"
                        size="sm"
                      >
                        <Download className="mr-1 h-3 w-3" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      <div className="pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:justify-between gap-3">
        <Button 
          onClick={onConvertFiles} 
          disabled={pendingFiles.length === 0 || isConverting}
          className="bg-primary hover:bg-primary/90 text-white py-2 rounded-md text-sm font-medium"
          size="default"
        >
          {isConverting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Converting...
            </>
          ) : (
            <>
              <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Convert to AVIF
            </>
          )}
        </Button>
        <Button 
          variant="outline" 
          onClick={onResetConverter}
          disabled={isConverting}
          className="border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium"
          size="default"
        >
          Clear All
        </Button>
      </div>
      
      {convertedFiles.length > 0 && (
        <div className="mt-3">
          <Button 
            onClick={onDownloadAllFiles}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md text-sm font-medium"
            size="default"
          >
            <Download className="mr-2 h-4 w-4" />
            Download All Files
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileList;
