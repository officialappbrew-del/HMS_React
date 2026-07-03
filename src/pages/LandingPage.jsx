import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';

// We'll dynamically load icons from `lucide-react` after the first paint/idle.
// This avoids bundling the full icon set into the initial landing-page chunk.

const SmartCareHMSRedesigned = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [hoveredModule, setHoveredModule] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [counterValues, setCounterValues] = useState([0, 0, 0, 0, 0]);
  
  const sectionRefs = useRef({});
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const [icons, setIcons] = useState(null);
  const [isReady, setIsReady] = useState(false);

  // Mark component ready during idle time to defer heavy animations and listeners
  useEffect(() => {
    const markReady = () => setIsReady(true);
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      // give it a small timeout to ensure first paint
      requestIdleCallback(markReady, { timeout: 1000 });
    } else {
      const t = setTimeout(markReady, 600);
      return () => clearTimeout(t);
    }
  }, []);

  // Dynamically import icons after idle to avoid large initial bundle
  useEffect(() => {
    if (!isReady) return;
    let cancelled = false;
    (async () => {
      try {
        const mod = await import('lucide-react');
        if (!cancelled) setIcons(mod);
      } catch (e) {
        // ignore icon load failures
      }
    })();
    return () => { cancelled = true; };
  }, [isReady]);

  // Proxy to provide icon components by name without importing them statically.
  const IconProxy = new Proxy({}, {
    get: (_, name) => (props) => {
      if (!icons) return <span className="inline-block w-6 h-6 bg-slate-200 rounded" />;
      const Comp = icons[name];
      return Comp ? <Comp {...props} /> : <span className="inline-block w-6 h-6 bg-slate-200 rounded" />;
    }
  });

  const { ShieldCheck, Stethoscope, Activity, Users, Pill, HeartPulse, ArrowRight, Microscope, Ambulance, Brain, FileText, Play, Users2, CreditCard, Building, Truck, BarChart3, Video, Calendar, Radio, Hospital, Wallet, Settings2, LayoutDashboard, UserCheck, Heart, Bot, LineChart, Bell, Target, FileSpreadsheet, Workflow, UserPlus, GitBranch, Layers, Check, Star, Globe, Menu, X, Sparkles, PlayCircle, Rocket, BadgeCheck, ChevronRight, Building2, TrendingUp, Award, Zap, Clock, Code, Palette, Cpu, Cloud, Server, Database, Lock, Fingerprint, ScanEye, Radar, Network, Blocks, PanelTop, Gauge, GanttChart, NotepadText, FlaskRound, TestTube, Bone, Baby, Clover, Flower, Leaf, Sprout, Sun, Moon, Crown, Gem, Gift, LogIn } = IconProxy;
  const ShieldIcon = ShieldCheck; // alias used previously
  const StarIcon = Star;

  // Intersection Observer for scroll animations (deferred)
  useEffect(() => {
    if (!isReady) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );

    document.querySelectorAll('[data-animate]').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isReady]);

  // Counter animation for stats (deferred)
  useEffect(() => {
    if (!isReady) return;
    const targets = [500, 25000, 2000000, 9999, 100];
    const intervals = targets.map((target, index) => {
      let current = 0;
      const step = Math.ceil(target / 60);
      return setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(intervals[index]);
        }
        setCounterValues(prev => {
          const newVals = [...prev];
          newVals[index] = current;
          return newVals;
        });
      }, 30);
    });

    // Start counters after delay
    const timeout = setTimeout(() => {
      intervals.forEach((interval, i) => {
        if (i === 0) setCounterValues(prev => { const newVals = [...prev]; newVals[0] = 0; return newVals; });
      });
    }, 500);

    return () => {
      intervals.forEach(interval => clearInterval(interval));
      clearTimeout(timeout);
    };
  }, [isReady]);

  // Mouse parallax effect (deferred)
  useEffect(() => {
    if (!isReady) return;
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isReady]);

  // Auto-rotate testimonials (deferred)
  useEffect(() => {
    if (!isReady) return;
    const interval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % 4);
    }, 5000);
    return () => clearInterval(interval);
  }, [isReady]);

  // Animated progress (deferred)
  useEffect(() => {
    if (!isReady) return;
    const interval = setInterval(() => {
      setAnimatedProgress(prev => (prev + 1) % 100);
    }, 3000);
    return () => clearInterval(interval);
  }, [isReady]);

  // Scroll handler for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
    return num.toLocaleString();
  };

  // Core features with premium icons and animations
  const coreFeatures = [
    { icon: FileText, label: 'EMR', color: '#0F4C81', description: 'Electronic Medical Records', gradient: 'from-blue-600 to-blue-700' },
    { icon: Users, label: 'Patient', color: '#14B8A6', description: 'Patient Management', gradient: 'from-teal-500 to-teal-600' },
    { icon: Calendar, label: 'Scheduling', color: '#10B981', description: 'Appointment Scheduling', gradient: 'from-emerald-500 to-emerald-600' },
    { icon: Microscope, label: 'LIS', color: '#8B5CF6', description: 'Laboratory Information', gradient: 'from-violet-500 to-violet-600' },
    { icon: Pill, label: 'Pharmacy', color: '#F59E0B', description: 'Pharmacy Management', gradient: 'from-amber-500 to-amber-600' },
    { icon: Radio, label: 'Radiology', color: '#EC4899', description: 'Radiology Management', gradient: 'from-pink-500 to-pink-600' },
    { icon: Hospital, label: 'Theatre', color: '#EF4444', description: 'Theatre Management', gradient: 'from-red-500 to-red-600' },
    { icon: Ambulance, label: 'Emergency', color: '#DC2626', description: 'Emergency Department', gradient: 'from-red-600 to-red-700' },
    { icon: Building, label: 'Ward', color: '#0891B2', description: 'Inpatient & Ward Management', gradient: 'from-cyan-500 to-cyan-600' },
    { icon: CreditCard, label: 'Billing', color: '#059669', description: 'Billing & Revenue Cycle', gradient: 'from-emerald-600 to-emerald-700' },
    { icon: Truck, label: 'Inventory', color: '#D97706', description: 'Inventory Management', gradient: 'from-amber-600 to-amber-700' },
    { icon: Users2, label: 'HR', color: '#7C3AED', description: 'HR & Staff Management', gradient: 'from-indigo-500 to-indigo-600' },
    { icon: BarChart3, label: 'Analytics', color: '#2563EB', description: 'Clinical Analytics', gradient: 'from-blue-500 to-blue-600' },
    { icon: Video, label: 'Telemedicine', color: '#0891B2', description: 'Telemedicine', gradient: 'from-cyan-500 to-cyan-600' },
    { icon: Brain, label: 'AI Decision', color: '#7C3AED', description: 'AI-Powered Decision Support', gradient: 'from-indigo-600 to-indigo-700' },
    { icon: ShieldIcon, label: 'Compliance', color: '#059669', description: 'Quality & Compliance', gradient: 'from-emerald-500 to-emerald-600' }
  ];

  // Role-based dashboards
  const roleDashboards = [
    { icon: Stethoscope, title: 'Doctors', gradient: 'from-blue-600 to-blue-700', metrics: ['12 Patients', '3 Surgeries', '2 Consultations'], color: '#0F4C81' },
    { icon: Heart, title: 'Nurses', gradient: 'from-teal-500 to-teal-600', metrics: ['8 Patients', '4 Vitals', '2 Tasks'], color: '#14B8A6' },
    { icon: Pill, title: 'Pharmacists', gradient: 'from-amber-500 to-amber-600', metrics: ['45 Orders', '12 Dispensed', '3 Pending'], color: '#F59E0B' },
    { icon: Microscope, title: 'Lab Scientists', gradient: 'from-violet-500 to-violet-600', metrics: ['23 Tests', '18 Completed', '5 Pending'], color: '#8B5CF6' },
    { icon: Radio, title: 'Radiologists', gradient: 'from-pink-500 to-pink-600', metrics: ['15 Scans', '11 Reports', '4 Urgent'], color: '#EC4899' },
    { icon: UserCheck, title: 'Receptionists', gradient: 'from-cyan-500 to-cyan-600', metrics: ['28 Patients', '15 Appointments', '3 Walk-ins'], color: '#0891B2' },
    { icon: Wallet, title: 'Accountants', gradient: 'from-emerald-500 to-emerald-600', metrics: ['₦2.4M Revenue', '45 Claims', '12 Pending'], color: '#059669' },
    { icon: Settings2, title: 'Administrators', gradient: 'from-indigo-500 to-indigo-600', metrics: ['87% Occupancy', '24 Staff', '12 Reports'], color: '#7C3AED' },
    { icon: LayoutDashboard, title: 'Executives', gradient: 'from-red-500 to-red-600', metrics: ['98% KPI', '4.5M Patients', '92% Satisfaction'], color: '#DC2626' }
  ];

  // AI features
  const aiFeatures = [
    { icon: Bot, title: 'AI Appointment Scheduling', description: 'Intelligent scheduling that optimizes resources and reduces wait times', gradient: 'from-violet-500 to-purple-500' },
    { icon: LineChart, title: 'Predictive Analytics', description: 'Forecast patient volume, resource needs, and clinical outcomes', gradient: 'from-blue-500 to-indigo-500' },
    { icon: Bell, title: 'Clinical Alerts', description: 'Real-time alerts for critical values and patient deterioration', gradient: 'from-red-500 to-pink-500' },
    { icon: Target, title: 'Resource Optimization', description: 'AI-driven staff scheduling and inventory management', gradient: 'from-emerald-500 to-teal-500' },
    { icon: FileSpreadsheet, title: 'Automated Reporting', description: 'Generate regulatory reports and operational insights', gradient: 'from-amber-500 to-orange-500' },
    { icon: Workflow, title: 'Workflow Automation', description: 'Streamline clinical and administrative workflows', gradient: 'from-cyan-500 to-blue-500' }
  ];

  // Patient journey steps
  const journeySteps = [
    { icon: UserPlus, label: 'Patient Registration', color: '#0F4C81' },
    { icon: Calendar, label: 'Appointment Booking', color: '#14B8A6' },
    { icon: Stethoscope, label: 'Doctor Consultation', color: '#10B981' },
    { icon: Microscope, label: 'Lab Investigation', color: '#8B5CF6' },
    { icon: Pill, label: 'Pharmacy Dispensing', color: '#F59E0B' },
    { icon: CreditCard, label: 'Billing & Payment', color: '#059669' },
    { icon: Heart, label: 'Discharge & Follow-up', color: '#EC4899' }
  ];

  // Testimonials
  const testimonials = [
    { name: 'Dr. Adebayo Ogunlesi', role: 'Chief Medical Director', hospital: 'Lagos University Teaching Hospital', quote: 'SmartCare HMS has fundamentally transformed our clinical operations. The comprehensive EMR and integrated modules have improved patient outcomes and staff satisfaction significantly.', rating: 5, avatar: 'AO' },
    { name: 'Mrs. Chioma Nwosu', role: 'Head of Administration', hospital: 'National Hospital Abuja', quote: 'The NHIA claims management and revenue cycle features have been game-changing. We\'ve seen a 60% reduction in claim rejections and significantly improved cash flow.', rating: 5, avatar: 'CN' },
    { name: 'Dr. Emeka Okonkwo', role: 'Medical Director', hospital: 'Nigerian Army Reference Hospital', quote: 'The clinical decision support and patient safety features are world-class. Our medication error rates dropped by 45% in the first quarter of implementation.', rating: 5, avatar: 'EO' },
    { name: 'Prof. Oluwaseun Adeyemi', role: 'Dean of Medicine', hospital: 'University College Hospital', quote: 'As a teaching hospital, the platform\'s ability to manage complex cases, clinical trials, and medical education has been exceptional.', rating: 5, avatar: 'OA' }
  ];

  // Stats with animations
  const stats = [
    { value: 500, label: 'Hospitals Served', icon: Building2, suffix: '+' },
    { value: 25000, label: 'Healthcare Professionals', icon: Users, suffix: '+' },
    { value: 2000000, label: 'Patients Managed', icon: Heart, suffix: '+' },
    { value: 9999, label: 'Uptime Guarantee', icon: ShieldIcon, suffix: '%' },
    { value: 100, label: 'Compliance Certified', icon: BadgeCheck, suffix: '%' }
  ];

  const complianceBadges = ['HIPAA', 'GDPR', 'ISO 27001', 'ISO 9001', 'HITRUST', 'SOC 2'];

  const metrics = [
    { label: 'Bed Occupancy Rate', value: '87%', trend: '+5%', color: '#0F4C81' },
    { label: 'Revenue Trends', value: '₦2.4M', trend: '+12%', color: '#10B981' },
    { label: 'Patient Satisfaction', value: '94%', trend: '+3%', color: '#14B8A6' },
    { label: 'Clinical Performance', value: '92%', trend: '+8%', color: '#8B5CF6' },
    { label: 'Staff Productivity', value: '78%', trend: '+4%', color: '#F59E0B' },
    { label: 'Operational KPIs', value: '96%', trend: '+2%', color: '#EC4899' }
  ];

  return (
    <div className="min-h-screen bg-white font-['Inter',system-ui,sans-serif] antialiased overflow-x-hidden">
      {/* Premium Navigation with Glassmorphism */}
      <header className={`fixed top-0 z-50 w-full transition-all duration-500 ${scrolled ? 'bg-white/90 backdrop-blur-xl shadow-2xl border-b border-slate-200/50' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="relative group">
                <div className="inline-flex rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-2.5 shadow-xl shadow-blue-600/30 transition-all duration-500 group-hover:shadow-blue-600/50 group-hover:scale-105 group-hover:rotate-3">
                  <ShieldCheck className="h-7 w-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white animate-ping" />
                <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-teal-400 rounded-full border-2 border-white animate-pulse delay-500" />
              </div>
              <div>
                <span className="text-2xl font-bold text-slate-900 tracking-tight">SmartCare<span className="text-blue-600">HMS</span></span>
                <span className="ml-3 text-[10px] font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 animate-pulse">
                  Enterprise
                </span>
              </div>
            </div>

            <nav className="hidden lg:flex items-center gap-8">
              {['Features', 'AI & Automation', 'Roles', 'Testimonials'].map((item, i) => (
                <a 
                  key={i}
                  href={`#${item.toLowerCase().replace(/ & /g, '-').replace(/ /g, '')}`} 
                  className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-all duration-300 hover:scale-105 relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
              <Link 
                to="/login" 
                className="inline-flex items-center gap-2 rounded-2xl border-2 border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:border-blue-300 hover:bg-slate-50 transition-all duration-300 hover:scale-105"
              >
                Sign In
                <LogIn className="h-4 w-4" />
              </Link>
              <button className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 px-6 py-3 text-sm font-medium text-white hover:shadow-2xl hover:shadow-blue-600/40 transition-all duration-300 hover:scale-105 hover:rotate-1">
                Book Demo
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </nav>

            <button onClick={toggleMobileMenu} className="lg:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors">
              {isMobileMenuOpen ? <X className="h-6 w-6 text-slate-600" /> : <Menu className="h-6 w-6 text-slate-600" />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-2xl animate-slideDown">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="flex flex-col space-y-4">
                {['Features', 'AI & Automation', 'Roles', 'Testimonials'].map((item, i) => (
                  <a 
                    key={i}
                    href={`#${item.toLowerCase().replace(/ & /g, '-').replace(/ /g, '')}`} 
                    onClick={closeMobileMenu}
                    className="text-sm text-slate-600 hover:text-blue-600 transition-colors py-2 px-4 rounded-xl hover:bg-slate-50"
                  >
                    {item}
                  </a>
                ))}
                <Link 
                  to="/login" 
                  onClick={closeMobileMenu}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-700 hover:border-blue-300 hover:bg-slate-50 transition-all"
                >
                  Sign In
                  <LogIn className="h-4 w-4" />
                </Link>
                <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 px-6 py-3.5 text-sm font-medium text-white hover:shadow-xl transition-all">
                  Book Demo
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* Hero Section with Parallax and Particle Effects */}
        <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden pt-20">
          {/* Animated Background with Gradient Orbs */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50" />
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-400/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-teal-400/10 rounded-full blur-3xl animate-float delay-700" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-indigo-400/5 rounded-full blur-3xl animate-pulse" />

          {/* Animated Particle System */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full animate-float"
                style={{
                  width: Math.random() * 8 + 2 + 'px',
                  height: Math.random() * 8 + 2 + 'px',
                  background: `hsla(${200 + Math.random() * 60}, 70%, 50%, ${0.1 + Math.random() * 0.2})`,
                  left: Math.random() * 100 + '%',
                  top: Math.random() * 100 + '%',
                  animationDelay: Math.random() * 8 + 's',
                  animationDuration: Math.random() * 15 + 10 + 's',
                  transform: `translate(${mousePosition.x * 0.1}px, ${mousePosition.y * 0.1}px)`
                }}
              />
            ))}
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-12">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left Content with Staggered Animations */}
              <div className="space-y-8">
                <div 
                  className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-5 py-2.5 rounded-full border border-slate-200/50 shadow-lg shadow-slate-200/20 animate-slideUp"
                  style={{ animationDelay: '0.1s' }}
                >
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                  </span>
                  <span className="text-sm font-medium text-slate-700">Next-Generation Healthcare Platform</span>
                  <Sparkles className="h-4 w-4 text-blue-500 animate-spin-slow" />
                </div>

                <h1 
                  className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-slate-900 leading-[1.05] tracking-tight animate-slideUp"
                  style={{ animationDelay: '0.2s' }}
                >
                  <span className="block">Transforming</span>
                  <span className="block bg-gradient-to-r from-blue-600 via-teal-500 to-emerald-500 bg-clip-text text-transparent animate-gradient">
                    Hospital Operations
                  </span>
                  <span className="block text-4xl sm:text-5xl lg:text-6xl mt-2">Through Intelligent Technology</span>
                </h1>

                <p 
                  className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-xl animate-slideUp"
                  style={{ animationDelay: '0.3s' }}
                >
                  One unified platform for patient care, clinical operations, administration, billing,
                  diagnostics, pharmacy, laboratory, workforce management, and healthcare analytics.
                </p>

                <div 
                  className="flex flex-wrap gap-4 animate-slideUp"
                  style={{ animationDelay: '0.4s' }}
                >
                  <button className="group inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 px-8 py-4 text-base font-medium text-white hover:shadow-2xl hover:shadow-blue-600/40 transition-all duration-300 hover:scale-105 hover:rotate-1">
                    Book Demo
                    <Play className="h-5 w-5 group-hover:animate-pulse group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button className="group inline-flex items-center gap-3 rounded-2xl border-2 border-slate-200 px-8 py-4 text-base font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 hover:scale-105">
                    Watch Product Tour
                    <PlayCircle className="h-5 w-5 group-hover:scale-110 group-hover:rotate-12 transition-transform" />
                  </button>
                </div>

                <div 
                  className="flex items-center gap-6 text-sm text-slate-500 animate-slideUp"
                  style={{ animationDelay: '0.5s' }}
                >
                  <span className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500 animate-bounce" />
                    Free Demo
                  </span>
                  <span className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500 animate-bounce delay-100" />
                    14-Day Trial
                  </span>
                  <span className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500 animate-bounce delay-200" />
                    No Commitment
                  </span>
                </div>
              </div>

              {/* Right - Premium Dashboard with 3D Transform */}
              <div 
                className="relative hidden lg:block animate-slideUp"
                style={{ 
                  animationDelay: '0.6s',
                  transform: `perspective(1000px) rotateY(${mousePosition.x * 0.02}deg) rotateX(${-mousePosition.y * 0.02}deg)`
                }}
              >
                <div className="relative bg-white/90 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/40 p-8 transition-all duration-300 hover:shadow-3xl">
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-500/5 via-transparent to-emerald-500/5 pointer-events-none" />
                  
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="flex space-x-1.5">
                        <div className="w-3.5 h-3.5 bg-red-400 rounded-full animate-pulse" />
                        <div className="w-3.5 h-3.5 bg-yellow-400 rounded-full animate-pulse delay-100" />
                        <div className="w-3.5 h-3.5 bg-emerald-400 rounded-full animate-pulse delay-200" />
                      </div>
                      <span className="text-sm font-medium text-slate-600 ml-2">SmartCare Command Center</span>
                    </div>
                    <div className="flex items-center gap-2 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100 animate-pulse">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                      <span className="text-xs font-medium text-blue-700">Live</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4 mb-6">
                    {[
                      { label: 'Total Patients', value: '342', color: 'blue' },
                      { label: 'Bed Occupancy', value: '87%', color: 'teal' },
                      { label: 'Appointments', value: '24', color: 'emerald' },
                      { label: 'ED Critical', value: '5', color: 'amber' }
                    ].map((item, i) => (
                      <div 
                        key={i} 
                        className={`bg-gradient-to-br from-${item.color}-50 to-${item.color}-100/50 rounded-2xl p-4 border border-${item.color}-100/50 hover:scale-105 transition-all duration-300 cursor-pointer group`}
                      >
                        <div className="text-3xl font-bold text-slate-900 group-hover:scale-110 transition-transform">{item.value}</div>
                        <div className="text-xs text-slate-600 font-medium mt-1">{item.label}</div>
                        <div className="mt-2 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                          <div className={`h-full bg-${item.color}-600 rounded-full animate-pulse`} style={{ width: `${Math.random() * 50 + 40}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {[
                      { label: 'Laboratory', value: '18', trend: '+12%', icon: Activity },
                      { label: 'Pharmacy', value: '45', trend: '+8%', icon: Pill }
                    ].map((item, i) => (
                      <div key={i} className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/50 hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer">
                        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                          <item.icon className="h-4 w-4 text-blue-500" />
                          <span>{item.label}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-semibold text-slate-900">{item.value}</span>
                          <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full animate-pulse">{item.trend}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 via-teal-50 to-emerald-50 rounded-2xl p-4 border border-slate-200/50">
                    <div className="flex items-center justify-between gap-2">
                      {journeySteps.slice(0, 5).map((step, idx) => (
                        <div key={idx} className="flex items-center gap-1 group">
                          <div className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center group-hover:scale-110 transition-all duration-300 group-hover:shadow-lg">
                            <step.icon className="h-4 w-4 transition-transform group-hover:scale-125" style={{ color: step.color }} />
                          </div>
                          {idx < 4 && <ChevronRight className="h-3 w-3 text-slate-400 animate-pulse" />}
                        </div>
                      ))}
                    </div>
                    <div className="text-center mt-2 text-[10px] font-medium text-slate-500 animate-pulse">
                      Automated Patient Workflow
                    </div>
                  </div>

                  <div className="absolute -top-4 -right-4 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl animate-pulse" />
                  <div className="absolute -bottom-4 -left-4 w-40 h-40 bg-teal-500/10 rounded-full blur-2xl animate-pulse delay-500" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Bar with Counter Animations */}
        <section ref={statsRef} className="relative py-16 bg-white border-y border-slate-200/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div 
                    key={index} 
                    className="text-center group animate-slideUp"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="inline-flex rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 p-3 mb-3 group-hover:shadow-2xl group-hover:shadow-blue-100 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                      <Icon className="h-6 w-6 text-blue-600 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="text-3xl font-bold text-slate-900">
                      {formatNumber(counterValues[index])}{stat.suffix}
                    </div>
                    <div className="text-sm text-slate-500 font-medium mt-1">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Features Section with Staggered Card Animations */}
        <section id="features" className="py-24 bg-slate-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 bg-white px-5 py-2.5 rounded-full shadow-md border border-slate-200/50 mb-6 animate-slideUp">
                <Layers className="h-5 w-5 text-blue-600 animate-spin-slow" />
                <span className="text-sm font-semibold text-slate-700">16 Powerful Modules</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 animate-slideUp" style={{ animationDelay: '0.1s' }}>
                Complete Hospital Operating System
              </h2>
              <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto animate-slideUp" style={{ animationDelay: '0.2s' }}>
                Every module you need to run a modern healthcare facility, seamlessly integrated
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {coreFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="group relative bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 cursor-pointer animate-slideUp"
                    style={{ animationDelay: `${index * 0.05}s` }}
                    onMouseEnter={() => setHoveredFeature(index)}
                    onMouseLeave={() => setHoveredFeature(null)}
                  >
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-transparent via-transparent to-transparent group-hover:from-blue-500/5 group-hover:via-transparent group-hover:to-transparent transition-all duration-500" />
                    <div className="relative">
                      <div
                        className={`inline-flex rounded-2xl p-3 mb-4 transition-all duration-500 ${
                          hoveredFeature === index 
                            ? `bg-gradient-to-br ${feature.gradient} text-white shadow-2xl scale-110 rotate-3` 
                            : 'text-slate-600'
                        }`}
                        style={{
                          backgroundColor: hoveredFeature === index ? undefined : `${feature.color}15`,
                          boxShadow: hoveredFeature === index ? `0 20px 40px ${feature.color}30` : 'none'
                        }}
                      >
                        <Icon className={`h-6 w-6 transition-all duration-500 ${hoveredFeature === index ? 'scale-110' : ''}`} />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{feature.label}</h3>
                      <p className="text-sm text-slate-500 group-hover:text-slate-700 transition-colors">{feature.description}</p>
                      <div className={`mt-4 flex items-center gap-1 text-sm font-medium transition-all duration-500 ${hoveredFeature === index ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                        style={{ color: feature.color }}>
                        Learn More
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Patient Journey with Animated Flow */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 bg-teal-50 px-5 py-2.5 rounded-full shadow-md border border-teal-200/50 mb-6 animate-slideUp">
                <GitBranch className="h-5 w-5 text-teal-600 animate-spin-slow" />
                <span className="text-sm font-semibold text-slate-700">Patient Journey</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 animate-slideUp" style={{ animationDelay: '0.1s' }}>
                Seamless Patient Experience
              </h2>
              <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto animate-slideUp" style={{ animationDelay: '0.2s' }}>
                From registration to discharge, every step is optimized for efficiency and care
              </p>
            </div>

            <div className="relative">
              {/* Animated flow line */}
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-teal-500 to-emerald-500 transform -translate-y-1/2 hidden lg:block" />
              <div 
                className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-blue-500 via-teal-500 to-emerald-500 transform -translate-y-1/2 hidden lg:block transition-all duration-1000"
                style={{ width: `${animatedProgress}%` }}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-6">
                {journeySteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div 
                      key={index} 
                      className="relative group animate-slideUp"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex flex-col items-center">
                        <div className="relative">
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white to-slate-50 shadow-lg border border-slate-200 flex items-center justify-center group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-2 group-hover:rotate-3"
                            style={{ borderColor: step.color }}>
                            <Icon className="h-7 w-7 transition-all duration-500 group-hover:scale-125 group-hover:rotate-12" style={{ color: step.color }} />
                          </div>
                          <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white shadow-md border flex items-center justify-center text-xs font-bold text-slate-600 animate-bounce"
                            style={{ borderColor: step.color, animationDelay: `${index * 0.2}s` }}>
                            {index + 1}
                          </div>
                        </div>
                        <div className="mt-3 text-center">
                          <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">{step.label}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Role-Based Dashboards with Hover 3D Effects */}
        <section id="roles" className="py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-5 py-2.5 rounded-full border border-white/20 mb-6 animate-slideUp">
                <Users className="h-5 w-5 text-white animate-spin-slow" />
                <span className="text-sm font-semibold text-white">Role-Based Platform</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-white animate-slideUp" style={{ animationDelay: '0.1s' }}>
                Dedicated Dashboards for Every Role
              </h2>
              <p className="mt-4 text-lg text-blue-200 max-w-2xl mx-auto animate-slideUp" style={{ animationDelay: '0.2s' }}>
                Personalized interfaces optimized for each healthcare professional's workflow
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {roleDashboards.map((role, index) => {
                const Icon = role.icon;
                return (
                  <div
                    key={index}
                    className="group relative bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl cursor-pointer animate-slideUp"
                    style={{ animationDelay: `${index * 0.05}s` }}
                    onMouseEnter={() => setHoveredModule(index)}
                    onMouseLeave={() => setHoveredModule(null)}
                  >
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${role.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                    <div className="relative">
                      <div className={`inline-flex rounded-2xl p-3 mb-4 bg-gradient-to-br ${role.gradient} transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-2xl`}>
                        <Icon className="h-6 w-6 text-white transition-transform group-hover:scale-110" />
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">{role.title}</h3>
                      <div className="space-y-2 mb-4">
                        {role.metrics.map((metric, idx) => (
                          <div key={idx} className="flex items-center gap-2 group-hover:translate-x-1 transition-transform">
                            <Check className="h-4 w-4 text-emerald-400 animate-pulse" />
                            <span className="text-sm text-blue-200">{metric}</span>
                          </div>
                        ))}
                      </div>
                      <div className={`flex items-center gap-2 text-sm font-medium text-white transition-all duration-500 ${hoveredModule === index ? 'opacity-100 translate-x-0' : 'opacity-50 -translate-x-4'}`}>
                        View Dashboard
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-2 transition-transform" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* AI & Automation Section with Glowing Cards */}
        <section id="ai" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 bg-violet-50 px-5 py-2.5 rounded-full shadow-md border border-violet-200/50 mb-6 animate-slideUp">
                <Brain className="h-5 w-5 text-violet-600 animate-pulse" />
                <span className="text-sm font-semibold text-slate-700">AI & Automation</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 animate-slideUp" style={{ animationDelay: '0.1s' }}>
                Intelligent Healthcare Automation
              </h2>
              <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto animate-slideUp" style={{ animationDelay: '0.2s' }}>
                Leverage artificial intelligence to optimize operations and enhance clinical decisions
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aiFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div 
                    key={index} 
                    className="group bg-gradient-to-br from-slate-50 to-white rounded-2xl border border-slate-200 p-8 hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 hover:border-violet-200 animate-slideUp"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className={`inline-flex rounded-2xl bg-gradient-to-br ${feature.gradient} p-3 mb-4 shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                      <Icon className="h-6 w-6 text-white transition-transform group-hover:scale-110" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-violet-600 transition-colors">{feature.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed group-hover:text-slate-700 transition-colors">{feature.description}</p>
                    <div className="mt-4 flex items-center gap-2 text-sm font-medium text-violet-600 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:translate-x-0 -translate-x-4">
                      Learn More
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* AI Visualization with Animated Stats */}
            <div className="mt-16 bg-gradient-to-br from-slate-900 to-indigo-900 rounded-3xl p-12 text-center animate-scaleIn">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {[
                  { value: '98%', label: 'Schedule Optimization' },
                  { value: '87%', label: 'Prediction Accuracy' },
                  { value: '45%', label: 'Faster Decisions' },
                  { value: '60%', label: 'Error Reduction' }
                ].map((item, i) => (
                  <div key={i} className="group cursor-pointer">
                    <div className="text-5xl font-bold text-white group-hover:scale-110 transition-transform duration-300">
                      {item.value}
                    </div>
                    <div className="text-sm text-blue-300 mt-1 group-hover:text-blue-200 transition-colors">{item.label}</div>
                    <div className="mt-2 h-1 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-400 to-emerald-400 rounded-full animate-pulse" style={{ width: `${Math.random() * 50 + 50}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex justify-center gap-4">
                <div className="px-4 py-2 bg-white/10 rounded-full border border-white/20 animate-pulse">
                  <span className="text-xs text-blue-200">Powered by Advanced AI Models</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Analytics Section with Animated Charts */}
        <section className="py-24 bg-slate-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 bg-emerald-50 px-5 py-2.5 rounded-full shadow-md border border-emerald-200/50 mb-6 animate-slideUp">
                <BarChart3 className="h-5 w-5 text-emerald-600 animate-pulse" />
                <span className="text-sm font-semibold text-slate-700">Enterprise Analytics</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 animate-slideUp" style={{ animationDelay: '0.1s' }}>
                Real-Time Healthcare Dashboards
              </h2>
              <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto animate-slideUp" style={{ animationDelay: '0.2s' }}>
                Data-driven insights for operational excellence and clinical quality improvement
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {metrics.map((metric, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-slideUp"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-slate-500">{metric.label}</span>
                    <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full animate-pulse">{metric.trend}</span>
                  </div>
                  <div className="text-3xl font-bold text-slate-900 group-hover:scale-105 transition-transform">{metric.value}</div>
                  <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000 animate-pulse"
                      style={{
                        width: metric.value.replace('%', '').replace('₦', ''),
                        backgroundColor: metric.color
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials with Carousel Animation */}
        <section id="testimonials" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 bg-amber-50 px-5 py-2.5 rounded-full shadow-md border border-amber-200/50 mb-6 animate-slideUp">
                <Star className="h-5 w-5 text-amber-600 animate-spin-slow" />
                <span className="text-sm font-semibold text-slate-700">Testimonials</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 animate-slideUp" style={{ animationDelay: '0.1s' }}>
                Trusted by Healthcare Leaders
              </h2>
              <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto animate-slideUp" style={{ animationDelay: '0.2s' }}>
                Real feedback from hospital executives and medical directors
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index} 
                  className={`group bg-gradient-to-br from-slate-50 to-white rounded-2xl p-8 border border-slate-200 hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 animate-slideUp ${
                    activeTestimonial === index ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                  }`}
                  style={{ animationDelay: `${index * 0.15}s` }}
                  onMouseEnter={() => setActiveTestimonial(index)}
                >
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400 animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />
                    ))}
                  </div>
                  <p className="text-slate-600 leading-relaxed text-lg group-hover:text-slate-800 transition-colors">"{testimonial.quote}"</p>
                  <div className="mt-6 flex items-center gap-4 border-t border-slate-200 pt-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-500 group-hover:rotate-3">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{testimonial.name}</div>
                      <div className="text-sm text-slate-500">{testimonial.role}</div>
                      <div className="text-sm font-medium text-blue-600">{testimonial.hospital}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Compliance Section with Animated Badges */}
        <section className="py-16 bg-slate-50/50 border-y border-slate-200/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 animate-pulse">Security & Compliance</h3>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
              {complianceBadges.map((badge, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-2 bg-white px-5 py-3 rounded-full shadow-sm border border-slate-200 hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:rotate-3 cursor-pointer animate-slideUp"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ShieldIcon className="h-5 w-5 text-emerald-500 animate-pulse" />
                  <span className="text-sm font-semibold text-slate-700">{badge}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA with Animated Background */}
        <section className="relative py-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 animate-gradient" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-400/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-400/20 rounded-full blur-3xl animate-float delay-500" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-5 py-2.5 rounded-full border border-white/20 mb-8 animate-bounce">
              <Rocket className="h-5 w-5 text-white" />
              <span className="text-sm font-semibold text-white">Get Started Today</span>
            </div>
            <h2 className="text-5xl sm:text-6xl font-bold text-white leading-tight animate-slideUp">
              Ready to Transform Your <br />Hospital Operations?
            </h2>
            <p className="mt-6 text-xl text-blue-100 max-w-2xl mx-auto animate-slideUp" style={{ animationDelay: '0.2s' }}>
              Join 500+ hospitals across Nigeria using SmartCare HMS to deliver exceptional patient care.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4 animate-slideUp" style={{ animationDelay: '0.3s' }}>
              <button className="group inline-flex items-center gap-3 rounded-2xl bg-white px-10 py-5 text-base font-semibold text-blue-600 hover:bg-blue-50 transition-all duration-500 shadow-2xl hover:shadow-2xl hover:scale-110 hover:rotate-1">
                Book Demo
                <ArrowRight className="h-5 w-5 group-hover:translate-x-2 group-hover:rotate-12 transition-transform" />
              </button>
              <button className="group inline-flex items-center gap-3 rounded-2xl border-2 border-white/30 px-10 py-5 text-base font-semibold text-white hover:bg-white/10 transition-all duration-500 backdrop-blur-sm hover:scale-110 hover:-rotate-1">
                <PlayCircle className="h-5 w-5 group-hover:scale-110 group-hover:rotate-12 transition-transform" />
                Watch Product Tour
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Enterprise Footer */}
      <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="inline-flex rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-2.5 animate-pulse">
                  <ShieldCheck className="h-6 w-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">SmartCare<span className="text-blue-400">HMS</span></span>
              </div>
              <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
                Enterprise hospital management platform for Nigerian healthcare institutions.
                Transforming healthcare operations through intelligent technology.
              </p>
              <div className="mt-6 flex items-center gap-4 text-sm text-slate-400">
                <Globe className="h-4 w-4 animate-spin-slow" />
                <span>© 2024 SmartCare HMS. All rights reserved.</span>
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-3 text-sm">
                {['Features', 'Pricing', 'Integrations', 'Security'].map((item, i) => (
                  <li key={i}><a href="#" className="hover:text-white transition-all hover:translate-x-1 inline-block">{item}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Solutions</h4>
              <ul className="space-y-3 text-sm">
                {['Hospitals', 'Clinics', 'Teaching Hospitals', 'Healthcare Networks'].map((item, i) => (
                  <li key={i}><a href="#" className="hover:text-white transition-all hover:translate-x-1 inline-block">{item}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-3 text-sm">
                {['Help Center', 'Contact', 'Service Status', 'Community'].map((item, i) => (
                  <li key={i}><a href="#" className="hover:text-white transition-all hover:translate-x-1 inline-block">{item}</a></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-800 text-center text-xs text-slate-500 animate-pulse">
            <span>SmartCare HMS — Transforming Healthcare Operations Through Intelligent Technology</span>
          </div>
        </div>
      </footer>

      {/* Custom CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(2deg); }
        }
        .animate-float {
          animation: float infinite ease-in-out;
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(40px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-slideUp {
          opacity: 0;
          animation: slideUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out forwards;
        }
        
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scaleIn {
          animation: scaleIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 6s ease infinite;
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }
        
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default SmartCareHMSRedesigned;