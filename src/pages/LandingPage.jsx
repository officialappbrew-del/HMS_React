import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { 
  ShieldCheck, 
  Stethoscope, 
  Activity, 
  Users, 
  Pill, 
  HeartPulse, 
  ArrowRight,
  Microscope,
  Ambulance,
  Brain,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Hospital,
  Shield,
  Sparkles,
  Database,
  GraduationCap,
  Phone,
  Wallet,
  TrendingUp,
  Award,
  Zap,
  Building2,
  Syringe,
  Heart,
  Monitor,
  BarChart3,
  FileCheck,
  Building,
  Truck,
  MessageSquare,
  Video,
  CreditCard,
  Smartphone,
  Globe,
  Lock,
  Fingerprint,
  Bell,
  Gift,
  Target,
  Radio,
  GitBranch,
  Layers,
  Settings,
  UserCheck,
  Calendar,
  Mail,
  Share2,
  Cloud,
  Server,
  HardDrive,
  Wifi,
  Power,
  Droplets,
  Thermometer,
  Weight,
  Ruler,
  Play,
  BookOpen,
  Users2,
  Briefcase,
  FileSpreadsheet,
  ClipboardCheck,
  FileBadge,
  ScrollText,
  Newspaper,
  Trophy,
  BadgeCheck,
  CircleCheck,
  ShieldAlert,
  HeartHandshake,
  Stars,
  Gem,
  Crown,
  Rocket,
  LayoutDashboard,
  CloudOff,
  Headphones,
  Settings2,
  UserPlus,
  Sparkle,
  ChevronRight,
  Star,
  Quote,
  PlayCircle,
  Check,
  MapPin,
  Menu,
  CheckCheck,
  XCircle,
  Loader2,
  Send,
  Paperclip,
  Mic,
  Camera,
  Image,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  LogOut,
  LogIn,
  User,
  HelpCircle,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  Smile,
  Frown,
  Meh,
  UserMinus,
  UserX,
  UserCog,
  Home,
  Map,
  Bluetooth,
  Battery,
  BatteryCharging,
  BatteryFull,
  BatteryLow,
  BatteryMedium,
  BatteryWarning
} from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      icon: Building2,
      title: 'Multi-Tenant Architecture',
      description: 'Each hospital gets their own isolated instance with custom branding, workflows, and configurations'
    },
    {
      icon: Cloud,
      title: 'Cloud-Native Platform',
      description: 'Fully cloud-hosted with automatic updates, backups, and 99.9% uptime guarantee'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'ISO 27001 certified with role-based access, encryption, and comprehensive audit trails'
    },
    {
      icon: Zap,
      title: 'Fast Deployment',
      description: 'Get your hospital live in days, not months. No hardware or IT infrastructure required'
    },
    {
      icon: Settings,
      title: 'Fully Customizable',
      description: 'Configure workflows, forms, billing rules, and reports to match your hospital\'s needs'
    },
    {
      icon: Users,
      title: 'Multi-Branch Support',
      description: 'Manage multiple locations, departments, and facilities from a single dashboard'
    }
  ];

  const pricingPlans = [
    {
      name: 'Starter',
      price: '₦150,000',
      period: '/month',
      description: 'Perfect for small hospitals and clinics',
      features: [
        'Up to 50 beds',
        '5 concurrent users',
        'Basic EMR',
        'Appointment management',
        'Pharmacy management',
        'Email support'
      ],
      cta: 'Start Free Trial',
      popular: false
    },
    {
      name: 'Professional',
      price: '₦350,000',
      period: '/month',
      description: 'Ideal for medium-sized hospitals',
      features: [
        'Up to 150 beds',
        '20 concurrent users',
        'Full EMR with templates',
        'LIS & RIS integration',
        'NHIA/NHIS claims',
        'Priority support',
        'Custom branding',
        'Advanced analytics'
      ],
      cta: 'Start Free Trial',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Contact Us',
      period: '',
      description: 'For large hospitals and healthcare groups',
      features: [
        'Unlimited beds',
        'Unlimited users',
        'All modules included',
        'Multi-branch support',
        '24/7 dedicated support',
        'SLA guarantees',
        'Custom development',
        'On-premise deployment option'
      ],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  const testimonials = [
    {
      name: 'Dr. Adebayo Ogunlesi',
      role: 'Chief Medical Director',
      hospital: 'Lagos University Teaching Hospital',
      quote: 'SmartCare HMS has transformed our hospital operations. The multi-tenant platform allowed us to deploy across all our departments seamlessly.',
      rating: 5
    },
    {
      name: 'Mrs. Chioma Nwosu',
      role: 'Head of Administration',
      hospital: 'National Hospital Abuja',
      quote: 'The NHIA integration and claims management features have significantly improved our revenue cycle. We reduced claim rejections by 60%.',
      rating: 5
    },
    {
      name: 'Dr. Emeka Okonkwo',
      role: 'Medical Director',
      hospital: 'Nigerian Army Reference Hospital',
      quote: 'The clinical decision support and patient safety features are world-class. Our medication error rates dropped by 45% in the first quarter.',
      rating: 5
    }
  ];

  const stats = [
    { value: '500+', label: 'Hospitals Trust Us', icon: Building2 },
    { value: '2M+', label: 'Patients Managed', icon: Users },
    { value: '99.9%', label: 'Uptime Guarantee', icon: Shield },
    { value: '24/7', label: 'Support Available', icon: Headphones }
  ];

  const clinicalModules = [
    { icon: Stethoscope, label: 'EMR & Clinical Documentation' },
    { icon: Microscope, label: 'Laboratory & Diagnostics' },
    { icon: HeartPulse, label: 'Critical Care & ICU' },
    { icon: Pill, label: 'Pharmacy & Inventory' },
    { icon: Ambulance, label: 'Emergency & Triage' },
    { icon: Hospital, label: 'Ward & Bed Management' },
    { icon: Activity, label: 'Revenue Cycle & Billing' },
    { icon: Users, label: 'Staff & HR Management' },
    { icon: FileText, label: 'NHIA/NHIS Claims' },
    { icon: Smartphone, label: 'USSD & Mobile' },
    { icon: Globe, label: 'NCDC Surveillance' },
    { icon: Shield, label: 'Compliance & Security' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="inline-flex rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 p-2 shadow-lg shadow-blue-600/20">
                  <ShieldCheck className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse" />
              </div>
              <div>
                <span className="text-xl font-bold text-slate-900">SmartCare HMS</span>
                <span className="ml-2 text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                  Multi-Tenant SaaS
                </span>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">Features</a>
              <a href="#pricing" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">Pricing</a>
              <a href="#testimonials" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">Testimonials</a>
              <Link 
                to="/login" 
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40"
              >
                Sign In
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <button className="md:hidden p-2 rounded-lg hover:bg-slate-100">
              <Menu className="h-6 w-6 text-slate-600" />
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 sm:py-28">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-purple-600/5 to-transparent" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full border border-green-200 mb-6">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-sm font-medium">Nigeria's Leading Hospital Management Platform</span>
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                  The Complete{' '}
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Hospital OS
                  </span>
                  <br />
                  <span className="text-3xl sm:text-4xl lg:text-5xl">for Nigerian Healthcare</span>
                </h1>
                <p className="mt-6 text-lg text-slate-600 leading-relaxed max-w-lg">
                  SmartCare HMS is a multi-tenant SaaS platform that empowers hospitals to manage 
                  clinical operations, finances, and patient care from a single, secure dashboard.
                </p>
                
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link 
                    to="/signup" 
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-4 text-base font-medium text-white hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40"
                  >
                    Start Free Trial
                    <Rocket className="h-5 w-5" />
                  </Link>
                  <button className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-200 px-6 py-4 text-base font-medium text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all">
                    <Play className="h-5 w-5" />
                    Watch Demo
                  </button>
                </div>

                <div className="mt-8 flex items-center gap-6 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <Check className="h-4 w-4 text-green-500" />
                    No credit card required
                  </span>
                  <span className="flex items-center gap-1">
                    <Check className="h-4 w-4 text-green-500" />
                    14-day free trial
                  </span>
                  <span className="flex items-center gap-1">
                    <Check className="h-4 w-4 text-green-500" />
                    Cancel anytime
                  </span>
                </div>

                <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-6">
                  {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <div key={index} className="text-center">
                        <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                        <div className="text-sm text-slate-500 flex items-center justify-center gap-1">
                          <Icon className="h-3 w-3" />
                          {stat.label}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="hidden lg:block">
                <div className="relative">
                  <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex space-x-1">
                        <div className="w-3 h-3 bg-red-400 rounded-full" />
                        <div className="w-3 h-3 bg-yellow-400 rounded-full" />
                        <div className="w-3 h-3 bg-green-400 rounded-full" />
                      </div>
                      <span className="text-sm text-slate-500 ml-2">Multi-Tenant Dashboard</span>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-blue-50 rounded-xl p-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-blue-600" />
                          <span className="font-medium text-slate-900">Lagos University Teaching Hospital</span>
                        </div>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Active</span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3">
                        <div className="bg-blue-50 p-3 rounded-xl">
                          <div className="text-2xl font-bold text-blue-600">87</div>
                          <div className="text-xs text-slate-600">Occupied Beds</div>
                        </div>
                        <div className="bg-green-50 p-3 rounded-xl">
                          <div className="text-2xl font-bold text-green-600">12</div>
                          <div className="text-xs text-slate-600">ICU Patients</div>
                        </div>
                        <div className="bg-yellow-50 p-3 rounded-xl">
                          <div className="text-2xl font-bold text-yellow-600">4</div>
                          <div className="text-xs text-slate-600">Critical Alerts</div>
                        </div>
                      </div>
                      
                      <div className="border-t border-slate-100 pt-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600">Active Staff</span>
                          <span className="font-semibold text-slate-900">24/32</span>
                        </div>
                        <div className="mt-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600 rounded-full" style={{ width: '75%' }} />
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-slate-500 bg-slate-50 p-2 rounded-lg">
                        <GitBranch className="h-4 w-4" />
                        <span>Managing 3 branches • 12 departments</span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-600/10 rounded-full blur-xl" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trusted By Section */}
        <section className="py-12 bg-white border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-slate-500 mb-6">Trusted by leading healthcare institutions across Nigeria</p>
            <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-60">
              <span className="text-xl font-bold text-slate-400">LUTH</span>
              <span className="text-xl font-bold text-slate-400">National Hospital Abuja</span>
              <span className="text-xl font-bold text-slate-400">NARH</span>
              <span className="text-xl font-bold text-slate-400">UBTH</span>
              <span className="text-xl font-bold text-slate-400">OAUTH</span>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900">Why Hospitals Choose SmartCare HMS</h2>
              <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
                A comprehensive hospital management platform designed for the Nigerian healthcare ecosystem
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="group relative bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-xl transition-all hover:border-blue-200 hover:-translate-y-1">
                    <div className="inline-flex rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-3 mb-4 group-hover:from-blue-100 group-hover:to-blue-200 transition-colors">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">{feature.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Multi-Tenant Benefits */}
        <section className="py-16 bg-gradient-to-br from-blue-600 to-blue-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white">Built for Scale</h2>
              <p className="mt-4 text-blue-100 text-lg max-w-2xl mx-auto">
                SmartCare HMS grows with you. From small clinics to multi-branch hospital networks.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/20">
                <div className="inline-flex rounded-full bg-white/20 p-3 mb-4">
                  <UserPlus className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Easy Onboarding</h3>
                <p className="text-blue-100">Sign up, configure your hospital, and go live in days. No IT expertise required.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/20">
                <div className="inline-flex rounded-full bg-white/20 p-3 mb-4">
                  <GitBranch className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Multi-Branch Management</h3>
                <p className="text-blue-100">Manage multiple locations, departments, and facilities from a single dashboard.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/20">
                <div className="inline-flex rounded-full bg-white/20 p-3 mb-4">
                  <Cloud className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Always Up-to-Date</h3>
                <p className="text-blue-100">Automatic updates with new features and compliance requirements. No manual upgrades.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Clinical Modules */}
        <section className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900">Complete Clinical & Operational Modules</h2>
              <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
                Everything you need to run a modern hospital, all in one platform
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {clinicalModules.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="bg-white rounded-xl border border-slate-200 p-4 text-center hover:shadow-md transition-all hover:border-blue-200">
                    <div className="inline-flex rounded-lg bg-blue-50 p-2 mb-2">
                      <Icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900">Simple, Transparent Pricing</h2>
              <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
                Choose the plan that fits your hospital's needs. All plans include core features.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pricingPlans.map((plan, index) => (
                <div key={index} className={`bg-white rounded-2xl border p-8 ${plan.popular ? 'border-blue-600 shadow-xl relative' : 'border-slate-200'}`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-semibold px-4 py-1 rounded-full">
                      Most Popular
                    </div>
                  )}
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-slate-900">{plan.price}</span>
                      {plan.period && <span className="text-slate-500 ml-1">{plan.period}</span>}
                    </div>
                    <p className="mt-2 text-sm text-slate-600">{plan.description}</p>
                  </div>
                  <ul className="mt-6 space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                        <Check className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button className={`mt-8 w-full rounded-xl px-4 py-3 font-medium transition-all ${
                    plan.popular 
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-600/25' 
                      : 'border-2 border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}>
                    {plan.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-16 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900">What Hospital Leaders Say</h2>
              <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
                Real feedback from healthcare professionals using SmartCare HMS
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-slate-600 italic">"{testimonial.quote}"</p>
                  <div className="mt-4 flex items-center gap-3 border-t border-slate-100 pt-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">{testimonial.name}</div>
                      <div className="text-xs text-slate-500">{testimonial.role}</div>
                      <div className="text-xs text-blue-600">{testimonial.hospital}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white">Ready to Transform Your Hospital?</h2>
            <p className="mt-4 text-blue-100 text-lg">
              Join 500+ hospitals across Nigeria using SmartCare HMS to deliver exceptional patient care.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link 
                to="/signup" 
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-base font-medium text-blue-600 hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl"
              >
                Start Free Trial
                <Rocket className="h-5 w-5" />
              </Link>
              <button className="inline-flex items-center gap-2 rounded-xl border-2 border-white/30 px-6 py-3 text-base font-medium text-white hover:bg-white/10 transition-colors">
                <Headphones className="h-5 w-5" />
                Contact Sales
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;