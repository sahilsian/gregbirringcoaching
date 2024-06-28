import siteConfig from "../../../site.config";

/**
 * Renders Footer of the application.
 * @function Layout
 * @returns {JSX.Element} - Rendered component
 */
const Footer = () => (
  <footer className="hidden md:block w-full md:w-11/12 sm:mt-[14rem] sm:bottom-0 px-6 md:mb-2 mx-auto text-center bg-white border border-gray-300 rounded-lg shadow">
    <div className="p-6">
      Copyright &copy; {new Date().getFullYear()} {siteConfig.texts.footer.copyright}
    </div>
  </footer>
);

export default Footer;
