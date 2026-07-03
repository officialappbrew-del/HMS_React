import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import TourModal from '../components/TourModal';

const SmartCareHMSRedesigned = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [visibleSections, setVisibleSections] = useState({});
  const [isTourOpen, setIsTourOpen] = useState(false);
  
  const heroRef = useRef(null);
  const [icons, setIcons] = useState(null);
  const [isReady, setIsReady] = useState(false);

  // Get current year for copyright
  const currentYear = new Date().getFullYear();

  // Progressive enhancement for better performance
  useEffect(() => {
    const markReady = () => setIsReady(true);
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      requestIdleCallback(markReady, { timeout: 1000 });
    } else {
      const t = setTimeout(markReady, 600);
      return () => clearTimeout(t);
    }
  }, []);

  // Dynamic icon loading
  useEffect(() => {
    if (!isReady) return;
    let cancelled = false;
    (async () => {
      try {
        const mod = await import('lucide-react');
        if (!cancelled) setIcons(mod);
      } catch (e) {
        // Silent fail
      }
    })();
    return () => { cancelled = true; };
  }, [isReady]);

  const IconProxy = new Proxy({}, {
    get: (_, name) => (props) => {
      if (!icons) return <span className="inline-block w-6 h-6 bg-slate-200 rounded" />;
      const Comp = icons[name];
      return Comp ? <Comp {...props} /> : <span className="inline-block w-6 h-6 bg-slate-200 rounded" />;
    }
  });

  // Destructure icons with proper syntax
  const {
    ShieldCheck, Stethoscope, Activity, Users, Pill, HeartPulse,
    ArrowRight, Microscope, Ambulance, Brain, FileText, Play,
    Users2, CreditCard, Building, Truck, BarChart3, Video,
    Calendar, Radio, Hospital, Wallet, Settings2, LayoutDashboard,
    UserCheck, Heart, Bot, LineChart, Bell, Target, FileSpreadsheet,
    Workflow, UserPlus, GitBranch, Layers, Check, Star, Globe,
    Menu, X, Sparkles, PlayCircle, Rocket, BadgeCheck, ChevronRight,
    Building2, TrendingUp, Award, Zap, Clock, Code, Palette,
    Cpu, Cloud, Server, Database, Lock, Fingerprint, ScanEye,
    Radar, Network, Blocks, PanelTop, Gauge, GanttChart,
    NotepadText, FlaskRound, TestTube, Bone, Baby, Clover,
    Flower, Leaf, Sprout, Sun, Moon, Crown, Gem, Gift, LogIn
  } = IconProxy;

  // Scroll handler for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for sections
  useEffect(() => {
    if (!isReady) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('[data-section]').forEach(el => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isReady]);

  // Mouse parallax
  useEffect(() => {
    if (!isReady) return;
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 10,
        y: (e.clientY / window.innerHeight - 0.5) * 10
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isReady]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  // Core benefits - refined messaging
  const coreBenefits = [
    {
      icon: ShieldCheck,
      title: 'Enterprise-Grade Security',
      description: 'HIPAA & NDPR compliant with end-to-end encryption and advanced access controls',
      color: 'blue'
    },
    {
      icon: Users,
      title: 'Unified Patient Records',
      description: 'Complete patient history, diagnoses, medications, and care plans in one place',
      color: 'teal'
    },
    {
      icon: Brain,
      title: 'AI-Powered Clinical Support',
      description: 'Intelligent decision support, predictive analytics, and automated workflows',
      color: 'violet'
    },
    {
      icon: BarChart3,
      title: 'Real-Time Analytics',
      description: 'Comprehensive dashboards with actionable insights for operational excellence',
      color: 'emerald'
    }
  ];

  // Core modules - more focused and professional
  const coreModules = [
    { 
      icon: Stethoscope, 
      label: 'Clinical EMR', 
      description: 'Comprehensive electronic medical records with Nigerian clinical templates',
      gradient: 'from-blue-600 to-blue-700',
      color: '#0F4C81'
    },
    { 
      icon: Users, 
      label: 'Patient Management', 
      description: 'Complete patient registration, scheduling, and care coordination',
      gradient: 'from-teal-500 to-teal-600',
      color: '#14B8A6'
    },
    { 
      icon: Pill, 
      label: 'Pharmacy & Inventory', 
      description: 'Integrated medication management with NAFDAC compliance tracking',
      gradient: 'from-amber-500 to-amber-600',
      color: '#F59E0B'
    },
    { 
      icon: Microscope, 
      label: 'Laboratory Information', 
      description: 'End-to-end lab management with integrated LIS and result tracking',
      gradient: 'from-violet-500 to-violet-600',
      color: '#8B5CF6'
    },
    { 
      icon: Hospital, 
      label: 'Ward & Theatre Management', 
      description: 'Efficient bed management, surgical scheduling, and patient flow',
      gradient: 'from-cyan-500 to-cyan-600',
      color: '#0891B2'
    },
    { 
      icon: CreditCard, 
      label: 'Billing & Revenue Cycle', 
      description: 'Multi-payer billing, NHIS claims, and revenue optimization',
      gradient: 'from-emerald-500 to-emerald-600',
      color: '#059669'
    }
  ];

  // Testimonials - more impactful
  const testimonials = [
    {
      name: 'Dr. Adebayo Ogunlesi',
      role: 'Chief Medical Director',
      hospital: 'Lagos University Teaching Hospital',
      quote: 'SmartCare HMS has fundamentally transformed our clinical operations. The comprehensive EMR and integrated modules have improved patient outcomes and staff satisfaction significantly.',
      rating: 5,
      avatar: 'AO'
    },
    {
      name: 'Mrs. Chioma Nwosu',
      role: 'Head of Administration',
      hospital: 'National Hospital Abuja',
      quote: 'The NHIA claims management and revenue cycle features have been game-changing. We\'ve seen a 60% reduction in claim rejections and significantly improved cash flow.',
      rating: 5,
      avatar: 'CN'
    },
    {
      name: 'Dr. Emeka Okonkwo',
      role: 'Medical Director',
      hospital: 'Nigerian Army Reference Hospital',
      quote: 'The clinical decision support and patient safety features are world-class. Our medication error rates dropped by 45% in the first quarter of implementation.',
      rating: 5,
      avatar: 'EO'
    }
  ];

  // Stats - more healthcare-focused
  const stats = [
    { value: 500, label: 'Hospitals Served', icon: Building2, suffix: '+' },
    { value: 25000, label: 'Healthcare Professionals', icon: Users, suffix: '+' },
    { value: '2M+', label: 'Patients Managed', icon: Heart, suffix: '' },
    { value: 99.99, label: 'Uptime Guarantee', icon: ShieldCheck, suffix: '%' }
  ];

  // Compliance badges
  const complianceBadges = [
    { label: 'HIPAA Compliant', icon: ShieldCheck },
    { label: 'NDPR Certified', icon: ShieldCheck },
    { label: 'ISO 27001', icon: ShieldCheck },
    { label: 'NHIS Accredited', icon: ShieldCheck },
    { label: 'SOC 2 Type II', icon: ShieldCheck }
  ];

  return (
    <div className="min-h-screen bg-white font-['Inter',system-ui,sans-serif] antialiased">
      {/* Enhanced Navigation with Glassmorphism */}
      <header className={`fixed top-0 z-50 w-full transition-all duration-500 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-slate-200/50' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <div className="flex items-center gap-3">
              <div className="relative group">
                <div className="inline-flex rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 p-2.5 shadow-lg shadow-blue-600/20 transition-all duration-300 group-hover:shadow-blue-600/40">
                  <ShieldCheck className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white animate-ping" />
              </div>
              <div>
                <span className="text-xl font-bold text-slate-900">SmartCare<span className="text-blue-600">HMS</span></span>
                <span className="ml-2 text-[10px] font-semibold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                  Enterprise
                </span>
              </div>
            </div>

            <nav className="hidden lg:flex items-center gap-8">
              {['Features', 'Solutions', 'Security', 'Testimonials'].map((item) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase()}`} 
                  className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full" />
                </a>
              ))}
              <Link 
                to="/login" 
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-blue-300 hover:bg-slate-50 transition-all"
              >
                Sign In
                <LogIn className="h-4 w-4" />
              </Link>
              <a href="mailto:official.appbrew@gmail.com" className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 px-5 py-2.5 text-sm font-medium text-white hover:shadow-lg hover:shadow-blue-600/30 transition-all hover:scale-105">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </a>
            </nav>

            <button onClick={toggleMobileMenu} className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors">
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <div className="flex flex-col space-y-3">
                {['Features', 'Solutions', 'Security', 'Testimonials'].map((item) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase()}`} 
                  onClick={closeMobileMenu}
                  className="text-sm text-slate-600 hover:text-blue-600 transition-colors py-2 px-4 rounded-lg hover:bg-slate-50"
                >
                  {item}
                </a>
                ))}
                  <Link 
                    to="/login" 
                    onClick={closeMobileMenu}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:border-blue-300 hover:bg-slate-50 transition-all"
                  >
                    Sign In
                    <LogIn className="h-4 w-4" />
                  </Link>
                  <a href="mailto:official.appbrew@gmail.com" className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-700 px-4 py-2.5 text-sm font-medium text-white">
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </a>
              </div>
            </div>
          </div>
        )}
      </header>

      <main>
        {/* Hero Section - Enhanced with better copy and visuals */}
        <section 
          ref={heroRef}
          id="hero"
          className="relative min-h-screen flex items-center overflow-hidden pt-16"
          data-section
        >
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-400/10 rounded-full blur-3xl animate-float delay-700" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-400/5 rounded-full blur-3xl animate-pulse" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-12">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left Content - Enhanced Copy */}
              <div className="space-y-8">
                <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-slate-200/50 shadow-sm">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                  </span>
                  <span className="text-sm font-medium text-slate-700">Trusted by 500+ Nigerian Hospitals</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-slate-900 leading-[1.1] tracking-tight">
                  <span className="block">The Complete</span>
                  <span className="block bg-gradient-to-r from-blue-600 via-teal-500 to-emerald-500 bg-clip-text text-transparent animate-gradient">
                    Hospital Management
                  </span>
                  <span className="block text-3xl sm:text-4xl lg:text-5xl mt-2">System for Nigeria</span>
                </h1>

                <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-xl">
                  One unified platform for patient care, clinical operations, administration, billing, 
                  diagnostics, pharmacy, laboratory, workforce management, and healthcare analytics.
                </p>

                <div className="flex flex-wrap gap-4">
                  <a href="mailto:official.appbrew@gmail.com" className="group inline-flex items-center gap-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-4 text-base font-medium text-white hover:shadow-xl hover:shadow-blue-600/30 transition-all hover:scale-105">
                    Book a Demo
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </a>
                  <button onClick={() => setIsTourOpen(true)} className="group inline-flex items-center gap-3 rounded-xl border-2 border-slate-200 px-8 py-4 text-base font-medium text-slate-700 hover:bg-slate-50 transition-all hover:border-slate-300">
                    Watch Tour
                    <PlayCircle className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  </button>
                </div>

                <div className="flex items-center gap-6 text-sm text-slate-500">
                  <span className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500" />
                    Free Demo
                  </span>
                  <span className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500" />
                    14-Day Trial
                  </span>
                  <span className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-500" />
                    No Commitment
                  </span>
                </div>
              </div>

              {/* Right Content - Enhanced Dashboard Preview */}
              <div className="relative hidden lg:block">
                <div 
                  className="relative bg-white/90 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/40 p-6 transition-all duration-300"
                  style={{
                    transform: `perspective(1000px) rotateY(${mousePosition.x * 0.02}deg) rotateX(${-mousePosition.y * 0.02}deg)`
                  }}
                >
                  {/* Dashboard Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="flex space-x-1.5">
                        <div className="w-3 h-3 bg-red-400 rounded-full" />
                        <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                        <div className="w-3 h-3 bg-emerald-400 rounded-full" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">SmartCare Command Center</span>
                    </div>
                    <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
                      <span className="text-xs font-medium text-blue-700">Live</span>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-4 gap-3 mb-6">
                    {[
                      { label: 'Active Patients', value: '342', color: 'blue' },
                      { label: 'Bed Occupancy', value: '87%', color: 'teal' },
                      { label: 'Appointments', value: '24', color: 'emerald' },
                      { label: 'Critical Cases', value: '5', color: 'amber' }
                    ].map((item, i) => (
                      <div key={i} className={`bg-gradient-to-br from-${item.color}-50 to-${item.color}-100/50 rounded-xl p-3 border border-${item.color}-100/50`}>
                        <div className="text-2xl font-bold text-slate-900">{item.value}</div>
                        <div className="text-xs text-slate-600 font-medium">{item.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Activity Feed */}
                  <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200/50">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Recent Activity</span>
                      <span className="text-xs text-blue-600 font-medium">View All</span>
                    </div>
                    <div className="space-y-2">
                      {[
                        { time: '2 min ago', event: 'New patient registered - Grace Adebayo', type: 'patient' },
                        { time: '15 min ago', event: 'Lab results updated - 12 tests completed', type: 'lab' },
                        { time: '1 hour ago', event: 'Pharmacy order dispensed - 45 medications', type: 'pharmacy' }
                      ].map((activity, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm">
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          <span className="text-slate-600">{activity.event}</span>
                          <span className="text-xs text-slate-400 ml-auto">{activity.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Bar - Enhanced with better presentation */}
        <section className="relative py-16 bg-white border-y border-slate-200/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div 
                    key={index} 
                    className="text-center group"
                  >
                    <div className="inline-flex rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-3 mb-3 group-hover:shadow-lg group-hover:shadow-blue-100 transition-all duration-300 group-hover:scale-110">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
                    <div className="text-sm text-slate-500 font-medium mt-1">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Core Benefits - Enhanced value props */}
        <section className="py-24 bg-slate-50/50" data-section id="features">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200/50 mb-4">
                <Zap className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-semibold text-slate-700">Why Healthcare Leaders Choose Us</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-slate-900">
                Comprehensive Healthcare <br className="hidden sm:block" />Management Platform
              </h2>
              <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
                Everything you need to run a modern healthcare facility in Nigeria, seamlessly integrated
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {coreBenefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <div
                    key={index}
                    className="group relative bg-white rounded-xl border border-slate-200 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative">
                      <div className={`inline-flex rounded-xl bg-gradient-to-r from-${benefit.color}-500 to-${benefit.color}-600 p-3 mb-4 shadow-lg shadow-${benefit.color}-500/20`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">{benefit.title}</h3>
                      <p className="text-sm text-slate-500 leading-relaxed">{benefit.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Core Modules - Enhanced grid with better UX */}
        <section className="py-24 bg-white" data-section id="solutions">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 bg-teal-50 px-4 py-2 rounded-full shadow-sm border border-teal-200/50 mb-4">
                <Layers className="h-5 w-5 text-teal-600" />
                <span className="text-sm font-semibold text-slate-700">Integrated Modules</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-slate-900">
                Everything You Need in <br className="hidden sm:block" />One Platform
              </h2>
              <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
                Six powerful modules working together to streamline your entire hospital operations
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {coreModules.map((module, index) => {
                const Icon = module.icon;
                return (
                  <div
                    key={index}
                    className="group relative bg-white rounded-xl border border-slate-200 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                    onMouseEnter={() => setHoveredFeature(index)}
                    onMouseLeave={() => setHoveredFeature(null)}
                  >
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-slate-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative">
                      <div
                        className={`inline-flex rounded-xl p-3 mb-4 transition-all duration-300 ${
                          hoveredFeature === index 
                            ? `bg-gradient-to-br ${module.gradient} text-white shadow-lg scale-110` 
                            : 'text-slate-600'
                        }`}
                        style={{
                          backgroundColor: hoveredFeature === index ? undefined : `${module.color}15`,
                        }}
                      >
                        <Icon className={`h-6 w-6 transition-all duration-300 ${hoveredFeature === index ? 'scale-110' : ''}`} />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {module.label}
                      </h3>
                      <p className="text-sm text-slate-500 group-hover:text-slate-700 transition-colors">
                        {module.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Security Section - Enhanced compliance display */}
        <section className="py-24 bg-slate-50/50" data-section id="security">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-full shadow-sm border border-emerald-200/50 mb-4">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  <span className="text-sm font-semibold text-slate-700">Enterprise Security</span>
                </div>
                <h2 className="text-4xl font-bold text-slate-900 mb-4">
                  Bank-Grade Security for <br />Healthcare Data
                </h2>
                <p className="text-lg text-slate-600 mb-6">
                  Your patients' data is protected with the highest standards of security and compliance.
                </p>
                <div className="space-y-4">
                  {complianceBadges.map((badge, index) => {
                    const Icon = badge.icon;
                    return (
                      <div key={index} className="flex items-center gap-3 bg-white px-4 py-3 rounded-lg border border-slate-200">
                        <Icon className="h-5 w-5 text-emerald-500" />
                        <span className="text-sm font-medium text-slate-700">{badge.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="relative">
                <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-sm font-medium text-slate-700">Security Features</span>
                  </div>
                  <div className="space-y-4">
                    {[
                      'End-to-End Encryption',
                      'Role-Based Access Control',
                      'Audit Trails & Logging',
                      'Two-Factor Authentication',
                      'Data Residency in Nigeria',
                      'Regular Security Audits'
                    ].map((feature, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <Check className="h-5 w-5 text-emerald-500" />
                        <span className="text-slate-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials - Enhanced with better social proof */}
        <section className="py-24 bg-white" data-section id="testimonials">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-full shadow-sm border border-amber-200/50 mb-4">
                <Star className="h-5 w-5 text-amber-600" />
                <span className="text-sm font-semibold text-slate-700">Testimonials</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-slate-900">
                Trusted by Healthcare Leaders
              </h2>
              <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
                Real feedback from hospital executives and medical directors across Nigeria
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index} 
                  className="group bg-white rounded-xl border border-slate-200 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-600 leading-relaxed text-sm">"{testimonial.quote}"</p>
                  <div className="mt-4 flex items-center gap-3 border-t border-slate-200 pt-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 text-sm">{testimonial.name}</div>
                      <div className="text-xs text-slate-500">{testimonial.role}</div>
                      <div className="text-xs font-medium text-blue-600">{testimonial.hospital}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA - Enhanced with better conversion */}
        <section className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800" />
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-400/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-400/20 rounded-full blur-3xl animate-float delay-500" />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 mb-6">
              <Rocket className="h-5 w-5 text-white" />
              <span className="text-sm font-semibold text-white">Get Started Today</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
              Ready to Transform Your <br />Hospital Operations?
            </h2>
            <p className="mt-4 text-lg text-blue-100 max-w-2xl mx-auto">
              Join 500+ hospitals across Nigeria using SmartCare HMS to deliver exceptional patient care.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <a href="mailto:official.appbrew@gmail.com" className="group inline-flex items-center gap-3 rounded-xl bg-white px-8 py-4 text-base font-semibold text-blue-600 hover:bg-blue-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105">
                Book a Demo
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <button onClick={() => setIsTourOpen(true)} className="group inline-flex items-center gap-3 rounded-xl border-2 border-white/30 px-8 py-4 text-base font-semibold text-white hover:bg-white/10 transition-all backdrop-blur-sm">
                <PlayCircle className="h-5 w-5 group-hover:scale-110 transition-transform" />
                Watch Tour
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Enterprise Footer */}
      <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="inline-flex rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 p-2">
                  <ShieldCheck className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white">SmartCare<span className="text-blue-400">HMS</span></span>
              </div>
              <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
                Enterprise hospital management platform for Nigerian healthcare institutions.
                Transforming healthcare operations through intelligent technology.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                {['Features', 'Pricing', 'Integrations', 'Security'].map((item) => (
                  <li key={item}><a href="#" className="hover:text-white transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Solutions</h4>
              <ul className="space-y-2 text-sm">
                {['Hospitals', 'Clinics', 'Teaching Hospitals', 'Networks'].map((item) => (
                  <li key={item}><a href="#" className="hover:text-white transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                {['Help Center', 'Contact', 'Status', 'Community'].map((item) => (
                  <li key={item}><a href="#" className="hover:text-white transition-colors">{item}</a></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-slate-800 text-center text-xs text-slate-500">
            <span>© {currentYear} SmartCare HMS. All rights reserved. — Transforming Healthcare Operations Through Intelligent Technology</span>
          </div>
        </div>
      </footer>

      {/* Custom CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(1deg); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
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
      `}</style>

      <TourModal isOpen={isTourOpen} onClose={() => setIsTourOpen(false)} />
    </div>
  );
};

export default SmartCareHMSRedesigned;