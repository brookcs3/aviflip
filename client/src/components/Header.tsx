import { GithubIcon, Image } from "lucide-react";

export const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 md:py-6">
          <div className="flex items-center">
            <Image className="h-8 w-8 text-primary" />
            <h1 className="ml-2 text-xl font-bold text-gray-900 sm:text-2xl">
              JPG to AVIF Converter
            </h1>
          </div>
          <div>
            <a
              href="https://github.com/brookcs3/aviflip"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-700"
            >
              <GithubIcon className="h-6 w-6" />
              <span className="sr-only">GitHub repository</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
