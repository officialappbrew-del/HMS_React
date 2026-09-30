import MessagingPanel from '../components/MessagingPanel';

const MessagingCenter = () => (
  <main className="mx-auto w-full max-w-[1440px] p-4 sm:p-6 lg:p-8">
    <div className="mb-5 flex items-end justify-between gap-4">
      <div><p className="text-xs font-semibold uppercase text-teal-700">Care coordination</p><h1 className="mt-1 text-2xl font-semibold text-slate-900">Messages</h1></div>
    </div>
    <MessagingPanel />
  </main>
);

export default MessagingCenter;