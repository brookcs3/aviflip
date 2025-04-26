import { useState } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ConvertedFile } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

export type FileWithPreview = File & {
  preview?: string;
};

export type FileStatus = 'pending' | 'converting' | 'converted' | 'error';

export type FileWithStatus = {
  file: FileWithPreview;
  status: FileStatus;
  id?: number;
  convertedData?: ConvertedFile;
  error?: string;
};

export const useFileConversion = () => {
  const [files, setFiles] = useState<FileWithStatus[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const convertMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await apiRequest('POST', '/api/convert', formData, true);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to convert file');
      }
      
      return await response.json() as ConvertedFile;
    },
    onSuccess: (data, variables) => {
      // Update the file status
      setFiles(prevFiles => 
        prevFiles.map(fileItem => 
          fileItem.file === variables 
            ? { 
                ...fileItem, 
                status: 'converted', 
                convertedData: data,
                id: data.id 
              } 
            : fileItem
        )
      );
      
      toast({
        title: 'Conversion successful',
        description: `${variables.name} has been converted to AVIF format`,
        variant: 'success',
      });
      
      // Invalidate any queries that might need refreshing
      queryClient.invalidateQueries({ queryKey: ['/api/recent'] });
    },
    onError: (error, variables) => {
      setFiles(prevFiles => 
        prevFiles.map(fileItem => 
          fileItem.file === variables 
            ? { 
                ...fileItem, 
                status: 'error', 
                error: error instanceof Error ? error.message : 'Unknown error' 
              } 
            : fileItem
        )
      );
      
      toast({
        title: 'Conversion failed',
        description: error instanceof Error ? error.message : 'Failed to convert file',
        variant: 'destructive',
      });
    }
  });

  const addFiles = (newFiles: FileWithPreview[]) => {
    // Filter out files that are not JPG/JPEG
    const validFiles = newFiles.filter(file => {
      const isJpeg = file.type === 'image/jpeg' || file.name.toLowerCase().endsWith('.jpg') || file.name.toLowerCase().endsWith('.jpeg');
      
      if (!isJpeg) {
        toast({
          title: 'Invalid file type',
          description: `${file.name} is not a JPG image`,
          variant: 'destructive',
        });
        return false;
      }
      
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: 'File too large',
          description: `${file.name} exceeds the 10MB limit`,
          variant: 'destructive',
        });
        return false;
      }
      
      return true;
    });
    
    // Create file previews
    const filesWithPreviews = validFiles.map(file => {
      if (!file.preview) {
        file.preview = URL.createObjectURL(file);
      }
      return { file, status: 'pending' as FileStatus };
    });
    
    // Add files to state if there are any valid ones
    if (filesWithPreviews.length > 0) {
      setFiles(prevFiles => [...prevFiles, ...filesWithPreviews]);
    }
    
    return filesWithPreviews.length;
  };

  const removeFile = (fileToRemove: FileWithPreview) => {
    setFiles(prevFiles => prevFiles.filter(fileItem => fileItem.file !== fileToRemove));
    
    // Revoke object URL to prevent memory leaks
    if (fileToRemove.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
  };

  const convertFiles = async () => {
    // Find all pending files
    const pendingFiles = files.filter(fileItem => fileItem.status === 'pending');
    
    if (pendingFiles.length === 0) {
      toast({
        title: 'No files to convert',
        description: 'Please add some files first',
        variant: 'destructive',
      });
      return;
    }
    
    // Update status to converting
    setFiles(prevFiles => 
      prevFiles.map(fileItem => 
        fileItem.status === 'pending' 
          ? { ...fileItem, status: 'converting' } 
          : fileItem
      )
    );
    
    // Convert each file sequentially
    for (const fileItem of pendingFiles) {
      await convertMutation.mutateAsync(fileItem.file);
    }
  };

  const resetConverter = () => {
    // Revoke all object URLs
    files.forEach(fileItem => {
      if (fileItem.file.preview) {
        URL.revokeObjectURL(fileItem.file.preview);
      }
    });
    
    // Clear files
    setFiles([]);
  };

  // Function to download a converted file
  const downloadFile = (fileItem: FileWithStatus) => {
    if (fileItem.status !== 'converted' || !fileItem.convertedData) {
      toast({
        title: 'Cannot download',
        description: 'File has not been converted yet',
        variant: 'destructive',
      });
      return;
    }
    
    // Create an anchor element and trigger download
    const link = document.createElement('a');
    link.href = fileItem.convertedData.url;
    link.download = fileItem.convertedData.convertedName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to download all converted files
  const downloadAllFiles = () => {
    const convertedFiles = files.filter(fileItem => 
      fileItem.status === 'converted' && fileItem.convertedData
    );
    
    if (convertedFiles.length === 0) {
      toast({
        title: 'No files to download',
        description: 'Convert some files first',
        variant: 'destructive',
      });
      return;
    }
    
    // Download each file with a small delay
    convertedFiles.forEach((fileItem, index) => {
      setTimeout(() => {
        downloadFile(fileItem);
      }, index * 500); // 500ms delay between downloads
    });
  };

  return {
    files,
    addFiles,
    removeFile,
    convertFiles,
    resetConverter,
    downloadFile,
    downloadAllFiles,
    isConverting: convertMutation.isPending,
  };
};
