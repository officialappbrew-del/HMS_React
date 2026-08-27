import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search, Compass, AlertCircle, ArrowRight, X, FileQuestion } from 'lucide-react';
import PublicPageShell from '../components/PublicPageShell';

// ==================== TOOLTIP COMPONENT ====================
const Tooltip = ({ children, text, position = 'top' }) => {
  const [show, setShow] = useState(false);
  
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-1.5',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-1.5',
    left: 'right-full top-1/2 -translate-y-1/2 mr-1.5',
    right: 'left-full top-1/2 -translate-y-1/2 ml-1.5',
  };

  return (
    <div 
      className="relative inline-flex"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onTouchStart={() => setShow(!show)}
    >
      {children}
      {show && (
        <div className={`absolute z-50 ${positionClasses[position]} whitespace-nowrap`}>
          <div className="bg-[#1A1A1A] text-white text-[10px] px-2 py-1 shadow-lg">
            {text}
            <div className={`absolute w-1.5 h-1.5 bg-[#1A1A1A] transform rotate-45 ${
              position === 'top' ? 'bottom-[-3px] left-1/2 -translate-x-1/2' :
              position === 'bottom' ? 'top-[-3px] left-1/2 -translate-x-1/2' :
              position === 'left' ? 'right-[-3px] top-1/2 -translate-y-1/2' :
              'left-[-3px] top-1/2 -translate-y-1/2'
            }`} />
          </div>
        </div>
      )}
    </div>
  );
};

// ==================== BUTTON WITH TOOLTIP ====================
const ButtonWithTooltip = ({ children, onClick, tooltip, variant = 'primary', className = '', disabled = false, size = 'sm', type = 'button' }) => {
  const variantClasses = {
    primary: 'bg-[#008751] hover:bg-[#006B40] text-white',
    secondary: 'bg-white border border-[#D8D4CD] hover:bg-[#F7F5F2] text-[#1A1A1A]',
    outline: 'border border-[#D8D4CD] hover:bg-[#F7F5F2] text-[#1A1A1A]',
  };

  const sizeClasses = {
    sm: 'px-2.5 py-1.5 text-xs',
    md: 'px-3.5 py-2 text-sm',
    lg: 'px-5 py-2.5 text-sm',
  };

  return (
    <Tooltip text={tooltip}>
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`rounded transition-all duration-200 flex items-center gap-1.5 font-medium ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {children}
      </button>
    </Tooltip>
  );
};

// ==================== QUICK TIP CARD ====================
const QuickTipCard = ({ icon: Icon, title, description, className = '' }) => {
  return (
    <div className={`flex items-start gap-3 p-3 bg-[#F7F5F2] border border-[#E8E3DC] ${className}`}>
      <div className="w-8 h-8 rounded-full bg-[#E8F5EF] flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-[#008751]" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-xs font-medium text-[#1A1A1A]">{title}</h4>
        <p className="text-[11px] text-[#5A5A5A] mt-0.5">{description}</p>
      </div>
    </div>
  );
};

// ==================== MAIN NOTFOUND COMPONENT ====================
const NotFound = () => {
  const navigate = useNavigate();

  // Quick tips for users
  const quickTips = [
    {
      icon: Search,
      title: 'Check the URL',
      description: 'Double-check the address for any typos or spelling errors'
    },
    {
      icon: Compass,
      title: 'Page may have moved',
      description: 'The content you\'re looking for might have been relocated'
    },
    {
      icon: AlertCircle,
      title: 'Need help?',
      description: 'Contact support if you believe this is an error'
    }
  ];

  return (
    <div className="dashboard min-h-screen bg-[#F7F5F2] flex items-center justify-center p-3 sm:p-4 lg:p-6 xl:p-8 font-sans">
      <div className="w-full max-w-3xl mx-auto">
        {/* Main Card */}
        <div className="bg-white border border-[#E8E3DC] p-6 sm:p-8 md:p-10 lg:p-12">
          {/* Header with badge */}
          <div className="flex items-center justify-center mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E8F5EF] border border-[#C8E0D5] text-[#008751] text-[10px] font-medium tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#008751]"></span>
              SmartCare HMS
            </span>
          </div>

          {/* Error Icon */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#E8F5EF] flex items-center justify-center">
                <FileQuestion className="w-10 h-10 sm:w-12 sm:h-12 text-[#008751] stroke-[1.5]" />
              </div>
              {/* Decorative ring */}
              <div className="absolute -inset-1 rounded-full border-2 border-[#E8E3DC] animate-pulse opacity-50"></div>
            </div>
          </div>

          {/* Error Code */}
          <div className="text-center mb-4">
            <div className="text-6xl sm:text-7xl md:text-8xl font-display font-bold text-[#1A1A1A] tracking-tight">
              404
            </div>
            <div className="h-0.5 w-16 mx-auto mt-3 bg-[#008751]"></div>
          </div>

          {/* Message */}
          <div className="text-center mb-8">
            <h2 className="text-xl sm:text-2xl font-display font-semibold text-[#1A1A1A] mb-2">
              Page Not Found
            </h2>
            <p className="text-sm sm:text-base text-[#5A5A5A] max-w-md mx-auto">
              The page you were looking for seems to have moved or no longer exists. 
              Let's get you back on track.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
            <ButtonWithTooltip
              onClick={() => navigate('/')}
              tooltip="Go to the homepage"
              variant="primary"
              size="lg"
              className="w-full sm:w-auto min-w-[180px]"
            >
              <Home className="w-4 h-4" />
              Return home
              <ArrowRight className="w-4 h-4" />
            </ButtonWithTooltip>
            <ButtonWithTooltip
              onClick={() => navigate(-1)}
              tooltip="Go back to the previous page"
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto min-w-[140px]"
            >
              <ArrowLeft className="w-4 h-4" />
              Go back
            </ButtonWithTooltip>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-[#E8E3DC]"></div>
            <span className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">
              Quick Tips
            </span>
            <div className="h-px flex-1 bg-[#E8E3DC]"></div>
          </div>

          {/* Quick Tips Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {quickTips.map((tip, index) => (
              <QuickTipCard
                key={index}
                icon={tip.icon}
                title={tip.title}
                description={tip.description}
              />
            ))}
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-[#E8E3DC] text-center">
            <p className="text-[11px] text-[#B0A89E]">
              Need immediate assistance?{' '}
              <button
                onClick={() => window.location.href = 'mailto:support@smartcare.com'}
                className="text-[#008751] hover:text-[#006B40] font-medium transition-colors"
              >
                Contact support
              </button>
            </p>
          </div>
        </div>

        {/* Decorative bottom element */}
        <div className="mt-4 flex items-center justify-center gap-2">
          <div className="h-px w-12 bg-[#E8E3DC]"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-[#008751]"></div>
          <div className="h-px w-12 bg-[#E8E3DC]"></div>
        </div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.05);
          }
        }
        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default NotFound;