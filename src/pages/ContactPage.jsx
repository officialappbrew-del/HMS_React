import { Link } from 'react-router-dom';
import PublicPageShell from '../components/PublicPageShell';

const ContactPage = () => {
  return (
    <PublicPageShell
      title="Contact us"
      subtitle="Need help with onboarding, implementation, training, or support? Reach out and the SmartCare team will be happy to assist."
    >
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Support channels</h2>
          <div className="mt-4 space-y-3 text-sm leading-7 text-slate-600">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="font-medium text-slate-800">Email</p>
              <p>official.appbrew@gmail.com</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="font-medium text-slate-800">Phone</p>
              <p>+234 814 695 5393</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="font-medium text-slate-800">Hours</p>
              <p>Monday to Friday, 8:00 AM to 6:00 PM</p>
              <p>Saturday, 9:00 AM to 12:00 PM</p>
              <p>Sunday, 10:00 AM to 4:00 PM</p>
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
