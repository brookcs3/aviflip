import { GithubIcon } from "lucide-react";

export const Header = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <svg className="h-7 w-7 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.423 8.397l-12-7a1 1 0 0 0-1.007-.033A1 1 0 0 0 6 2v16a1 1 0 0 0 .416.736 1 1 0 0 0 .578.264 1 1 0 0 0 .429-.067l12-7a1 1 0 0 0 0-1.736z"/>
            </svg>
            <h1 className="ml-2 text-lg font-semibold text-gray-900">
              JPG to AVIF
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/brookcs3/aviflip"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <GithubIcon className="h-5 w-5" />
              <span className="sr-only">GitHub repository</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
