import { Card, CardHeader, CardContent } from "@/components/ui/card";

export const InfoSection = () => {
  return (
    <section className="mt-16 max-w-5xl mx-auto">
      <Card>
        <CardHeader className="px-4 py-5 sm:px-6">
          <h2 className="text-lg leading-6 font-medium text-gray-900">About AVIF Format</h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Learn why AVIF is the future of web images</p>
        </CardHeader>
        <CardContent className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Advantages</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Better compression than JPEG, PNG and WebP</li>
                  <li>Supports transparency and animations</li>
                  <li>Higher quality at smaller file sizes</li>
                  <li>Supports HDR and wide color gamut</li>
                </ul>
              </dd>
            </div>
            
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Browser Support</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <ul className="list-disc pl-5 space-y-1">
                  <li>Chrome (version 85+)</li>
                  <li>Firefox (version 93+)</li>
                  <li>Opera (version 71+)</li>
                  <li>Android Chrome (version 85+)</li>
                </ul>
              </dd>
            </div>
            
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500">Use Cases</dt>
              <dd className="mt-1 text-sm text-gray-900">
                <p>AVIF is ideal for websites where image quality and performance are important. It's perfect for e-commerce, photography portfolios, news sites, and any web application where reducing bandwidth while maintaining quality is crucial.</p>
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </section>
  );
};

export default InfoSection;
