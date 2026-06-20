const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>&copy; {new Date().getFullYear()} SmartCare HMS</p>
        <p>NDPR Compliant • NHIS Integrated • MDCN Approved</p>
      </div>
    </footer>
  );
};

export default Footer;