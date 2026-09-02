import React, { useState, useEffect, useRef, lazy, Suspense, useCallback, useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { fetchPublicBranding, defaultPublicBranding } from '../utils/publicBranding';

// Lazy load TourModal - only loads when user clicks "Watch the tour"
const TourModal = lazy(() => import('../components/TourModal'));

// ============================================================
// OPTIMIZED ICON COMPONENT - Dynamically imports only needed icons
// ============================================================
const Icon = ({ name, className = '', ...props }) => {
  const [IconComp, setIconComp] = useState(null);
  const mounted = useRef(true);

  useEffect(() => {
    const loadIcon = async () => {
      try {
        const mod = await import('lucide-react');
        const Comp = mod[name];
        if (Comp && mounted.current) {
          setIconComp(() => Comp);
        }
      } catch (e) {
        // Silent fail - placeholder will show
      }
    };
    loadIcon();

    return () => {
      mounted.current = false;
    };
  }, [name]);

  if (!IconComp) {
    return <span className={`inline-block w-5 h-5 bg-[#E2DFD6] rounded-sm ${className}`} />;
  }

  return <IconComp className={className} {...props} />;
};

// ============================================================
// LAZY IMAGE COMPONENT - Loads only when visible
// ============================================================
const LazyImage = ({ src, alt, className = '', priority = false, aspectRatio = 'auto' }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState(priority ? src : undefined);
  const imgRef = useRef(null);

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setImgSrc(src);
          observer.disconnect();
        }
      },
      { rootMargin: '100px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [src, priority]);

  return (
    <div className="relative overflow-hidden" style={{ aspectRatio }}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-[#E2DFD6] animate-pulse" />
      )}
      <img
        ref={imgRef}
        src={imgSrc || ''}
        alt={alt}
        className={`${className} transition-opacity duration-500 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={(e) => {
          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"%3E%3Crect fill="%23E2DFD6" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" font-family="sans-serif" font-size="16" fill="%235B6472" text-anchor="middle" dy=".3em"%3ENo image%3C/text%3E%3C/svg%3E';
          setIsLoaded(true);
        }}
      />
    </div>
  );
};

// ============================================================
// MEMOIZED VITALS COMPONENT - Prevents unnecessary re-renders
// ============================================================
const Vitals = React.memo(({ className = '', stroke = '#E4572E', strokeWidth = 2 }) => (
  <svg viewBox="0 0 400 40" preserveAspectRatio="none" className={className} fill="none">
    <path
      d="M0 20 H130 L145 20 L153 4 L163 36 L172 12 L180 20 H400"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      pathLength="1"
      className="vitals-path"
    />
  </svg>
));

Vitals.displayName = 'Vitals';

// ============================================================
// MAIN COMPONENT
// ============================================================
const SmartCareHMSRedesigned = () => {
  // State
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredModule, setHoveredModule] = useState(null);
  const [visibleSections, setVisibleSections] = useState({});
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [countedStats, setCountedStats] = useState({});
  const [hoveredBenefit, setHoveredBenefit] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [branding, setBranding] = useState(defaultPublicBranding);

  const statsRef = useRef(null);
  const currentYear = new Date().getFullYear();

  // Set mounted state after initial render
  useEffect(() => {
    setMounted(true);
    let isMounted = true;
    fetchPublicBranding().then((data) => {
      if (isMounted) setBranding(data);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // ============================================================
  // SCROLL HANDLER - Debounced for performance
  // ============================================================
  useEffect(() => {
    let timeoutId = null;
    const handleScroll = () => {
      if (timeoutId) return;
      timeoutId = setTimeout(() => {
        setScrolled(window.scrollY > 40);
        timeoutId = null;
      }, 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  // ============================================================
  // SECTION OBSERVER - Reveals sections as they scroll into view
  // ============================================================
  useEffect(() => {
    const sections = document.querySelectorAll('[data-section]');
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => ({ ...prev, [entry.target.id]: true }));
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // ============================================================
  // STAT COUNTER - Uses requestAnimationFrame for smooth animation
  // ============================================================
  useEffect(() => {
    if (!statsRef.current || !mounted) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;

        const statList = [
          { key: 'hospitals', value: 500 },
          { key: 'professionals', value: 25000 },
          { key: 'patients', value: 2000000 },
          { key: 'uptime', value: 99.99 },
        ];

        let startTime = null;
        const duration = 1500;

        const animateStats = (timestamp) => {
          if (!startTime) startTime = timestamp;
          const progress = Math.min((timestamp - startTime) / duration, 1);
          
          // Ease out cubic for smoother deceleration
          const eased = 1 - Math.pow(1 - progress, 3);

          statList.forEach((stat) => {
            const current = stat.value * eased;
            setCountedStats(prev => ({
              ...prev,
              [stat.key]: stat.key === 'uptime' 
                ? Number(current.toFixed(2)) 
                : Math.floor(current)
            }));
          });

          if (progress < 1) {
            requestAnimationFrame(animateStats);
          } else {
            // Set final values
            statList.forEach((stat) => {
              setCountedStats(prev => ({
                ...prev,
                [stat.key]: stat.key === 'uptime' ? stat.value : stat.value
              }));
            });
          }
        };

        requestAnimationFrame(animateStats);
        observer.disconnect();
      },
      { threshold: 0.3 }
    );

    observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, [mounted]);

  // ============================================================
  // MEMOIZED HANDLERS
  // ============================================================
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const openTour = useCallback(() => {
    setIsTourOpen(true);
  }, []);

  const closeTour = useCallback(() => {
    setIsTourOpen(false);
  }, []);

  const handleModuleHover = useCallback((index) => {
    setHoveredModule(index);
  }, []);

  const handleModuleLeave = useCallback(() => {
    setHoveredModule(null);
  }, []);

  const handleBenefitHover = useCallback((index) => {
    setHoveredBenefit(index);
  }, []);

  const handleBenefitLeave = useCallback(() => {
    setHoveredBenefit(null);
  }, []);

  // ============================================================
  // MEMOIZED DATA
  // ============================================================
  const fadeCls = useCallback((id) => {
    return `transition-all duration-700 ease-out ${visibleSections[id] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`;
  }, [visibleSections]);

  const footerSections = useMemo(() => ({
    product: [
      { label: 'Features', to: '/about' },
      { label: 'Pricing', to: '/terms' },
      { label: 'Integrations', to: '/about' },
      { label: 'Security', to: '/privacy' },
    ],
    solutions: [
      { label: 'Hospitals', to: '/about' },
      { label: 'Clinics', to: '/about' },
      { label: 'Teaching Hospitals', to: '/about' },
      { label: 'Networks', to: '/about' },
    ],
    support: [
      { label: 'Help Center', to: '/contact' },
      { label: 'Contact', to: '/contact' },
      { label: 'Status', to: '/terms' },
      { label: 'Community', to: '/contact' },
    ],
  }), []);

  const coreBenefits = useMemo(() => [
    { icon: 'ShieldCheck', tag: 'SECURITY', title: 'Enterprise-grade protection', description: 'HIPAA & NDPR compliant, with end-to-end encryption and granular access controls.' },
    { icon: 'Users', tag: 'RECORDS', title: 'Unified patient records', description: 'Full history, diagnoses, medication, and care plans in a single chart.' },
    { icon: 'Brain', tag: 'AI', title: 'Clinical decision support', description: 'Predictive analytics and automated workflows that reduce clinician load.' },
    { icon: 'BarChart3', tag: 'INSIGHT', title: 'Real-time analytics', description: 'Live dashboards built for operational and clinical decision-making.' },
  ], []);

  const coreModules = useMemo(() => [
    { icon: 'Stethoscope', label: 'Clinical EMR', category: 'CLINICAL', description: 'Electronic medical records built around Nigerian clinical templates.' },
    { icon: 'Users', label: 'Patient Management', category: 'CLINICAL', description: 'Registration, scheduling, and care coordination in one workflow.' },
    { icon: 'Pill', label: 'Pharmacy & Inventory', category: 'OPERATIONS', description: 'Medication management with NAFDAC compliance tracking built in.' },
    { icon: 'Microscope', label: 'Laboratory Information', category: 'CLINICAL', description: 'End-to-end lab workflow with integrated LIS and result tracking.' },
    { icon: 'Hospital', label: 'Ward & Theatre', category: 'OPERATIONS', description: 'Bed management, surgical scheduling, and patient flow, coordinated.' },
    { icon: 'CreditCard', label: 'Billing & Revenue Cycle', category: 'FINANCE', description: 'Multi-payer billing, NHIS claims, and revenue cycle optimization.' },
  ], []);

  const testimonials = useMemo(() => (branding.testimonials || defaultPublicBranding.testimonials).map((t, index) => ({
    ...t,
    avatar: (t.name || 'SC').split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase() || ['SC', 'T'][index % 2],
  })), [branding.testimonials]);

  const stats = useMemo(() => [
    { key: 'hospitals', value: '500+', label: 'Hospitals served', icon: 'Building2' },
    { key: 'professionals', value: '25,000+', label: 'Healthcare professionals', icon: 'Users' },
    { key: 'patients', value: '2M+', label: 'Patients managed', icon: 'Heart' },
    { key: 'uptime', value: '99.99%', label: 'Uptime guarantee', icon: 'ShieldCheck' },
  ], []);

  const complianceBadges = useMemo(() => ['HIPAA Compliant', 'NDPR Certified', 'ISO 27001', 'NHIS Accredited', 'SOC 2 Type II'], []);
  const securityFeatures = useMemo(() => [
    'End-to-end encryption',
    'Role-based access control',
    'Audit trails & logging',
    'Two-factor authentication',
    'Data residency in Nigeria',
    'Regular independent security audits',
  ], []);

  const navItems = useMemo(() => ['Features', 'Solutions', 'Security', 'Testimonials'], []);

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="min-h-screen bg-[#F8F7F3] font-['IBM_Plex_Sans',system-ui,sans-serif] antialiased text-[#0A2540]">
      <style>{`
        .font-display { font-family: 'Space Grotesk', system-ui, sans-serif; }
        .font-mono { font-family: 'IBM Plex Mono', ui-monospace, monospace; }

        .vitals-path {
          stroke-dasharray: 1;
          stroke-dashoffset: 1;
          animation: draw-vitals 1.8s ease-out forwards, sweep-vitals 6s ease-in-out 1.8s infinite;
        }
        @keyframes draw-vitals {
          to { stroke-dashoffset: 0; }
        }
        @keyframes sweep-vitals {
          0%, 100% { opacity: 0.75; }
          50% { opacity: 1; }
        }

        .pulse-dot {
          animation: pulse-dot 2.4s ease-in-out infinite;
          will-change: opacity;
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.45; }
        }

        .card-lift {
          will-change: transform, box-shadow;
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }
        .card-lift:hover {
          transform: translateY(-3px);
          box-shadow: 0 16px 32px -16px rgba(10, 37, 64, 0.18);
        }

        .fade-in-up {
          animation: fadeInUp 0.35s ease-out forwards;
          will-change: transform, opacity;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (prefers-reduced-motion: reduce) {
          .vitals-path { animation: none; stroke-dashoffset: 0; }
          .pulse-dot { animation: none; }
          .card-lift:hover { transform: none; }
          .fade-in-up { animation: none; opacity: 1; transform: none; }
        }
      `}</style>

      {/* ============================================================ */}
      {/* NAVIGATION */}
      {/* ============================================================ */}
      <header className={`fixed top-0 z-50 w-full transition-colors duration-300 ${
        scrolled ? 'bg-[#F8F7F3]/95 backdrop-blur-md border-b border-[#E2DFD6] shadow-sm' : 'bg-[#F8F7F3] border-b border-[#E2DFD6]/40'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18 py-2">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="flex items-center justify-center w-9 h-9 rounded-md bg-[#0A2540] shrink-0">
                <Icon name="ShieldCheck" className="h-5 w-5 text-white" strokeWidth={2} />
              </div>
              <div className="leading-none min-w-0">
                <div className="font-display text-base sm:text-lg font-semibold tracking-tight text-[#0A2540] truncate">
                  {branding.site_name || 'SmartCare HMS'}
                </div>
                <div className="font-mono text-[10px] tracking-widest text-[#5B6472] mt-0.5 hidden sm:block">ENTERPRISE PLATFORM</div>
              </div>
            </div>

            <nav className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="relative text-sm font-medium text-[#5B6472] hover:text-[#0A2540] transition-colors duration-200 group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#0B6E4F] transition-all duration-200 group-hover:w-full" />
                </a>
              ))}
              <RouterLink
                to="/login"
                className="inline-flex items-center gap-2 rounded-md border border-[#E2DFD6] bg-white px-4 py-2 text-sm font-medium text-[#0A2540] hover:border-[#0A2540] transition-colors duration-200"
              >
                Sign In
                <Icon name="LogIn" className="h-4 w-4" />
              </RouterLink>
              <a
                href="/signup"
                className="group inline-flex items-center gap-2 rounded-md bg-[#0B6E4F] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#084A36] transition-colors duration-200"
              >
                Book a Demo
                <Icon name="ArrowRight" className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </a>
            </nav>

            <button
              onClick={toggleMobileMenu}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
              className="lg:hidden p-2 -mr-2 rounded-md hover:bg-[#EDEAE1] transition-colors duration-200"
            >
              <Icon name={isMobileMenuOpen ? 'X' : 'Menu'} className="h-6 w-6" />
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="lg:hidden bg-[#F8F7F3] border-t border-[#E2DFD6] fade-in-up">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col gap-1">
              {navItems.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={closeMobileMenu}
                  className="text-sm text-[#5B6472] hover:text-[#0A2540] py-2.5 px-3 rounded-md hover:bg-white transition-colors duration-200"
                >
                  {item}
                </a>
              ))}
              <RouterLink
                to="/login"
                onClick={closeMobileMenu}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-[#E2DFD6] bg-white px-4 py-3 mt-2 text-sm font-medium text-[#0A2540] hover:bg-[#F8F7F3] transition-colors duration-200"
              >
                Sign In <Icon name="LogIn" className="h-4 w-4" />
              </RouterLink>
              <a
                href="/signup"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-[#0B6E4F] px-4 py-3 mt-2 text-sm font-semibold text-white hover:bg-[#084A36] transition-colors duration-200"
              >
                Book a Demo
              </a>
            </div>
          </div>
        )}
      </header>

      {/* ============================================================ */}
      {/* TOP IMAGE BANNER */}
      {/* ============================================================ */}
      <div className="relative w-full bg-[#0A2540] border-b border-[#E2DFD6]/20 mt-16 lg:mt-18">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="relative overflow-hidden rounded-xl shadow-xl">
            <LazyImage
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=80&fm=webp"
              alt="SmartCare HMS — healthcare management platform"
              className="w-full h-auto max-h-[120px] sm:max-h-[170px] lg:max-h-[220px] object-cover rounded-xl"
              priority={true}
              aspectRatio="1200/220"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0A2540]/70 via-[#0A2540]/25 to-transparent rounded-xl" />
            <div className="absolute inset-0 flex items-center px-5 sm:px-8">
              <div>
                <span className="font-mono text-[10px] tracking-[0.2em] text-white/60 uppercase">Enterprise Platform</span>
                <h2 className="font-display text-lg sm:text-2xl lg:text-3xl font-semibold text-white mt-1">
                  {branding.site_name || 'SmartCare HMS'}
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* MAIN CONTENT */}
      {/* ============================================================ */}
      <main>
        {/* HERO */}
        <section id="hero" className="relative pt-10 pb-16 sm:pt-12 sm:pb-20 lg:pt-16 lg:pb-28 overflow-hidden" data-section>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-12 items-start">
              {/* Left Column */}
              <div className={`pt-2 lg:pt-4 ${fadeCls('hero')}`}>
                <div className="inline-flex items-center gap-2 font-mono text-xs tracking-widest text-[#0B6E4F] border border-[#0B6E4F]/25 bg-[#0B6E4F]/5 px-3 py-1.5 rounded-full mb-6 sm:mb-7">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="inline-flex rounded-full h-1.5 w-1.5 bg-[#0B6E4F] pulse-dot" />
                  </span>
                  LIVE ACROSS 500+ NIGERIAN HOSPITALS
                </div>

                <h1 className="font-display text-[2.25rem] leading-[1.1] sm:text-5xl lg:text-6xl font-semibold tracking-tight text-[#0A2540]">
                  The hospital
                  <br />
                  runs on one system.
                  <br />
                  <span className="text-[#0B6E4F] relative inline-block">
                    SmartCare does the rest.
                    <span className="absolute -bottom-1 left-0 w-full h-1 bg-[#0B6E4F]/20 rounded-full" />
                  </span>
                </h1>

                <p className="mt-6 sm:mt-7 text-base sm:text-lg text-[#5B6472] leading-relaxed max-w-xl">
                  Patient care, clinical operations, pharmacy, laboratory, billing, and workforce
                  management — unified in a single platform built for Nigerian healthcare.
                </p>

                <div className="mt-8 sm:mt-9 flex flex-wrap gap-3 sm:gap-4">
                  <a
                    href="/signup"
                    className="group inline-flex items-center gap-2 rounded-md bg-[#0B6E4F] px-6 sm:px-7 py-3 sm:py-3.5 text-base font-semibold text-white hover:bg-[#084A36] transition-colors duration-200"
                  >
                    Book a Demo
                    <Icon name="ArrowRight" className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </a>
                  <button
                    onClick={openTour}
                    className="group inline-flex items-center gap-2 rounded-md border border-[#0A2540]/15 px-6 sm:px-7 py-3 sm:py-3.5 text-base font-medium text-[#0A2540] hover:bg-white hover:border-[#0A2540]/30 transition-colors duration-200"
                  >
                    <Icon name="PlayCircle" className="h-4 w-4" />
                    Watch the tour
                  </button>
                </div>

                <div className="mt-8 sm:mt-9 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[#5B6472]">
                  {['Free demo', '14-day trial', 'No commitment'].map((t) => (
                    <span key={t} className="flex items-center gap-2">
                      <Icon name="Check" className="h-4 w-4 text-[#0B6E4F]" />
                      <span>{t}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Right Column */}
              <div className="relative">
                <div className="relative rounded-xl overflow-hidden">
                  <LazyImage
                    src="https://images.unsplash.com/photo-1517120026326-d87759a7b63b?auto=format&fit=crop&w=1200&q=80&fm=webp"
                    alt="Clinical staff on a hospital ward"
                    className="w-full h-[220px] sm:h-[300px] lg:h-[380px] object-cover"
                    priority={true}
                    aspectRatio="1200/380"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A2540]/80 via-[#0A2540]/15 to-[#0B6E4F]/10 mix-blend-multiply" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A2540]/40 to-transparent" />
                  <span className="absolute bottom-4 left-5 font-mono text-[10px] tracking-widest text-white/70">
                    LAGOS UNIVERSITY TEACHING HOSPITAL
                  </span>
                </div>

                <div className="mt-6 bg-white rounded-xl border border-[#E2DFD6] shadow-[0_20px_50px_-20px_rgba(10,37,64,0.3)] overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2DFD6]">
                    <span className="font-mono text-xs tracking-widest text-[#5B6472]">COMMAND CENTER</span>
                    <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-widest text-[#0B6E4F]">
                      <Icon name="Activity" className="h-3.5 w-3.5" /> <span className="pulse-dot">LIVE</span>
                    </span>
                  </div>

                  <div className="px-5 pt-4">
                    <Vitals className="w-full h-8" />
                  </div>

                  <div className="grid grid-cols-2 gap-px bg-[#E2DFD6] mx-5 my-4 rounded-md overflow-hidden border border-[#E2DFD6]">
                    {[
                      { label: 'Active Patients', value: '342' },
                      { label: 'Bed Occupancy', value: '87%' },
                      { label: 'Appointments Today', value: '24' },
                      { label: 'Critical Cases', value: '05' },
                    ].map((item) => (
                      <div key={item.label} className="bg-white p-4">
                        <div className="font-mono text-xl sm:text-2xl font-semibold text-[#0A2540]">{item.value}</div>
                        <div className="text-xs text-[#5B6472] mt-1">{item.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="px-5 pb-5">
                    <div className="font-mono text-[10px] tracking-widest text-[#5B6472] mb-3">RECENT ACTIVITY</div>
                    <div className="space-y-3">
                      {[
                        { time: '2m', event: 'New patient registered — Grace Adebayo' },
                        { time: '15m', event: 'Lab results updated — 12 tests completed' },
                        { time: '1h', event: 'Pharmacy order dispensed — 45 medications' },
                      ].map((a) => (
                        <div key={a.event} className="flex items-start gap-3 text-sm">
                          <span className="font-mono text-[10px] text-[#5B6472] mt-0.5 w-6 shrink-0">{a.time}</span>
                          <span className="text-[#0A2540]/80">{a.event}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Vitals className="w-full h-6 mt-14 sm:mt-16 opacity-60" strokeWidth={1.5} />
        </section>

        {/* STATS */}
        <section ref={statsRef} className="py-12 sm:py-14 bg-white border-y border-[#E2DFD6]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
              {stats.map((stat) => {
                const displayValue = countedStats[stat.key] !== undefined
                  ? countedStats[stat.key] + (stat.key === 'uptime' ? '%' : stat.key === 'hospitals' ? '+' : stat.key === 'professionals' ? '+' : stat.key === 'patients' ? '+' : '')
                  : stat.value;
                return (
                  <div key={stat.label} className="flex items-start gap-3">
                    <Icon name={stat.icon} className="h-5 w-5 text-[#0B6E4F] mt-1 shrink-0" strokeWidth={1.75} />
                    <div className="min-w-0">
                      <div className="font-mono text-xl sm:text-2xl lg:text-3xl font-semibold text-[#0A2540]">
                        {displayValue}
                      </div>
                      <div className="text-xs sm:text-sm text-[#5B6472] mt-0.5">{stat.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* BENEFITS */}
        <section className="py-16 sm:py-24" data-section id="features">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`max-w-2xl mb-12 sm:mb-16 ${fadeCls('features')}`}>
              <div className="font-mono text-xs tracking-widest text-[#0B6E4F] mb-4 flex items-center gap-2">
                <Icon name="Zap" className="h-4 w-4" />
                WHY HOSPITALS CHOOSE SMARTCARE
              </div>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-[#0A2540]">
                A platform built for how Nigerian hospitals actually run
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#E2DFD6] border border-[#E2DFD6] rounded-lg overflow-hidden">
              {coreBenefits.map((benefit, index) => {
                const isVisible = visibleSections['features'];
                return (
                  <div
                    key={benefit.title}
                    className={`bg-white p-6 sm:p-7 transition-opacity transition-transform duration-500 card-lift cursor-default ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                    }`}
                    style={{ transitionDelay: `${index * 90}ms` }}
                    onMouseEnter={() => handleBenefitHover(index)}
                    onMouseLeave={handleBenefitLeave}
                  >
                    <div className="font-mono text-[10px] tracking-widest text-[#0B6E4F] mb-5">{benefit.tag}</div>
                    <Icon name={benefit.icon} className={`h-6 w-6 mb-4 transition-colors duration-200 ${hoveredBenefit === index ? 'text-[#0B6E4F]' : 'text-[#0A2540]'}`} strokeWidth={1.5} />
                    <h3 className="font-display text-base font-semibold text-[#0A2540] mb-2">{benefit.title}</h3>
                    <p className="text-sm text-[#5B6472] leading-relaxed">{benefit.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* MODULES */}
        <section className="py-16 sm:py-24 bg-white border-y border-[#E2DFD6]" data-section id="solutions">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`max-w-2xl mb-12 sm:mb-16 ${fadeCls('solutions')}`}>
              <div className="font-mono text-xs tracking-widest text-[#0B6E4F] mb-4 flex items-center gap-2">
                <Icon name="Layers" className="h-4 w-4" />
                INTEGRATED MODULES
              </div>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-[#0A2540]">
                Six modules. One record. Zero handoffs.
              </h2>
              <p className="mt-4 text-[#5B6472] leading-relaxed">
                Every module reads and writes to the same patient record, so nothing gets lost between departments.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {coreModules.map((module, index) => {
                const active = hoveredModule === index;
                const isVisible = visibleSections['solutions'];
                return (
                  <div
                    key={module.label}
                    onMouseEnter={() => handleModuleHover(index)}
                    onMouseLeave={handleModuleLeave}
                    className={`rounded-lg border p-6 transition-opacity transition-transform duration-500 cursor-default card-lift ${
                      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                    } ${
                      active ? 'border-[#0B6E4F] bg-[#0B6E4F]/[0.03]' : 'border-[#E2DFD6] bg-[#F8F7F3]'
                    }`}
                    style={{ transitionDelay: `${index * 70}ms` }}
                  >
                    <div className="flex items-center justify-between mb-5">
                      <Icon name={module.icon} className={`h-6 w-6 transition-colors duration-200 ${active ? 'text-[#0B6E4F]' : 'text-[#0A2540]'}`} strokeWidth={1.5} />
                      <span className="font-mono text-[10px] tracking-widest text-[#5B6472]">{module.category}</span>
                    </div>
                    <h3 className="font-display text-base font-semibold text-[#0A2540] mb-2">{module.label}</h3>
                    <p className="text-sm text-[#5B6472] leading-relaxed">{module.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* SECURITY */}
        <section className="py-16 sm:py-24" data-section id="security">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-start ${fadeCls('security')}`}>
              <div>
                <div className="font-mono text-xs tracking-widest text-[#0B6E4F] mb-4 flex items-center gap-2">
                  <Icon name="Lock" className="h-4 w-4" />
                  ENTERPRISE SECURITY
                </div>
                <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-[#0A2540] mb-5">
                  Held to the same standard as the data it protects
                </h2>
                <p className="text-[#5B6472] leading-relaxed mb-8">
                  Patient data is protected end to end, with independent audits and a compliance
                  posture built for regulated healthcare environments.
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {complianceBadges.map((badge, idx) => (
                    <span
                      key={badge}
                      className={`inline-flex items-center gap-2 text-sm font-medium text-[#0A2540] bg-white border border-[#E2DFD6] px-3.5 py-2 rounded-md transition-colors duration-200 hover:border-[#0B6E4F] ${
                        visibleSections['security'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
                      }`}
                      style={{ transitionDelay: `${idx * 60}ms`, transition: 'opacity 0.5s ease, transform 0.5s ease, border-color 0.2s ease' }}
                    >
                      <Icon name="ShieldCheck" className="h-4 w-4 text-[#0B6E4F]" />
                      {badge}
                    </span>
                  ))}
                </div>
              </div>

              <div className={`bg-[#0A2540] rounded-xl p-7 sm:p-8 transition-all duration-700 ${
                visibleSections['security'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}>
                <div className="flex items-center gap-2 mb-6">
                  <span className="w-2 h-2 rounded-full bg-[#0B6E4F] pulse-dot" />
                  <span className="font-mono text-xs tracking-widest text-white/70">SECURITY LAYER</span>
                </div>
                <div className="space-y-4">
                  {securityFeatures.map((feature, idx) => (
                    <div key={feature} className={`flex items-center gap-3 transition-all duration-500 ${
                      visibleSections['security'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-3'
                    }`} style={{ transitionDelay: `${idx * 70 + 200}ms` }}>
                      <Icon name="Check" className="h-4 w-4 text-[#0B6E4F] shrink-0" />
                      <span className="text-white/85 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-16 sm:py-24 bg-white border-y border-[#E2DFD6]" data-section id="testimonials">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className={`max-w-2xl mb-12 sm:mb-16 ${fadeCls('testimonials')}`}>
              <div className="font-mono text-xs tracking-widest text-[#0B6E4F] mb-4 flex items-center gap-2">
                <Icon name="Star" className="h-4 w-4" />
                FROM THE FIELD
              </div>
              <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-[#0A2540]">
                Trusted by healthcare leaders across Nigeria
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
              {testimonials.map((t, index) => (
                <div
                  key={t.name}
                  className={`border border-[#E2DFD6] rounded-lg p-6 bg-[#F8F7F3] transition-opacity transition-transform duration-500 card-lift ${
                    visibleSections['testimonials'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                  }`}
                  style={{ transitionDelay: `${index * 90}ms` }}
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Icon key={i} name="Star" className="h-3.5 w-3.5 fill-[#B98A32] text-[#B98A32]" />
                    ))}
                  </div>
                  <p className="text-[#0A2540]/85 text-sm leading-relaxed">{t.quote}</p>
                  <div className="mt-6 flex items-center gap-3 border-t border-[#E2DFD6] pt-5">
                    <div className="w-9 h-9 rounded-md bg-[#0A2540] flex items-center justify-center text-white font-mono text-xs font-semibold shrink-0">
                      {t.avatar}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-[#0A2540] text-sm truncate">{t.name}</div>
                      <div className="text-xs text-[#5B6472] truncate">{t.role}</div>
                      <div className="text-xs font-medium text-[#0B6E4F] truncate">{t.hospital}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="relative py-16 sm:py-24 overflow-hidden">
          <LazyImage
            src="https://images.unsplash.com/photo-1551601651-09492b5468b6?auto=format&fit=crop&w=1600&q=80&fm=webp"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            aspectRatio="1600/600"
          />
          <div className="absolute inset-0 bg-[#0A2540]/92" />
          <Vitals className="absolute top-0 left-0 w-full h-10 opacity-15" stroke="#ffffff" strokeWidth={1.5} />

          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
            <div className="font-mono text-xs tracking-widest text-[#0B6E4F] mb-5 flex items-center justify-center gap-2">
              <Icon name="Rocket" className="h-4 w-4" />
              GET STARTED
            </div>
            <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white leading-tight">
              Ready to run your hospital
              <br />on one system?
            </h2>
            <p className="mt-5 text-base sm:text-lg text-white/70 max-w-xl mx-auto">
              Join 500+ hospitals across Nigeria delivering better care with SmartCare HMS.
            </p>
            <div className="mt-9 sm:mt-10 flex flex-wrap justify-center gap-3 sm:gap-4">
              <a
                href="/signup"
                className="group inline-flex items-center gap-2 rounded-md bg-white px-6 sm:px-7 py-3 sm:py-3.5 text-base font-semibold text-[#0A2540] hover:bg-[#F8F7F3] transition-colors duration-200"
              >
                Book a Demo
                <Icon name="ArrowRight" className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </a>
              <button
                onClick={openTour}
                className="inline-flex items-center gap-2 rounded-md border border-white/25 px-6 sm:px-7 py-3 sm:py-3.5 text-base font-medium text-white hover:bg-white/10 hover:border-white/40 transition-colors duration-200"
              >
                <Icon name="PlayCircle" className="h-4 w-4" />
                Watch the tour
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* ============================================================ */}
      {/* FOOTER */}
      {/* ============================================================ */}
      <footer className="bg-[#0A2540] text-white/70 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-9 h-9 rounded-md bg-white/10 shrink-0">
                  <Icon name="ShieldCheck" className="h-5 w-5 text-white" />
                </div>
                <span className="font-display text-base font-semibold text-white">
                  {branding.site_name || 'SmartCare HMS'}
                </span>
              </div>
              <p className="text-sm text-white/55 max-w-sm leading-relaxed">
                Enterprise hospital management for Nigerian healthcare institutions —
                one platform for clinical, operational, and financial workflows.
              </p>
            </div>
            {Object.entries({ Product: footerSections.product, Solutions: footerSections.solutions, Support: footerSections.support }).map(([heading, links]) => (
              <div key={heading}>
                <h4 className="font-mono text-xs tracking-widest text-white/50 mb-4">{heading.toUpperCase()}</h4>
                <ul className="space-y-2.5 text-sm">
                  {links.map((item) => (
                    <li key={item.label}>
                      <RouterLink to={item.to} className="hover:text-white transition-colors duration-200">
                        {item.label}
                      </RouterLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 pt-6 border-t border-white/10 text-center text-xs text-white/40">
            {branding.footer_text || `© ${currentYear} SmartCare HMS. All rights reserved.`}
          </div>
        </div>
      </footer>

      {/* ============================================================ */}
      {/* TOUR MODAL - Lazy Loaded */}
      {/* ============================================================ */}
      {isTourOpen && (
        <Suspense fallback={
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8">
              <div className="animate-pulse">Loading tour...</div>
            </div>
          </div>
        }>
          <TourModal isOpen={isTourOpen} onClose={closeTour} />
        </Suspense>
      )}
    </div>
  );
};

export default SmartCareHMSRedesigned;