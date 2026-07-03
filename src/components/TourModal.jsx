import { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Play } from 'lucide-react';

const slides = [
  {
    id: 'dashboard',
    title: 'Command Center Dashboard',
    subtitle: 'Real-time hospital operations at a glance',
    accent: 'from-blue-600 to-indigo-700',
    mockup: (
      <div className="bg-slate-900 rounded-xl p-5 shadow-inner border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-blue-400 font-semibold text-sm">SmartCare Command Center</div>
            <div className="text-slate-400 text-xs">Live overview</div>
          </div>
          <div className="flex items-center gap-2 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-emerald-400 text-xs font-medium">Live</span>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-3 mb-4">
          {[
            { label: 'Active Patients', value: '342', color: 'text-blue-400' },
            { label: 'Bed Occupancy', value: '87%', color: 'text-teal-400' },
            { label: 'Appointments', value: '24', color: 'text-emerald-400' },
            { label: 'Critical Cases', value: '5', color: 'text-amber-400' }
          ].map((item, i) => (
            <div key={i} className="bg-slate-800/60 rounded-lg p-3 border border-slate-700/50">
              <div className={`text-xl font-bold ${item.color}`}>{item.value}</div>
              <div className="text-slate-400 text-xs">{item.label}</div>
            </div>
          ))}
        </div>
        <div className="bg-slate-800/40 rounded-lg p-3 border border-slate-700/50 space-y-2">
          {[
            'New patient registered — Grace Adebayo',
            'Lab results updated — 12 tests completed',
            'Pharmacy order dispensed — 45 medications'
          ].map((text, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
              <span>{text}</span>
              <span className="ml-auto text-slate-500">{['2m', '15m', '1h'][i]} ago</span>
            </div>
          ))}
        </div>
      </div>
    )
  },
  {
    id: 'patients',
    title: 'Patient Management',
    subtitle: 'Unified records, smarter care coordination',
    accent: 'from-teal-600 to-teal-700',
    mockup: (
      <div className="bg-white rounded-xl p-5 shadow-lg border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-slate-900 font-semibold text-sm">Patient Records</div>
            <div className="text-slate-500 text-xs">Search, register, and track patients</div>
          </div>
          <div className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full border border-teal-100 text-xs font-medium">
            1,240 Active
          </div>
        </div>
        <div className="space-y-3">
          {[
            { name: 'Grace Adebayo', id: 'PT-20492', status: 'Inpatient', ward: 'Ward A2' },
            { name: 'Chidi Okafor', id: 'PT-20493', status: 'Outpatient', ward: 'OPD-3' },
            { name: 'Amina Bello', id: 'PT-20494', status: 'Emergency', ward: 'ER-1' }
          ].map((p, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white text-xs font-bold">
                  {p.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="text-slate-900 text-sm font-medium">{p.name}</div>
                  <div className="text-slate-500 text-xs">{p.id}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-slate-900 text-xs font-medium">{p.status}</div>
                <div className="text-slate-500 text-xs">{p.ward}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  },
  {
    id: 'emr',
    title: 'Clinical EMR',
    subtitle: 'Nigerian clinical templates and smart notes',
    accent: 'from-violet-600 to-violet-700',
    mockup: (
      <div className="bg-white rounded-xl p-5 shadow-lg border border-slate-200">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-violet-50 p-2 rounded-lg border border-violet-100">
            <div className="w-5 h-5 bg-violet-600 rounded" />
          </div>
          <div>
            <div className="text-slate-900 font-semibold text-sm">Patient Chart</div>
            <div className="text-slate-500 text-xs">Grace Adebayo — Female, 34y</div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {['Vitals', 'Diagnosis', 'Prescription'].map((tab, i) => (
            <div key={i} className={`p-2 rounded-lg text-center text-xs font-medium border ${i === 0 ? 'bg-violet-50 border-violet-200 text-violet-700' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
              {tab}
            </div>
          ))}
        </div>
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
            <div className="text-slate-900 text-xs font-semibold mb-2">Vitals</div>
            <div className="grid grid-cols-4 gap-2">
              {['BP 120/80', 'Temp 37°C', 'HR 72', 'SpO2 98%'].map((v, i) => (
                <div key={i} className="bg-white rounded-md p-2 border border-slate-200 text-center">
                  <div className="text-slate-900 text-xs font-medium">{v.split(' ')[0]}</div>
                  <div className="text-slate-500 text-[10px]">{v.split(' ').slice(1).join(' ')}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
            <div className="text-slate-900 text-xs font-semibold mb-2">Diagnosis</div>
            <div className="text-slate-600 text-xs">Malaria (Uncomplicated) — ICD-10: B50</div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'pharmacy',
    title: 'Pharmacy & Inventory',
    subtitle: 'NAFDAC-compliant medication management',
    accent: 'from-amber-600 to-amber-700',
    mockup: (
      <div className="bg-white rounded-xl p-5 shadow-lg border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-slate-900 font-semibold text-sm">Pharmacy Inventory</div>
            <div className="text-slate-500 text-xs">Stock levels and dispensing</div>
          </div>
          <div className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full border border-amber-100 text-xs font-medium">
            48 Low Stock
          </div>
        </div>
        <div className="space-y-3">
          {[
            { drug: 'Artemether/Lumefantrine', stock: '2,340 units', status: 'In Stock', nafdac: '04-1234' },
            { drug: 'Paracetamol 500mg', stock: '5,120 units', status: 'In Stock', nafdac: '04-5678' },
            { drug: 'Amlodipine 5mg', stock: '12 units', status: 'Low Stock', nafdac: '04-9012' }
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
              <div>
                <div className="text-slate-900 text-sm font-medium">{item.drug}</div>
                <div className="text-slate-500 text-xs">NAFDAC: {item.nafdac}</div>
              </div>
              <div className="text-right">
                <div className="text-slate-900 text-xs font-medium">{item.stock}</div>
                <div className={`text-xs ${item.status === 'In Stock' ? 'text-emerald-600' : 'text-amber-600'}`}>{item.status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  },
  {
    id: 'billing',
    title: 'Billing & Revenue Cycle',
    subtitle: 'NHIS claims, multi-payer billing, collections',
    accent: 'from-emerald-600 to-emerald-700',
    mockup: (
      <div className="bg-white rounded-xl p-5 shadow-lg border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-slate-900 font-semibold text-sm">Revenue Overview</div>
            <div className="text-slate-500 text-xs">July 2026</div>
          </div>
          <div className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-100 text-xs font-medium">
            98.5% Collection
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-4">
          {[
            { label: 'Billed', value: '₦4.2M' },
            { label: 'Received', value: '₦3.9M' },
            { label: 'Pending', value: '₦300K' }
          ].map((item, i) => (
            <div key={i} className="bg-slate-50 rounded-lg p-3 border border-slate-100 text-center">
              <div className="text-slate-900 text-sm font-bold">{item.value}</div>
              <div className="text-slate-500 text-xs">{item.label}</div>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          {['NHIS Claim — ₦1.2M', 'HMO Reliance — ₦850K', 'Private Pay — ₦1.85M'].map((item, i) => (
            <div key={i} className="flex items-center justify-between p-2 rounded-md bg-slate-50 border border-slate-100">
              <span className="text-slate-700 text-xs">{item.split('—')[0]}</span>
              <span className="text-slate-900 text-xs font-medium">{item.split('—')[1]}</span>
            </div>
          ))}
        </div>
      </div>
    )
  },
  {
    id: 'analytics',
    title: 'Analytics & Insights',
    subtitle: 'Operational intelligence for better decisions',
    accent: 'from-blue-600 to-indigo-700',
    mockup: (
      <div className="bg-white rounded-xl p-5 shadow-lg border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-slate-900 font-semibold text-sm">Performance Analytics</div>
            <div className="text-slate-500 text-xs">Departmental KPIs</div>
          </div>
          <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-100 text-xs font-medium">
            This Month
          </div>
        </div>
        <div className="space-y-3">
          {[
            { dept: 'Emergency', score: '94%', trend: '+2.4%' },
            { dept: 'Outpatient', score: '91%', trend: '+1.8%' },
            { dept: 'Laboratory', score: '97%', trend: '+0.5%' },
            { dept: 'Pharmacy', score: '89%', trend: '-0.3%' }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-700 text-xs font-medium">{item.dept}</span>
                  <span className="text-slate-900 text-xs font-bold">{item.score}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div
                    className="bg-blue-600 h-1.5 rounded-full"
                    style={{ width: item.score }}
                  />
                </div>
              </div>
              <span className={`text-xs font-medium ${item.trend.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}`}>
                {item.trend}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  },
  {
    id: 'security',
    title: 'Security & Compliance',
    subtitle: 'HIPAA, NDPR, ISO 27001 certified',
    accent: 'from-emerald-600 to-teal-700',
    mockup: (
      <div className="bg-slate-900 rounded-xl p-5 shadow-inner border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-white font-semibold text-sm">Security Status</div>
            <div className="text-slate-400 text-xs">All systems compliant</div>
          </div>
          <div className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20 text-xs font-medium">
            Secured
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          {['HIPAA', 'NDPR', 'ISO 27001', 'NHIS Accredited'].map((badge, i) => (
            <div key={i} className="bg-slate-800/60 rounded-lg p-3 border border-slate-700/50 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <div className="w-3 h-3 bg-emerald-400 rounded-full" />
              </div>
              <div>
                <div className="text-white text-xs font-medium">{badge}</div>
                <div className="text-slate-400 text-[10px]">Certified</div>
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          {['End-to-End Encryption', 'Role-Based Access Control', 'Audit Trails & Logging', 'Two-Factor Authentication'].map((feature, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
              <div className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              </div>
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }
];

const TourModal = ({ isOpen, onClose }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      setCurrent(0);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const slide = slides[current];

  const goTo = (index) => setCurrent(index);
  const next = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{slide.title}</h2>
            <p className="text-sm text-gray-500">{slide.subtitle}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 mr-2">
              {current + 1} / {slides.length}
            </span>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors p-1"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className={`rounded-2xl bg-gradient-to-br ${slide.accent} p-1 mb-6`}>
            <div className="bg-white rounded-xl p-4">
              {slide.mockup}
            </div>
          </div>
        </div>

        <div className="p-5 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={prev}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>

          <div className="flex items-center gap-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all ${
                  i === current ? 'w-6 bg-gray-900' : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to ${s.title}`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-all"
          >
            {current === slides.length - 1 ? 'Finish' : 'Next'}
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TourModal;
// Tour modal component for interactive slideshow
