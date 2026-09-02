import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PublicPageShell from '../components/PublicPageShell';
import { fetchPublicBranding, defaultPublicBranding } from '../utils/publicBranding';

const ContactPage = () => {
  const [brand, setBrand] = useState(defaultPublicBranding);

  useEffect(() => {
    let isMounted = true;
    fetchPublicBranding().then((branding) => {
      if (isMounted) setBrand(branding);
    });
    return () => { isMounted = false; };
  }, []);

  return (
    <PublicPageShell
      title={brand.contact.title}
      subtitle={brand.contact.subtitle}
      brand={brand}
    >
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Support channels</h2>
          <div className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="font-medium text-slate-800">Email</p>
              <p>{brand.contact.email}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="font-medium text-slate-800">Phone</p>
              <p>{brand.contact.phone}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="font-medium text-slate-800">Hours</p>
              <p>{brand.contact.hours}</p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-6">
          <h2 className="text-lg font-semibold text-slate-900">Quick links</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link to="/" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:border-[#0B6E4F] hover:text-[#0B6E4F]">
              Back home
            </Link>
            <Link to="/about" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:border-[#0B6E4F] hover:text-[#0B6E4F]">
              Learn about us
            </Link>
          </div>
        </div>
      </div>
    </PublicPageShell>
  );
};

export default ContactPage;
