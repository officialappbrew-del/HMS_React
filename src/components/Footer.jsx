import { Link } from 'react-router-dom';

const footerLinks = [
  { label: 'About', to: '/about' },
  { label: 'Privacy', to: '/privacy' },
  { label: 'Terms', to: '/terms' },
  { label: 'Contact', to: '/contact' },
];

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>&copy; {new Date().getFullYear()} SmartCare HMS</p>
        <div className="flex flex-wrap items-center gap-3">
          {footerLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="transition hover:text-blue-600"
            >
              {link.label}
            </Link>
          ))}
        </div>
        <p>NDPR Compliant • NHIS Integrated • MDCN Approved</p>
      </div>
    </footer>
  );
};

export default Footer;