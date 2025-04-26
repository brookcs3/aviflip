import { Upload, RefreshCw, Download } from "lucide-react";

const HowItWorks = () => {
  return (
    <div className="mb-8 bg-white rounded-lg shadow-sm p-5">
      <h2 className="text-lg font-medium text-gray-900 mb-4">How It Works</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Step 1 */}
        <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-primary/30 hover:bg-gray-50/80 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-sm group cursor-pointer">
          <div className="bg-primary/10 p-2.5 rounded-md transition-all duration-300 group-hover:bg-primary/20">
            <Upload className="h-5 w-5 text-primary transition-all duration-300 group-hover:scale-110" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-800 transition-colors duration-300 group-hover:text-primary">1. Drop Files</h3>
            <p className="text-xs text-gray-500 mt-1">
              Drop your JPG files into the converter
            </p>
          </div>
        </div>
        
        {/* Step 2 */}
        <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-primary/30 hover:bg-gray-50/80 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-sm group cursor-pointer">
          <div className="bg-primary/10 p-2.5 rounded-md transition-all duration-300 group-hover:bg-primary/20">
            <RefreshCw className="h-5 w-5 text-primary transition-all duration-300 group-hover:scale-110" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-800 transition-colors duration-300 group-hover:text-primary">2. Convert</h3>
            <p className="text-xs text-gray-500 mt-1">
              Process entirely in your browser
            </p>
          </div>
        </div>
        
        {/* Step 3 */}
        <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-primary/30 hover:bg-gray-50/80 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-sm group cursor-pointer">
          <div className="bg-primary/10 p-2.5 rounded-md transition-all duration-300 group-hover:bg-primary/20">
            <Download className="h-5 w-5 text-primary transition-all duration-300 group-hover:scale-110" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-800 transition-colors duration-300 group-hover:text-primary">3. Download</h3>
            <p className="text-xs text-gray-500 mt-1">
              Get your AVIFs individually or as a ZIP
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;