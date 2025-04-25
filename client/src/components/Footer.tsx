export const Footer = () => {
  return (
    <footer className="bg-white mt-16">
      <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
        <p className="text-center text-base text-gray-500">
          &copy; {new Date().getFullYear()} JPG to AVIF Converter. All rights reserved.
        </p>
        <p className="text-center text-sm text-gray-500 mt-2">
          Originally based on{" "}
          <a
            href="https://github.com/brookcs3/aviflip"
            className="text-primary hover:text-primary/80"
            target="_blank"
            rel="noopener noreferrer"
          >
            aviflip
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
