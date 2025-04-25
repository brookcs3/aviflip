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
    <div className="space-y-8">
      {pendingFiles.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Files to Convert</h3>
          <div className="space-y-4">
            {pendingFiles.map((fileItem, index) => (
              <div 
                key={`pending-${index}`} 
                className="bg-white shadow-sm rounded-xl p-4 border border-gray-200 flex items-center justify-between transition hover:shadow-md"
              >
                <div className="flex items-center">
                  <div className="h-10 w-10 flex items-center justify-center bg-blue-50 rounded-lg">
                    <Image className="h-6 w-6 text-primary" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-900">{fileItem.file.name}</h4>
                    <p className="text-xs text-gray-500">{formatFileSize(fileItem.file.size)}</p>
                  </div>
                </div>
                <button 
                  className="text-gray-400 hover:text-gray-500 focus:outline-none transition-colors"
                  onClick={() => onRemoveFile(files.indexOf(fileItem))}
                  disabled={isConverting}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {convertingFiles.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Converting...</h3>
          <div className="space-y-4">
            {convertingFiles.map((fileItem, index) => (
              <div key={`converting-${index}`} className="bg-white shadow-sm rounded-xl p-4 border border-primary/30 bg-blue-50/50">
                <div className="flex items-center">
                  <div className="h-10 w-10 flex items-center justify-center bg-blue-100 rounded-lg">
                    <Loader2 className="h-6 w-6 text-primary animate-spin" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{fileItem.file.name}</h4>
                    <div className="mt-2">
                      <Progress className="h-2" value={30} />
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
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Failed Conversions</h3>
          <div className="space-y-4">
            {errorFiles.map((fileItem, index) => (
              <div key={`error-${index}`} className="bg-white shadow-sm rounded-xl p-4 border border-red-200 bg-red-50">
                <div className="flex items-center">
                  <div className="h-10 w-10 flex items-center justify-center bg-red-100 rounded-lg">
                    <Image className="h-6 w-6 text-red-400" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{fileItem.file.name}</h4>
                    <p className="text-xs text-red-500 mt-1">{fileItem.error || 'Failed to convert'}</p>
                  </div>
                  <button 
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={() => onRemoveFile(files.indexOf(fileItem))}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {convertedFiles.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Converted Files</h3>
          <div className="space-y-4">
            {convertedFiles.map((fileItem, index) => {
              const fileData = fileItem.convertedData!;
              return (
                <div key={`converted-${index}`} className="bg-white shadow-sm rounded-xl p-4 border border-gray-200 hover:shadow-md transition">
                  <div className="sm:flex sm:items-center sm:justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-16 w-16 bg-gray-100 rounded-lg overflow-hidden">
                        {fileItem.file.preview && (
                          <img 
                            src={fileItem.file.preview} 
                            alt="Preview" 
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <div className="ml-4">
                        <h4 className="text-sm font-medium text-gray-900">{fileData.convertedName}</h4>
                        <div className="mt-1 flex items-center">
                          <span className="text-xs text-gray-500">{formatFileSize(fileData.originalSize)}</span>
                          <ArrowRight className="mx-1 h-4 w-4 text-gray-400" />
                          <span className="text-xs text-green-600 font-medium">{formatFileSize(fileData.convertedSize)}</span>
                          <Badge variant="outline" className="ml-2 bg-green-100 text-green-600 hover:bg-green-100 border-green-200">
                            -{fileData.savings}%
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 sm:mt-0">
                      <Button 
                        onClick={() => onDownloadFile(files.indexOf(fileItem))}
                        className="inline-flex items-center bg-primary hover:bg-primary/90"
                      >
                        <Download className="-ml-1 mr-2 h-4 w-4" />
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
      
      <div className="mt-8 flex flex-col sm:flex-row sm:justify-between gap-4">
        <Button 
          onClick={onConvertFiles} 
          disabled={pendingFiles.length === 0 || isConverting}
          className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg transition shadow-sm"
          size="lg"
        >
          {isConverting ? (
            <>
              <Loader2 className="-ml-1 mr-2 h-5 w-5 animate-spin" />
              Converting...
            </>
          ) : (
            <>
              <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          className="border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Clear All
        </Button>
      </div>
      
      {convertedFiles.length > 0 && (
        <div className="mt-4">
          <Button 
            onClick={onDownloadAllFiles}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg transition shadow-sm"
            size="lg"
          >
            <Download className="-ml-1 mr-2 h-5 w-5" />
            Download All Files
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileList;
