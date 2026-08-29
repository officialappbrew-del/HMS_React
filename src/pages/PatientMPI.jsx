import { useEffect, useState, useMemo } from 'react';
import { 
  AlertTriangle, CheckCircle2, GitMerge, History, RotateCcw, 
  Search, ShieldCheck, X, Users, Phone, Calendar,
  Clock,  ChevronLeft,  ChevronRight,  Loader2, Info,
  FileText,  RefreshCw,  Eye,  ArrowUp,  ArrowDown} from 'lucide-react';
import { apiRequest } from '../utils/api';

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

// ==================== ICON BUTTON ====================
const IconButton = ({ icon: Icon, onClick, tooltip, variant = 'default', className = '', disabled = false, size = 'sm' }) => {
  const variantClasses = {
    default: 'text-[#5A5A5A] hover:text-[#1A1A1A] hover:bg-[#F0EDE8]',
    primary: 'text-[#008751] hover:text-[#006B40] hover:bg-[#E8F5EF]',
    success: 'text-[#2D7D46] hover:text-[#1E5F33] hover:bg-[#EAF3EE]',
    danger: 'text-[#C8553D] hover:text-[#A8442E] hover:bg-[#F5EDEA]',
    warning: 'text-[#C87D3D] hover:text-[#A8662E] hover:bg-[#F5F0EA]',
    info: 'text-[#008751] hover:text-[#006B40] hover:bg-[#E8F5EF]',
  };

  const sizeClasses = {
    sm: 'p-1',
    md: 'p-1.5',
    lg: 'p-2',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <Tooltip text={tooltip}>
      <button
        onClick={onClick}
        disabled={disabled}
        className={`rounded transition-all duration-200 ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <Icon className={iconSizes[size]} />
      </button>
    </Tooltip>
  );
};

// ==================== BUTTON WITH TOOLTIP ====================
const ButtonWithTooltip = ({ children, onClick, tooltip, variant = 'primary', className = '', disabled = false, size = 'sm', type = 'button' }) => {
  const variantClasses = {
    primary: 'bg-[#008751] hover:bg-[#006B40] text-white',
    secondary: 'bg-white border border-[#D8D4CD] hover:bg-[#F7F5F2] text-[#1A1A1A]',
    success: 'bg-[#2D7D46] hover:bg-[#1E5F33] text-white',
    danger: 'bg-[#C8553D] hover:bg-[#A8442E] text-white',
    warning: 'bg-[#C87D3D] hover:bg-[#A8662E] text-white',
    outline: 'border border-[#D8D4CD] hover:bg-[#F7F5F2] text-[#1A1A1A]',
    gold: 'bg-[#B8860B] hover:bg-[#9A7209] text-white',
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

// ==================== STATS CARD ====================
const StatsCard = ({ title, value, subValue, icon: Icon, color, trend, trendValue, tooltip, onClick, className = '' }) => {
  const trendColors = {
    up: 'text-[#2D7D46]',
    down: 'text-[#C8553D]',
    neutral: 'text-[#5A5A5A]'
  };

  const colorMap = {
    green: 'bg-[#008751]',
    gold: 'bg-[#B8860B]',
    terracotta: 'bg-[#C8553D]',
    warm: 'bg-[#C87D3D]',
    slate: 'bg-[#4A5A5A]',
    purple: 'bg-[#6B4C9A]',
    blue: 'bg-[#2C6B8A]',
  };

  return (
    <Tooltip text={tooltip}>
      <div 
        onClick={onClick}
        className={`bg-white border border-[#E8E3DC] p-4 sm:p-5 ${onClick ? 'cursor-pointer hover:border-[#008751] transition-colors' : ''} ${className}`}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">{title}</p>
            <p className="mt-1 text-xl sm:text-2xl lg:text-3xl font-display font-bold text-[#1A1A1A] tracking-tight truncate">{value}</p>
            {subValue && (
              <p className="text-xs text-[#5A5A5A] mt-0.5 truncate">{subValue}</p>
            )}
            {trend && (
              <div className={`flex items-center mt-1 text-xs ${trendColors[trend]} font-medium`}>
                {trend === 'up' && <ArrowUp className="w-3 h-3 mr-0.5 flex-shrink-0" />}
                {trend === 'down' && <ArrowDown className="w-3 h-3 mr-0.5 flex-shrink-0" />}
                <span className="truncate">{trendValue}</span>
              </div>
            )}
          </div>
          <div className={`w-10 h-10 lg:w-12 lg:h-12 ${colorMap[color]} rounded flex items-center justify-center flex-shrink-0 ml-3`}>
            <Icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
          </div>
        </div>
      </div>
    </Tooltip>
  );
};

// ==================== EMPTY STATE ====================
const EmptyState = ({ icon: Icon, title, description, action }) => {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-[#F7F5F2] rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon className="w-8 h-8 text-[#D8D4CD]" />
      </div>
      <h3 className="text-sm font-medium text-[#1A1A1A]">{title}</h3>
      <p className="text-sm text-[#5A5A5A] mt-1">{description}</p>
      {action && (
        <div className="mt-4">
          {action}
        </div>
      )}
    </div>
  );
};

// ==================== PAGINATION ====================
const Pagination = ({ currentPage, totalPages, onPageChange, itemsPerPage, totalItems, onItemsPerPageChange }) => {
  if (totalPages <= 1) return null;

  const generatePages = () => {
    const pages = [];
    const maxVisible = 5;
    const halfVisible = Math.floor(maxVisible / 2);
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= halfVisible + 1) {
        for (let i = 1; i <= maxVisible; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - halfVisible) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - maxVisible + 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - halfVisible; i <= currentPage + halfVisible; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 pt-4 border-t border-[#E8E3DC]">
      <div className="flex items-center gap-2 text-xs text-[#5A5A5A]">
        <span>Showing</span>
        <select
          value={itemsPerPage}
          onChange={onItemsPerPageChange}
          className="border border-[#D8D4CD] rounded px-2 py-1 text-xs bg-white focus:border-[#008751] focus:outline-none"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
        <span>per page</span>
        <span className="hidden sm:inline text-[#B0A89E]">({totalItems} total)</span>
      </div>
      
      <div className="flex items-center gap-1">
        <IconButton
          icon={ChevronLeft}
          onClick={() => onPageChange(currentPage - 1)}
          tooltip="Previous"
          variant="default"
          disabled={currentPage === 1}
          size="sm"
        />
        {generatePages().map((page, index) => (
          page === '...' ? (
            <span key={`ellipsis-${index}`} className="px-2 text-[#5A5A5A]">…</span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                currentPage === page
                  ? 'bg-[#008751] text-white'
                  : 'text-[#5A5A5A] hover:bg-[#F0EDE8]'
              }`}
            >
              {page}
            </button>
          )
        ))}
        <IconButton
          icon={ChevronRight}
          onClick={() => onPageChange(currentPage + 1)}
          tooltip="Next"
          variant="default"
          disabled={currentPage === totalPages}
          size="sm"
        />
      </div>
    </div>
  );
};

// ==================== PATIENT CARD COMPONENT ====================
const PatientCard = ({ patient, selected, onSelect }) => {
  const label = (p) => p?.full_name || [p?.first_name, p?.middle_name, p?.last_name].filter(Boolean).join(' ') || 'Unnamed patient';
  const identifier = (p) => p?.mrn || p?.hospital_number || `#${p?.id}`;

  return (
    <button 
      type="button" 
      onClick={() => onSelect(patient)} 
      className={`w-full border p-3 text-left transition-all duration-200 ${
        selected 
          ? 'border-[#B8860B] bg-[#F6F2E7] shadow-sm' 
          : 'border-[#E8E3DC] bg-white hover:border-[#B8860B] hover:bg-[#FAF8F5]'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#E8F5EF] flex items-center justify-center text-[#008751] font-display font-medium text-sm flex-shrink-0">
              {label(patient).charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-[#1A1A1A]">{label(patient)}</p>
              <p className="font-mono text-[11px] text-[#5A5A5A]">{identifier(patient)}</p>
            </div>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[#5A5A5A]">
            {patient.date_of_birth && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {patient.date_of_birth}
              </span>
            )}
            {patient.phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                {patient.phone}
              </span>
            )}
          </div>
          {patient.email && (
            <p className="mt-0.5 truncate text-xs text-[#B0A89E]">{patient.email}</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          {patient.is_merged ? (
            <span className="inline-flex px-2 py-0.5 text-[10px] font-semibold uppercase bg-[#F5F0EA] text-[#C87D3D] border border-[#F0E8DC]">
              <GitMerge className="w-3 h-3 mr-1" />
              Merged
            </span>
          ) : (
            <span className="inline-flex px-2 py-0.5 text-[10px] font-semibold uppercase bg-[#EAF3EE] text-[#2D7D46] border border-[#D0E3D8]">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Active
            </span>
          )}
          {patient.duplicate_score !== undefined && (
            <span className="text-[10px] text-[#B0A89E]">
              Score: {patient.duplicate_score}%
            </span>
          )}
        </div>
      </div>
    </button>
  );
};

// ==================== MAIN PATIENT MPI COMPONENT ====================
const PatientMPI = () => {
  const [query, setQuery] = useState('');
  const [patients, setPatients] = useState([]);
  const [history, setHistory] = useState([]);
  const [source, setSource] = useState(null);
  const [survivor, setSurvivor] = useState(null);
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [working, setWorking] = useState(false);
  const [message, setMessage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showMergeHistory, setShowMergeHistory] = useState(true);

  const label = (p) => p?.full_name || [p?.first_name, p?.middle_name, p?.last_name].filter(Boolean).join(' ') || 'Unnamed patient';
  const identifier = (p) => p?.mrn || p?.hospital_number || `#${p?.id}`;

  const load = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const [mpi, merges] = await Promise.all([
        apiRequest(`/api/v1/patients/patients/mpi/?search=${encodeURIComponent(query)}`),
        apiRequest('/api/v1/patients/patients/merge-history/')
      ]);
      setPatients(mpi.results || []);
      setHistory(Array.isArray(merges) ? merges : merges.results || []);
      
      // Auto-select first two potential duplicates if found
      const potentialDuplicates = (mpi.results || []).filter(p => p.duplicate_score > 70);
      if (potentialDuplicates.length >= 2 && !source && !survivor) {
        setSource(potentialDuplicates[0]);
        setSurvivor(potentialDuplicates[1]);
      }
    } catch (error) { 
      setMessage({ type: 'error', text: error.message || 'Unable to load the Master Patient Index.' }); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { load(); }, []);

  const runMerge = async () => {
    if (!source || !survivor || !reason.trim()) return;
    if (source.id === survivor.id) {
      setMessage({ type: 'error', text: 'Cannot merge a patient with themselves.' });
      return;
    }
    setWorking(true); 
    setMessage(null);
    try {
      await apiRequest(`/api/v1/patients/patients/${source.id}/merge/`, { 
        method: 'POST', 
        body: JSON.stringify({ survivor_id: survivor.id, reason }) 
      });
      setMessage({ 
        type: 'success', 
        text: `${label(source)} was successfully merged into ${label(survivor)}.` 
      });
      setSource(null); 
      setSurvivor(null); 
      setReason(''); 
      await load();
    } catch (error) { 
      setMessage({ type: 'error', text: error.message || 'Merge could not be completed.' }); 
    } finally { 
      setWorking(false); 
    }
  };

  const runUnmerge = async (merge) => {
    if (!window.confirm(`Are you sure you want to reverse the merge of ${label(merge.source_patient)}?`)) return;
    setWorking(true); 
    setMessage(null);
    try { 
      await apiRequest(`/api/v1/patients/patients/${merge.source_patient.id}/unmerge/`, { 
        method: 'POST', 
        body: JSON.stringify({}) 
      }); 
      setMessage({ type: 'success', text: 'The patient merge was successfully reversed.' }); 
      await load(); 
    } catch (error) { 
      setMessage({ type: 'error', text: error.message || 'Unmerge could not be completed.' }); 
    } finally { 
      setWorking(false); 
    }
  };

  const clearSelection = () => {
    setSource(null);
    setSurvivor(null);
    setReason('');
  };

  // Calculate stats
  const totalPatients = patients.length;
  const mergedPatients = patients.filter(p => p.is_merged).length;
  const potentialDuplicates = patients.filter(p => p.duplicate_score > 70).length;
  const activePatients = totalPatients - mergedPatients;

  // Pagination
  const paginatedPatients = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return patients.slice(start, end);
  }, [patients, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(patients.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="dashboard min-h-screen bg-[#F7F5F2] p-3 sm:p-4 lg:p-6 xl:p-8 max-w-[1600px] mx-auto font-sans">
      {/* Header */}
      <header className="mb-4 sm:mb-6 lg:mb-8">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-medium text-[#B8860B] uppercase tracking-[0.18em]">
              <ShieldCheck className="w-4 h-4" />
              Identity Governance
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-[#1A1A1A]">Master Patient Index</h1>
            <p className="mt-1 max-w-2xl text-sm text-[#5A5A5A]">
              Resolve duplicate patient records while preserving the complete clinical history through controlled merges.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 flex-shrink-0">
            <div className="flex items-center gap-2 border border-[#D8D4CD] bg-white px-3 py-2 text-xs text-[#5A5A5A]">
              <ShieldCheck className="w-4 h-4 text-[#008751]" />
              Admin Controlled
            </div>
            <ButtonWithTooltip
              onClick={load}
              tooltip="Refresh patient index"
              variant="secondary"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </ButtonWithTooltip>
          </div>
        </div>
      </header>

      {/* Notification Toast */}
      {message && (
        <div className={`mb-4 sm:mb-6 p-3 sm:p-4 border ${
          message.type === 'success' 
            ? 'bg-[#EAF3EE] border-[#D0E3D8] text-[#2D7D46]' 
            : 'bg-[#F5EDEA] border-[#E8D6D0] text-[#C8553D]'
        } flex items-center justify-between shadow-sm gap-2`}>
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            {message.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-[#2D7D46] flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-[#C8553D] flex-shrink-0" />
            )}
            <p className="font-medium text-sm sm:text-base break-words">{message.text}</p>
          </div>
          <button 
            onClick={() => setMessage(null)} 
            className="text-[#5A5A5A] hover:text-[#1A1A1A] transition-colors flex-shrink-0 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-4 mb-4 sm:mb-6">
        <StatsCard
          title="Total Records"
          value={totalPatients}
          subValue={`${activePatients} active`}
          icon={Users}
          color="slate"
        />
        <StatsCard
          title="Merged Records"
          value={mergedPatients}
          subValue={`${mergedPatients > 0 ? Math.round((mergedPatients / totalPatients) * 100) : 0}% of total`}
          icon={GitMerge}
          color="gold"
        />
        <StatsCard
          title="Potential Duplicates"
          value={potentialDuplicates}
          subValue="Score > 70%"
          icon={AlertTriangle}
          color="warm"
          trend={potentialDuplicates > 0 ? 'up' : 'neutral'}
          trendValue={potentialDuplicates > 0 ? 'Requires review' : 'All clear'}
        />
        <StatsCard
          title="Merge History"
          value={history.length}
          subValue={`${history.filter(h => h.status === 'active').length} active merges`}
          icon={History}
          color="green"
        />
      </div>

      {/* Main Content */}
      <div className="grid gap-4 lg:gap-6 lg:grid-cols-[1fr_340px]">
        {/* Search and Patient List */}
        <section className="bg-white border border-[#E8E3DC] p-3 sm:p-4 lg:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div>
              <h2 className="text-sm font-display font-semibold text-[#1A1A1A]">Search Patient Records</h2>
              <p className="text-xs text-[#5A5A5A]">Name, MRN, hospital number, phone, NIN, or NHIS</p>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#5A5A5A]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && load()}
              placeholder="Search the Master Patient Index..."
              className="w-full border border-[#D8D4CD] py-2 pl-9 pr-3 text-sm focus:border-[#008751] focus:outline-none transition-colors bg-white"
            />
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-[#5A5A5A]">
            <span>{patients.length} records found</span>
            <ButtonWithTooltip
              onClick={load}
              tooltip="Search"
              variant="primary"
              size="sm"
              disabled={loading}
            >
              <Search className="w-3.5 h-3.5" />
              Search
            </ButtonWithTooltip>
          </div>

          <div className="mt-4 space-y-2">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-[#008751] mr-2" />
                <span className="text-sm text-[#5A5A5A]">Loading records...</span>
              </div>
            ) : patients.length === 0 ? (
              <EmptyState
                icon={Users}
                title="No Records Found"
                description="Try adjusting your search criteria or check the patient index."
              />
            ) : (
              paginatedPatients.map((patient) => (
                <PatientCard
                  key={patient.id}
                  patient={patient}
                  selected={source?.id === patient.id || survivor?.id === patient.id}
                  onSelect={(selected) => {
                    if (source?.id === selected.id) {
                      setSource(null);
                    } else if (survivor?.id === selected.id) {
                      setSurvivor(null);
                    } else if (!source) {
                      setSource(selected);
                    } else {
                      setSurvivor(selected);
                    }
                  }}
                />
              ))
            )}
          </div>

          {patients.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemsPerPage={itemsPerPage}
              totalItems={patients.length}
              onItemsPerPageChange={handleItemsPerPageChange}
            />
          )}
        </section>

        {/* Merge Review Sidebar */}
        <aside className="bg-[#1C2B27] border border-[#2A3B36] p-4 sm:p-5 h-fit">
          <div className="flex items-center gap-2 mb-3">
            <GitMerge className="w-4 h-4 text-[#D6B15A]" />
            <h2 className="text-sm font-semibold text-white">Merge Review</h2>
          </div>
          
          <p className="text-xs leading-5 text-slate-300">
            Select a duplicate record first, then choose the canonical survivor. 
            All linked encounters and clinical records will be moved transactionally.
          </p>

          <div className="mt-4 space-y-3">
            <div className="border border-white/15 p-3">
              <span className="text-xs text-slate-400">Duplicate Record</span>
              <p className="mt-1 font-medium text-white text-sm">
                {source ? `${label(source)} (${identifier(source)})` : 'Select a record'}
              </p>
              {source && source.duplicate_score !== undefined && (
                <span className="text-[10px] text-[#D6B15A]">Match score: {source.duplicate_score}%</span>
              )}
            </div>

            <div className="border border-white/15 p-3">
              <span className="text-xs text-slate-400">Canonical Survivor</span>
              <p className="mt-1 font-medium text-white text-sm">
                {survivor ? `${label(survivor)} (${identifier(survivor)})` : 'Select a record'}
              </p>
              {survivor && survivor.duplicate_score !== undefined && (
                <span className="text-[10px] text-[#D6B15A]">Match score: {survivor.duplicate_score}%</span>
              )}
            </div>

            {source && survivor && source.id === survivor.id && (
              <div className="bg-[#C8553D]/20 border border-[#C8553D] p-2 text-xs text-[#F5EDEA]">
                <AlertTriangle className="w-3.5 h-3.5 inline mr-1" />
                Cannot merge a patient with themselves
              </div>
            )}
          </div>

          <div className="mt-4">
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Reason for Merge <span className="text-[#C8553D]">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Provide a justification for this merge..."
              rows="3"
              className="w-full border border-white/20 bg-white/10 p-2 text-xs text-white placeholder:text-slate-400 focus:border-[#D6B15A] focus:outline-none transition-colors resize-none"
            />
          </div>

          <div className="mt-3 flex gap-2">
            <ButtonWithTooltip
              onClick={runMerge}
              tooltip="Execute merge"
              variant="gold"
              className="flex-1"
              disabled={
                working || 
                !source || 
                !survivor || 
                !reason.trim() || 
                source.id === survivor.id || 
                source.is_merged
              }
            >
              {working ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <GitMerge className="w-4 h-4" />
                  Merge Records
                </>
              )}
            </ButtonWithTooltip>
            <ButtonWithTooltip
              onClick={clearSelection}
              tooltip="Clear selection"
              variant="secondary"
              disabled={working || (!source && !survivor)}
            >
              <X className="w-4 h-4" />
            </ButtonWithTooltip>
          </div>

          {source && survivor && source.id !== survivor.id && !source.is_merged && (
            <div className="mt-3 bg-white/5 border border-white/10 p-2">
              <p className="text-[10px] text-slate-400">
                <Info className="w-3 h-3 inline mr-1" />
                This action will merge {label(source)} into {label(survivor)}. 
                All records will be consolidated under the survivor.
              </p>
            </div>
          )}
        </aside>
      </div>

      {/* Merge History Section */}
      <section className="mt-4 sm:mt-6 bg-white border border-[#E8E3DC] p-3 sm:p-4 lg:p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-[#B8860B]" />
            <h2 className="text-sm font-display font-semibold text-[#1A1A1A]">Merge History</h2>
            <span className="text-xs text-[#5A5A5A]">({history.length} events)</span>
          </div>
          <ButtonWithTooltip
            onClick={() => setShowMergeHistory(!showMergeHistory)}
            tooltip={showMergeHistory ? 'Hide history' : 'Show history'}
            variant="secondary"
            size="sm"
          >
            {showMergeHistory ? <Eye className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            {showMergeHistory ? 'Hide' : 'Show'}
          </ButtonWithTooltip>
        </div>

        {showMergeHistory && (
          <div className="mt-4 space-y-3">
            {history.length === 0 ? (
              <div className="py-8 text-center">
                <History className="w-8 h-8 text-[#D8D4CD] mx-auto mb-2" />
                <p className="text-sm text-[#5A5A5A]">No merge activity has been recorded yet.</p>
              </div>
            ) : (
              history.map((merge) => (
                <div key={merge.id} className="flex flex-wrap items-center justify-between gap-3 py-3 border-b border-[#F0EDE8] last:border-0">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-[#1A1A1A] text-sm">{label(merge.source_patient)}</span>
                      <span className="text-[#5A5A5A] text-xs">→</span>
                      <span className="font-medium text-[#1A1A1A] text-sm">{label(merge.survivor_patient)}</span>
                      {merge.status === 'active' ? (
                        <span className="inline-flex px-2 py-0.5 text-[10px] font-medium bg-[#EAF3EE] text-[#2D7D46] border border-[#D0E3D8]">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-0.5 text-[10px] font-medium bg-[#F0EDE8] text-[#5A5A5A] border border-[#E8E3DC]">
                          Reversed
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-[#5A5A5A]">
                      <span>{merge.reason || 'No reason provided'}</span>
                      <span className="text-[#B0A89E]">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {new Date(merge.created_at).toLocaleString()}
                      </span>
                      <span className="text-[#B0A89E]">
                        <FileText className="w-3 h-3 inline mr-1" />
                        {merge.moved_record_count || 0} records moved
                      </span>
                    </div>
                  </div>
                  {merge.status === 'active' && (
                    <ButtonWithTooltip
                      onClick={() => runUnmerge(merge)}
                      tooltip="Reverse this merge"
                      variant="secondary"
                      size="sm"
                      disabled={working}
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      Unmerge
                    </ButtonWithTooltip>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </section>

      {/* Custom CSS */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PatientMPI;