import { GithubIcon } from "lucide-react";

export const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <svg className="h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 100-16 8 8 0 000 16zM10.622 8.415l4.879 2.616c.449.264.449.69 0 .949l-4.879 2.616c-.478.265-.97.03-.97-.44v-5.3c0-.47.492-.705.97-.44z"/>
            </svg>
            <h1 className="ml-2 text-xl font-bold text-gray-900 sm:text-2xl">
              JPG to AVIF Converter
            </h1>
          </div>
          <div>
            <a
              href="https://github.com/brookcs3/aviflip"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-primary transition-colors"
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
