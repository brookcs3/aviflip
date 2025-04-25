import { useFileConversion } from "@/hooks/use-file-conversion";
import FileUploader from "./FileUploader";
import FileList from "./FileList";

export const ConversionArea = () => {
  const {
    files,
    addFiles,
    removeFile,
    convertFiles,
    resetConverter,
    downloadFile,
    downloadAllFiles,
    isConverting,
  } = useFileConversion();

  const handleFilesAdded = (newFiles) => {
    addFiles(newFiles);
  };

  const handleRemoveFile = (index) => {
    removeFile(files[index].file);
  };

  const handleDownloadFile = (index) => {
    downloadFile(files[index]);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <FileUploader onFilesAdded={handleFilesAdded} />
      <FileList
        files={files}
        onRemoveFile={handleRemoveFile}
        onDownloadFile={handleDownloadFile}
        onConvertFiles={convertFiles}
        onResetConverter={resetConverter}
        onDownloadAllFiles={downloadAllFiles}
        isConverting={isConverting}
      />
    </div>
  );
};

export default ConversionArea;
