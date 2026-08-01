import { Link } from 'react-router-dom';

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),_transparent_35%),linear-gradient(135deg,_#f8fbff_0%,_#f3f6fb_100%)] px-4 py-8 text-slate-800 sm:px-6 lg:px-8 lg:py-12">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 rounded-[32px] border border-slate-200/80 bg-white/90 p-6 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.35)] backdrop-blur sm:p-8 lg:p-10">
        <div className="max-w-3xl rounded-3xl border border-slate-100 bg-slate-50/80 p-5 sm:p-7">
          <div className="inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-blue-700">
            SmartCare HMS
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">Contact us</h1>
          <p className="mt-3 text-base leading-7 text-slate-600">
            Need help with onboarding, implementation, training, or support? Reach out and the SmartCare team will be happy to assist.
          </p>
        </div>

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
              <Link to="/" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:border-blue-500 hover:text-blue-600">
                Back home
              </Link>
              <Link to="/about" className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-all duration-200 hover:border-blue-500 hover:text-blue-600">
                Learn about us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
