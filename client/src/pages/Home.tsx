import Header from "@/components/Header";
import ConversionArea from "@/components/ConversionArea";
import InfoSection from "@/components/InfoSection";
import Footer from "@/components/Footer";

export const Home = () => {
  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Convert JPG to AVIF</h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Transform your JPG images to the modern AVIF format for better compression and quality.
          </p>
        </section>
        
        {/* Conversion Area */}
        <ConversionArea />
        
        {/* Info Section */}
        <InfoSection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;
