import PublicPageShell from '../components/PublicPageShell';

const InfoPage = ({ title, summary, highlights = [], bullets = [], brand = null }) => {
  return (
    <PublicPageShell title={title} subtitle={summary} brand={brand}>
      <div className="grid gap-4 lg:grid-cols-2">
        {highlights.map((item) => (
          <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">{item.title}</h2>
            <p className="mt-2 text-sm leading-7 text-slate-600">{item.description}</p>
          </div>
        ))}
      </div>

      {bullets.length > 0 && (
        <div className="rounded-3xl border border-slate-200 bg-slate-50/80 p-5 sm:p-7">
          <h2 className="text-lg font-semibold text-slate-900">Key points</h2>
          <ul className="mt-4 grid gap-3 text-sm leading-7 text-slate-600 sm:grid-cols-2">
            {bullets.map((bullet) => (
              <li key={bullet} className="flex gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-3">
                <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-[#0B6E4F]" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </PublicPageShell>
  );
};

export default InfoPage;
