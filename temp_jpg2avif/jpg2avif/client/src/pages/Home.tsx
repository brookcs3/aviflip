import Footer from "@/components/Footer";
import Header from "@/components/Header";
import HowItWorks from "@/components/HowItWorks";
import DropConvert from "@/components/DropConvert";
import TechnicalDetails from "@/components/TechnicalDetails";
import { siteConfig } from "@/config";

export default function Home() {
  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen flex flex-col">
      <div className="flex-grow">
        <Header />
        
        <main className="py-6 flex-grow">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header Section */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                {siteConfig.defaultConversionMode === 'avifToJpg' 
                  ? 'Free AVIF to JPG and PNG Converter - Instant Online Conversion' 
                  : 'Free JPG to AVIF Converter - Instant Online Conversion'}
              </h1>
              <p className="mt-3 text-xl text-gray-500 sm:mt-4">
                Fast, free, and completely private - no files are uploaded to any server
              </p>
            </div>

            <DropConvert />
            <HowItWorks />
            <TechnicalDetails />
            
            {/* FAQ Section */}
            <section className="mt-16 border-t border-gray-200 pt-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">What is the AVIF format?</h3>
                  <p className="mt-2 text-gray-600">
                    AVIF (AV1 Image File Format) is a modern image format that offers superior compression efficiency compared to JPG, PNG, and even WebP formats. 
                    It delivers higher quality images at smaller file sizes, making it ideal for web usage. AVIF is based on the AV1 video codec.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Why convert JPG to AVIF?</h3>
                  <p className="mt-2 text-gray-600">
                    Converting JPG images to AVIF can significantly reduce file sizes while maintaining or even improving visual quality. 
                    This results in faster website loading times, reduced bandwidth usage, and better user experience, especially on mobile devices.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Is {siteConfig.siteName} secure to use?</h3>
                  <p className="mt-2 text-gray-600">
                    Yes, {siteConfig.siteName} processes all conversions entirely in your browser. Your images never leave your device or get uploaded to any server, 
                    ensuring complete privacy and security for your data.
                  </p>
                </div>
              </div>
            </section>
            
            {/* Structured Data for FAQ */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: `
              {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "What is the AVIF format?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "AVIF (AV1 Image File Format) is a modern image format that offers superior compression efficiency compared to JPG, PNG, and even WebP formats. It delivers higher quality images at smaller file sizes, making it ideal for web usage. AVIF is based on the AV1 video codec."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Why convert JPG to AVIF?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Converting JPG images to AVIF can significantly reduce file sizes while maintaining or even improving visual quality. This results in faster website loading times, reduced bandwidth usage, and better user experience, especially on mobile devices."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "Is ${siteConfig.siteName} secure to use?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "Yes, ${siteConfig.siteName} processes all conversions entirely in your browser. Your images never leave your device or get uploaded to any server, ensuring complete privacy and security for your data."
                    }
                  }
                ]
              }
            `}} />
          </div>
        </main>
        
        <Footer />
      </div>
    </div>
  );
}
