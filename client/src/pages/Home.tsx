import Header from "@/components/Header";
import ConversionArea from "@/components/ConversionArea";
import InfoSection from "@/components/InfoSection";
import Footer from "@/components/Footer";

export const Home = () => {
  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow py-6">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <section className="text-center mb-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
              Convert JPG to AVIF
            </h1>
            <p className="mt-3 text-xl text-gray-500 sm:mt-4">
              Fast, free, and completely private - no files are uploaded to any server
            </p>
          </section>
          
          {/* Conversion Area */}
          <ConversionArea />
          
          {/* Info Section */}
          <InfoSection />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;
