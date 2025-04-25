import Footer from "@/components/Footer";
import Header from "@/components/Header";
import HowItWorks from "@/components/HowItWorks";
import TechnicalDetails from "@/components/TechnicalDetails";

export const Home = () => {
  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen flex flex-col">
      <div className="flex-grow">
        <Header />
        
        <main className="py-6 flex-grow">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header Section */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                Convert JPG to AVIF
              </h1>
              <p className="mt-3 text-xl text-gray-500 sm:mt-4">
                Fast, free, and completely private - no files are uploaded to any server
              </p>
            </div>

            {/* We'll add DropConvert soon */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
              <p className="text-center text-gray-600">File converter component loading...</p>
            </div>
            
            <HowItWorks />
            <TechnicalDetails />
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default Home;
