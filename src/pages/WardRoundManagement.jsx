import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import {
  Plus,
  Clock,
  CheckCircle,
  Users,
  Stethoscope,
  FileText,
  Edit,
  Check,
  Play,
  X,
  Calendar,

  Loader2,
  Eye,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  AlertCircle,
} from 'lucide-react';
import GenericModal from '../components/GenericModal';
import { ErrorModal } from '../components/ErrorModal';
import {
  fetchWardRounds,
  scheduleWardRound,
  startWardRound,
  completeWardRound,
  cancelWardRound,
  createHandoverNote,
  updateHandoverNote,
  scheduleGrandRound,
  fetchHandoverNotes,
  fetchGrandRounds,
  clearError
} from '../features/wardRoundSlice';

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
    gold: 'bg-[#FFC107]',
    terracotta: 'bg-[#C8553D]',
    warm: 'bg-[#C87D3D]',
    slate: 'bg-[#4A5A5A]',
    blue: 'bg-[#008751]',
    purple: 'bg-[#4A5A5A]',
    yellow: 'bg-[#FFC107]',
    orange: 'bg-[#C87D3D]',
  };

  return (
    <Tooltip text={tooltip}>
      <div 
        onClick={onClick}
        className={`bg-white border border-[#E8E3DC] p-5 ${onClick ? 'cursor-pointer hover:border-[#008751] transition-colors' : ''} ${className}`}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">{title}</p>
            <p className="mt-1 text-2xl font-display font-bold text-[#1A1A1A] tracking-tight">{value}</p>
            {subValue && (
              <p className="text-xs text-[#5A5A5A] mt-0.5">{subValue}</p>
            )}
            {trend && (
              <div className={`flex items-center mt-1 text-xs ${trendColors[trend]} font-medium`}>
                {trend === 'up' && <ArrowUp className="w-3 h-3 mr-0.5" />}
                {trend === 'down' && <ArrowDown className="w-3 h-3 mr-0.5" />}
                <span>{trendValue}</span>
              </div>
            )}
          </div>
          <div className={`w-10 h-10 ${colorMap[color]} rounded flex items-center justify-center flex-shrink-0 ml-3`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
    </Tooltip>
  );
};

// ==================== STATUS BADGE ====================
const StatusBadge = ({ status }) => {
  const statusMap = {
    'SCHEDULED': { label: 'Scheduled', color: 'bg-[#F5F0EA] text-[#C87D3D] border-[#F0E8DC]' },
    'IN_PROGRESS': { label: 'In Progress', color: 'bg-[#E8F5EF] text-[#008751] border-[#C8E0D5]' },
    'COMPLETED': { label: 'Completed', color: 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]' },
    'CANCELLED': { label: 'Cancelled', color: 'bg-[#F5EDEA] text-[#C8553D] border-[#E8D6D0]' },
  };

  const config = statusMap[status] || { label: status || 'Unknown', color: 'bg-[#F0EDE8] text-[#5A5A5A] border-[#E8E3DC]' };

  return (
    <span className={`inline-flex px-2 py-0.5 text-xs font-medium border ${config.color}`}>
      {config.label}
    </span>
  );
};

// ==================== TYPE BADGE ====================
const TypeBadge = ({ type }) => {
  const typeMap = {
    'DAILY': { label: 'Daily Round', color: 'bg-[#E8F5EF] text-[#008751] border-[#C8E0D5]' },
    'TEACHING': { label: 'Teaching Round', color: 'bg-[#F5F0EA] text-[#C87D3D] border-[#F0E8DC]' },
    'GRAND': { label: 'Grand Round', color: 'bg-[#F5EDEA] text-[#C8553D] border-[#E8D6D0]' },
  };

  const config = typeMap[type] || { label: type || 'Unknown', color: 'bg-[#F0EDE8] text-[#5A5A5A] border-[#E8E3DC]' };

  return (
    <span className={`inline-flex px-2 py-0.5 text-xs font-medium border ${config.color}`}>
      {config.label}
    </span>
  );
};

// ==================== ROUND CARD ====================
const RoundCard = ({ round, type, onStart, onComplete, onCancel, onViewDetails, onCancelRound }) => {
  const getTypeColor = (type) => {
    switch (type) {
      case 'DAILY': return 'border-l-[#008751]';
      case 'TEACHING': return 'border-l-[#C87D3D]';
      case 'GRAND': return 'border-l-[#C8553D]';
      default: return 'border-l-[#5A5A5A]';
    }
  };

  const isCompleted = round.status === 'COMPLETED';
  const isInProgress = round.status === 'IN_PROGRESS';
  const isScheduled = round.status === 'SCHEDULED';

  return (
    <div className={`bg-white border border-[#E8E3DC] border-l-4 ${getTypeColor(type)} p-5`}>
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-display font-semibold text-[#1A1A1A]">
              {round.wardName || 'Unnamed Ward'}
            </h3>
            <TypeBadge type={type} />
          </div>
          <p className="text-xs text-[#5A5A5A] mt-0.5">ID: {round.roundId || round.id}</p>
        </div>
        <StatusBadge status={round.status} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <div>
          <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Date & Time</p>
          <p className="text-sm font-medium text-[#1A1A1A]">
            {round.date ? new Date(round.date).toLocaleDateString('en-NG') : 'N/A'} @ {round.time || '--:--'}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Consultant</p>
          <p className="text-sm text-[#1A1A1A]">{round.consultant || 'Not assigned'}</p>
          {round.consultantSpecialty && (
            <p className="text-xs text-[#B0A89E]">{round.consultantSpecialty}</p>
          )}
        </div>
        <div>
          <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Team</p>
          <p className="text-sm text-[#1A1A1A]">{round.teamMembers?.length || 0} members</p>
        </div>
        <div>
          <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Patients</p>
          <p className="text-sm text-[#1A1A1A]">{round.patientsList?.length || 0} patients</p>
        </div>
      </div>

      {round.notes && (
        <div className="p-3 bg-[#F7F5F2] border border-[#E8E3DC] mb-4">
          <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Notes</p>
          <p className="text-sm text-[#1A1A1A] mt-0.5">{round.notes}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-1.5">
        {isScheduled && (
          <>
            <ButtonWithTooltip
              onClick={() => onStart(round.id)}
              tooltip="Start round"
              variant="primary"
              size="sm"
            >
              <Play className="w-3.5 h-3.5" />
              Start
            </ButtonWithTooltip>
            <ButtonWithTooltip
              onClick={() => onCancelRound(round.id)}
              tooltip="Cancel round"
              variant="danger"
              size="sm"
            >
              <X className="w-3.5 h-3.5" />
              Cancel
            </ButtonWithTooltip>
          </>
        )}

        {isInProgress && (
          <ButtonWithTooltip
            onClick={() => onComplete(round.id)}
            tooltip="Complete round"
            variant="success"
            size="sm"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            Complete
          </ButtonWithTooltip>
        )}

        <ButtonWithTooltip
          onClick={() => onViewDetails(round)}
          tooltip="View details"
          variant="secondary"
          size="sm"
        >
          <Eye className="w-3.5 h-3.5" />
          Details
        </ButtonWithTooltip>

        {isCompleted && (
          <ButtonWithTooltip
            onClick={() => onViewDetails(round)}
            tooltip="View report"
            variant="secondary"
            size="sm"
          >
            <FileText className="w-3.5 h-3.5" />
            Report
          </ButtonWithTooltip>
        )}
      </div>
    </div>
  );
};

// ==================== HANDOVER CARD ====================
const HandoverCard = ({ note, onEdit, onViewDetails }) => {
  return (
    <div className="bg-white border border-[#E8E3DC] border-l-4 border-l-[#C87D3D] p-5">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-display font-semibold text-[#1A1A1A]">{note.wardName}</h3>
          <p className="text-xs text-[#5A5A5A] mt-0.5">
            {note.handoverId} - {note.date ? new Date(note.date).toLocaleDateString('en-NG') : 'N/A'}
          </p>
        </div>
        <span className="inline-flex px-2 py-0.5 text-xs font-medium border bg-[#F5F0EA] text-[#C87D3D] border-[#F0E8DC]">
          {note.shiftFrom} → {note.shiftTo}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div>
          <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">From Officer</p>
          <p className="text-sm font-medium text-[#1A1A1A]">{note.handoverOfficer || 'Not assigned'}</p>
        </div>
        <div>
          <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">To Officer</p>
          <p className="text-sm font-medium text-[#1A1A1A]">{note.receivingOfficer || 'Not assigned'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <div className="p-3 bg-[#F5EDEA] border border-[#E8D6D0]">
          <p className="text-[10px] font-medium text-[#C8553D] uppercase tracking-wider">Critically Severe</p>
          <div className="mt-1">
            {note.criticallySevere?.length > 0 ? (
              note.criticallySevere.map((patient, idx) => (
                <p key={idx} className="text-sm text-[#C8553D]">• {patient}</p>
              ))
            ) : (
              <p className="text-sm text-[#5A5A5A]">None</p>
            )}
          </div>
        </div>
        <div className="p-3 bg-[#E8F5EF] border border-[#C8E0D5]">
          <p className="text-[10px] font-medium text-[#008751] uppercase tracking-wider">Recent Admissions</p>
          <div className="mt-1">
            {note.recentAdmissions?.length > 0 ? (
              note.recentAdmissions.map((admission, idx) => (
                <p key={idx} className="text-sm text-[#008751]">• {admission}</p>
              ))
            ) : (
              <p className="text-sm text-[#5A5A5A]">None</p>
            )}
          </div>
        </div>
      </div>

      {note.notes && (
        <div className="p-3 bg-[#F7F5F2] border border-[#E8E3DC] mb-4">
          <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Notes</p>
          <p className="text-sm text-[#1A1A1A] mt-0.5">{note.notes}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-1.5">
        <ButtonWithTooltip
          onClick={() => onEdit(note)}
          tooltip="Edit handover"
          variant="warning"
          size="sm"
        >
          <Edit className="w-3.5 h-3.5" />
          Edit
        </ButtonWithTooltip>
        <ButtonWithTooltip
          onClick={() => onViewDetails(note)}
          tooltip="View full details"
          variant="secondary"
          size="sm"
        >
          <Eye className="w-3.5 h-3.5" />
          View Details
        </ButtonWithTooltip>
      </div>
    </div>
  );
};

// ==================== GRAND ROUND CARD ====================
const GrandRoundCard = ({ round, onEdit, onViewDetails }) => {
  return (
    <div className="bg-white border border-[#E8E3DC] border-l-4 border-l-[#C8553D] p-5">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-display font-semibold text-[#1A1A1A]">{round.topic}</h3>
          <p className="text-xs text-[#5A5A5A] mt-0.5">{round.grandRoundId}</p>
        </div>
        <StatusBadge status={round.status} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
        <div>
          <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Date & Time</p>
          <p className="text-sm font-medium text-[#1A1A1A]">
            {round.date ? new Date(round.date).toLocaleDateString('en-NG') : 'N/A'} @ {round.time || '--:--'}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Presenter</p>
          <p className="text-sm text-[#1A1A1A]">{round.presenter || 'Not assigned'}</p>
        </div>
        <div>
          <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Location</p>
          <p className="text-sm text-[#1A1A1A]">{round.location || 'TBD'}</p>
        </div>
      </div>

      <div className="p-3 bg-[#F5EDEA] border border-[#E8D6D0] mb-4">
        <p className="text-[10px] font-medium text-[#C8553D] uppercase tracking-wider">Target Audience</p>
        <p className="text-sm text-[#1A1A1A] mt-0.5">{round.targetAudience || 'All staff'}</p>
        <p className="text-xs text-[#5A5A5A] mt-1">Expected Attendees: {round.expectedAttendees || 'TBD'}</p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <ButtonWithTooltip
          onClick={() => onEdit(round)}
          tooltip="Edit grand round"
          variant="warning"
          size="sm"
        >
          <Edit className="w-3.5 h-3.5" />
          Edit
        </ButtonWithTooltip>
        <ButtonWithTooltip
          onClick={() => onViewDetails(round)}
          tooltip="View details"
          variant="secondary"
          size="sm"
        >
          <Users className="w-3.5 h-3.5" />
          View Attendees
        </ButtonWithTooltip>
      </div>
    </div>
  );
};

// ==================== DETAILS MODAL ====================
const DetailsModal = ({ isOpen, onClose, data, type }) => {
  if (!data) return null;

  const renderDailyRoundDetails = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-[#F7F5F2] border border-[#E8E3DC] p-3">
          <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Ward</p>
          <p className="text-sm font-medium text-[#1A1A1A]">{data.wardName}</p>
        </div>
        <div className="bg-[#F7F5F2] border border-[#E8E3DC] p-3">
          <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Date & Time</p>
          <p className="text-sm font-medium text-[#1A1A1A]">
            {data.date ? new Date(data.date).toLocaleDateString('en-NG') : 'N/A'} @ {data.time || '--:--'}
          </p>
        </div>
        <div className="bg-[#F7F5F2] border border-[#E8E3DC] p-3">
          <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Type</p>
          <TypeBadge type={data.type} />
        </div>
        <div className="bg-[#F7F5F2] border border-[#E8E3DC] p-3">
          <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Status</p>
          <StatusBadge status={data.status} />
        </div>
        <div className="bg-[#F7F5F2] border border-[#E8E3DC] p-3">
          <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Consultant</p>
          <p className="text-sm font-medium text-[#1A1A1A]">{data.consultant || 'Not assigned'}</p>
        </div>
        <div className="bg-[#F7F5F2] border border-[#E8E3DC] p-3">
          <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Specialty</p>
          <p className="text-sm text-[#1A1A1A]">{data.consultantSpecialty || 'N/A'}</p>
        </div>
        <div className="bg-[#F7F5F2] border border-[#E8E3DC] p-3">
          <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Team Members</p>
          <p className="text-sm font-medium text-[#1A1A1A]">{data.teamMembers?.length || 0}</p>
        </div>
        <div className="bg-[#F7F5F2] border border-[#E8E3DC] p-3">
          <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Patients</p>
          <p className="text-sm font-medium text-[#1A1A1A]">{data.patientsList?.length || 0}</p>
        </div>
      </div>
      {data.notes && (
        <div className="p-3 bg-[#F7F5F2] border border-[#E8E3DC]">
          <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Notes</p>
          <p className="text-sm text-[#1A1A1A] mt-0.5">{data.notes}</p>
        </div>
      )}
    </div>
  );

  const renderHandoverDetails = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-[#F7F5F2] border border-[#E8E3DC] p-3">
          <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Ward</p>
          <p className="text-sm font-medium text-[#1A1A1A]">{data.wardName}</p>
        </div>
        <div className="bg-[#F7F5F2] border border-[#E8E3DC] p-3">
          <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Shift</p>
          <p className="text-sm font-medium text-[#1A1A1A]">{data.shiftFrom} → {data.shiftTo}</p>
        </div>
        <div className="bg-[#F7F5F2] border border-[#E8E3DC] p-3">
          <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">From Officer</p>
          <p className="text-sm font-medium text-[#1A1A1A]">{data.handoverOfficer || 'Not assigned'}</p>
        </div>
        <div className="bg-[#F7F5F2] border border-[#E8E3DC] p-3">
          <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">To Officer</p>
          <p className="text-sm font-medium text-[#1A1A1A]">{data.receivingOfficer || 'Not assigned'}</p>
        </div>
      </div>
      <div className="p-3 bg-[#F5EDEA] border border-[#E8D6D0]">
        <p className="text-[10px] font-medium text-[#C8553D] uppercase tracking-wider">Critically Severe Patients</p>
        <div className="mt-1">
          {data.criticallySevere?.length > 0 ? (
            data.criticallySevere.map((patient, idx) => (
              <p key={idx} className="text-sm text-[#C8553D]">• {patient}</p>
            ))
          ) : (
            <p className="text-sm text-[#5A5A5A]">None</p>
          )}
        </div>
      </div>
      <div className="p-3 bg-[#E8F5EF] border border-[#C8E0D5]">
        <p className="text-[10px] font-medium text-[#008751] uppercase tracking-wider">Recent Admissions</p>
        <div className="mt-1">
          {data.recentAdmissions?.length > 0 ? (
            data.recentAdmissions.map((admission, idx) => (
              <p key={idx} className="text-sm text-[#008751]">• {admission}</p>
            ))
          ) : (
            <p className="text-sm text-[#5A5A5A]">None</p>
          )}
        </div>
      </div>
      {data.notes && (
        <div className="p-3 bg-[#F7F5F2] border border-[#E8E3DC]">
          <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">General Notes</p>
          <p className="text-sm text-[#1A1A1A] mt-0.5">{data.notes}</p>
        </div>
      )}
    </div>
  );

  return (
    <GenericModal
      isOpen={isOpen}
      onClose={onClose}
      title="Details"
      size="lg"
    >
      <div className="max-h-[70vh] overflow-y-auto">
        {(type === 'DAILY' || type === 'TEACHING' || type === 'dailyRound' || type === 'teachingRound') && renderDailyRoundDetails()}
        {(type === 'handover') && renderHandoverDetails()}
        {type === 'GRAND' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-[#F7F5F2] border border-[#E8E3DC] p-3">
                <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Topic</p>
                <p className="text-sm font-medium text-[#1A1A1A]">{data.topic}</p>
              </div>
              <div className="bg-[#F7F5F2] border border-[#E8E3DC] p-3">
                <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Status</p>
                <StatusBadge status={data.status} />
              </div>
              <div className="bg-[#F7F5F2] border border-[#E8E3DC] p-3">
                <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Date & Time</p>
                <p className="text-sm font-medium text-[#1A1A1A]">
                  {data.date ? new Date(data.date).toLocaleDateString('en-NG') : 'N/A'} @ {data.time || '--:--'}
                </p>
              </div>
              <div className="bg-[#F7F5F2] border border-[#E8E3DC] p-3">
                <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Presenter</p>
                <p className="text-sm font-medium text-[#1A1A1A]">{data.presenter || 'Not assigned'}</p>
              </div>
              <div className="bg-[#F7F5F2] border border-[#E8E3DC] p-3">
                <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Location</p>
                <p className="text-sm text-[#1A1A1A]">{data.location || 'TBD'}</p>
              </div>
              <div className="bg-[#F7F5F2] border border-[#E8E3DC] p-3">
                <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Target Audience</p>
                <p className="text-sm text-[#1A1A1A]">{data.targetAudience || 'All staff'}</p>
              </div>
            </div>
            <div className="p-3 bg-[#F7F5F2] border border-[#E8E3DC]">
              <p className="text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider">Expected Attendees</p>
              <p className="text-sm font-medium text-[#1A1A1A]">{data.expectedAttendees || 'TBD'}</p>
            </div>
          </div>
        )}
      </div>
      <div className="flex justify-end pt-4 border-t border-[#E8E3DC]">
        <ButtonWithTooltip
          onClick={onClose}
          tooltip="Close"
          variant="secondary"
        >
          Close
        </ButtonWithTooltip>
      </div>
    </GenericModal>
  );
};

// ==================== MAIN COMPONENT ====================
const WardRoundManagement = () => {
  const dispatch = useDispatch();
  const { wardRounds, handoverNotes, grandRounds, roundStatuses, roundTypes, loading, error } = useSelector(
    state => state.wardRound
  );
  const { wards } = useSelector(state => state.ward);

  const [activeTab, setActiveTab] = useState('daily');
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [showHandoverForm, setShowHandoverForm] = useState(false);
  const [showGrandRoundForm, setShowGrandRoundForm] = useState(false);
  const [selectedRound, setSelectedRound] = useState(null);
  const [notificationModal, setNotificationModal] = useState({ show: false, message: '', type: 'success' });
  const [completionNotesModal, setCompletionNotesModal] = useState({ show: false, roundId: null });
  const [completionNotes, setCompletionNotes] = useState('');
  const [cancellationModal, setCancellationModal] = useState({ show: false, roundId: null });
  const [cancellationReason, setCancellationReason] = useState('');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [detailsData, setDetailsData] = useState(null);
  const [detailsType, setDetailsType] = useState('');
  const [showEditHandoverModal, setShowEditHandoverModal] = useState(false);
  const [editingHandover, setEditingHandover] = useState(null);
  const [editedHandoverData, setEditedHandoverData] = useState({
    criticallySevere: '',
    recentAdmissions: '',
    notes: ''
  });
  const [errorModal, setErrorModal] = useState({ isOpen: false, title: '', message: '', details: null });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchWardRounds());
    dispatch(fetchHandoverNotes());
    dispatch(fetchGrandRounds());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      setErrorModal({
        isOpen: true,
        title: 'Error',
        message: error,
        details: null,
      });
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const [roundFormData, setRoundFormData] = useState({
    wardId: '',
    date: '',
    time: '',
    type: 'DAILY',
    consultant: '',
    consultantSpecialty: '',
    notes: '',
    expectedDuration: 120
  });

  const [handoverFormData, setHandoverFormData] = useState({
    wardId: '',
    shiftFrom: 'Morning',
    shiftTo: 'Afternoon',
    handoverOfficer: '',
    receivingOfficer: '',
    criticallySevere: '',
    recentAdmissions: '',
    notes: ''
  });

  const [grandRoundFormData, setGrandRoundFormData] = useState({
    date: '',
    time: '',
    topic: '',
    presenter: '',
    location: '',
    targetAudience: ''
  });

  const scheduledRounds = wardRounds.filter(r => r.status === 'SCHEDULED');
  const inProgressRounds = wardRounds.filter(r => r.status === 'IN_PROGRESS');
  const completedRounds = wardRounds.filter(r => r.status === 'COMPLETED');
  const dailyRounds = wardRounds.filter(r => r.type === 'DAILY');
  const teachingRounds = wardRounds.filter(r => r.type === 'TEACHING');
  const completedToday = completedRounds.filter(
    r => r.completedTime && new Date(r.completedTime).toDateString() === new Date().toDateString()
  );

  // Tabs configuration
  const tabs = [
    { id: 'daily', label: 'Daily Rounds', icon: Stethoscope, count: dailyRounds.length },
    { id: 'teaching', label: 'Teaching Rounds', icon: Users, count: teachingRounds.length },
    { id: 'handover', label: 'Handover Notes', icon: FileText, count: handoverNotes.length },
    { id: 'grand', label: 'Grand Rounds', icon: Calendar, count: grandRounds.length },
  ];

  const handleScheduleRound = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    
    if (!roundFormData.wardId || !roundFormData.date || !roundFormData.consultant) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      await dispatch(scheduleWardRound({
        wardId: roundFormData.wardId,
        wardName: wards.find(w => w.wardId === roundFormData.wardId)?.wardName || '',
        date: roundFormData.date,
        time: roundFormData.time,
        roundType: roundFormData.type,
        consultant: roundFormData.consultant,
        consultantSpecialty: roundFormData.consultantSpecialty,
        teamMembers: [],
        patientsList: [],
        notes: roundFormData.notes,
        expectedDuration: roundFormData.expectedDuration,
        status: 'SCHEDULED'
      })).unwrap();
      
      setRoundFormData({
        wardId: '',
        date: '',
        time: '',
        type: 'DAILY',
        consultant: '',
        consultantSpecialty: '',
        notes: '',
        expectedDuration: 120
      });
      setShowScheduleForm(false);
      setSuccessMessage('Ward round scheduled successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setErrorMessage(err?.message || 'Failed to schedule ward round.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartRound = async (roundId) => {
    try {
      await dispatch(startWardRound(roundId)).unwrap();
      setSuccessMessage('Ward round started!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setErrorMessage(err?.message || 'Failed to start ward round.');
    }
  };

  const handleCompleteRound = (roundId) => {
    setCompletionNotesModal({ show: true, roundId });
  };

  const submitCompletionNotes = async () => {
    if (completionNotesModal.roundId) {
      try {
        await dispatch(completeWardRound({ roundId: completionNotesModal.roundId, notes: completionNotes, actualDuration: 120 })).unwrap();
        setCompletionNotesModal({ show: false, roundId: null });
        setCompletionNotes('');
        setSuccessMessage('Ward round completed!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        setErrorMessage(err?.message || 'Failed to complete ward round.');
      }
    }
  };

  const handleCancelRound = (roundId) => {
    setCancellationModal({ show: true, roundId });
  };

  const submitCancellationReason = async () => {
    if (cancellationReason.trim()) {
      try {
        await dispatch(cancelWardRound({ roundId: cancellationModal.roundId, reason: cancellationReason })).unwrap();
        setCancellationModal({ show: false, roundId: null });
        setCancellationReason('');
        setSuccessMessage('Ward round cancelled!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (err) {
        setErrorMessage(err?.message || 'Failed to cancel ward round.');
      }
    }
  };

  const handleCreateHandover = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    
    if (!handoverFormData.wardId || !handoverFormData.handoverOfficer || !handoverFormData.receivingOfficer) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      await dispatch(createHandoverNote({
        date: new Date().toISOString(),
        wardId: handoverFormData.wardId,
        wardName: wards.find(w => w.wardId === handoverFormData.wardId)?.wardName || '',
        shiftFrom: handoverFormData.shiftFrom,
        shiftTo: handoverFormData.shiftTo,
        handoverOfficer: handoverFormData.handoverOfficer,
        receivingOfficer: handoverFormData.receivingOfficer,
        criticallySevere: handoverFormData.criticallySevere.split(',').filter(s => s.trim()),
        recentAdmissions: handoverFormData.recentAdmissions.split(',').filter(a => a.trim()),
        notes: handoverFormData.notes
      })).unwrap();
      
      setHandoverFormData({
        wardId: '',
        shiftFrom: 'Morning',
        shiftTo: 'Afternoon',
        handoverOfficer: '',
        receivingOfficer: '',
        criticallySevere: '',
        recentAdmissions: '',
        notes: ''
      });
      setShowHandoverForm(false);
      setSuccessMessage('Handover note created successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setErrorMessage(err?.message || 'Failed to create handover note.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleScheduleGrandRound = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    
    if (!grandRoundFormData.date || !grandRoundFormData.topic || !grandRoundFormData.presenter) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);

    try {
      await dispatch(scheduleGrandRound({
        date: grandRoundFormData.date,
        time: grandRoundFormData.time,
        topic: grandRoundFormData.topic,
        presenter: grandRoundFormData.presenter,
        location: grandRoundFormData.location,
        targetAudience: grandRoundFormData.targetAudience,
        caseStudies: [],
        expectedAttendees: 0
      })).unwrap();
      
      setGrandRoundFormData({
        date: '',
        time: '',
        topic: '',
        presenter: '',
        location: '',
        targetAudience: ''
      });
      setShowGrandRoundForm(false);
      setSuccessMessage('Grand round scheduled successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setErrorMessage(err?.message || 'Failed to schedule grand round.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditHandover = (note) => {
    setEditingHandover(note);
    setEditedHandoverData({
      criticallySevere: (note.criticallySevere || []).join(', '),
      recentAdmissions: (note.recentAdmissions || []).join(', '),
      notes: note.notes || ''
    });
    setShowEditHandoverModal(true);
  };

  const submitEditHandover = async () => {
    if (!editingHandover?.id) return;
    try {
      await dispatch(updateHandoverNote({
        handoverId: editingHandover.id,
        updates: {
          criticallySevere: editedHandoverData.criticallySevere.split(',').filter(s => s.trim()),
          recentAdmissions: editedHandoverData.recentAdmissions.split(',').filter(a => a.trim()),
          notes: editedHandoverData.notes
        }
      })).unwrap();
      setShowEditHandoverModal(false);
      setEditingHandover(null);
      setEditedHandoverData({ criticallySevere: '', recentAdmissions: '', notes: '' });
      setSuccessMessage('Handover note updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setErrorMessage(err?.message || 'Failed to update handover note.');
    }
  };

  const showViewDetails = (data, type) => {
    setDetailsData(data);
    setDetailsType(type);
    setShowDetailsModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'SCHEDULED': return 'bg-[#F5F0EA] text-[#C87D3D] border-[#F0E8DC]';
      case 'IN_PROGRESS': return 'bg-[#E8F5EF] text-[#008751] border-[#C8E0D5]';
      case 'COMPLETED': return 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]';
      case 'CANCELLED': return 'bg-[#F5EDEA] text-[#C8553D] border-[#E8D6D0]';
      default: return 'bg-[#F0EDE8] text-[#5A5A5A] border-[#E8E3DC]';
    }
  };

  if (loading && wardRounds.length === 0 && handoverNotes.length === 0 && grandRounds.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F7F5F2]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#008751] mx-auto mb-4" />
          <p className="text-[#5A5A5A] font-medium">Loading ward rounds...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ward-round-management min-h-screen bg-[#F7F5F2] p-3 sm:p-4 md:p-8 font-sans">
      {/* Header */}
      <div className="mb-4 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded bg-[#E8F5EF] flex items-center justify-center flex-shrink-0">
              <Stethoscope className="w-5 h-5 sm:w-6 sm:h-6 text-[#008751]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-display font-bold text-[#1A1A1A] tracking-tight">
                Ward Round Management
              </h1>
              <p className="text-xs sm:text-sm text-[#5A5A5A]">
                Manage daily rounds, teaching rounds, and handovers
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
            <ButtonWithTooltip
              onClick={() => {
                dispatch(fetchWardRounds());
                dispatch(fetchHandoverNotes());
                dispatch(fetchGrandRounds());
                setSuccessMessage('Data refreshed.');
                setTimeout(() => setSuccessMessage(''), 3000);
              }}
              tooltip="Refresh data"
              variant="secondary"
              size="sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </ButtonWithTooltip>
            <ButtonWithTooltip
              onClick={() => setShowScheduleForm(true)}
              tooltip="Schedule a new ward round"
              variant="primary"
              size="sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Schedule Round</span>
              <span className="sm:hidden">Schedule</span>
            </ButtonWithTooltip>
            <ButtonWithTooltip
              onClick={() => setShowHandoverForm(true)}
              tooltip="Create a handover note"
              variant="success"
              size="sm"
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Handover</span>
              <span className="sm:hidden">Handover</span>
            </ButtonWithTooltip>
          </div>
        </div>
      </div>

      {/* Error & Success Messages */}
      {errorMessage && (
        <div className="mb-4 p-3 bg-[#F5EDEA] border border-[#E8D6D0] text-sm text-[#C8553D] flex items-center justify-between">
          <span className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {errorMessage}
          </span>
          <button onClick={() => setErrorMessage('')} className="text-[#C8553D] hover:text-[#A8442E]">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {successMessage && (
        <div className="mb-4 p-3 bg-[#EAF3EE] border border-[#D0E3D8] text-sm text-[#2D7D46] flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            {successMessage}
          </span>
          <button onClick={() => setSuccessMessage('')} className="text-[#2D7D46] hover:text-[#1E5F33]">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-8">
        <StatsCard
          title="Scheduled Rounds"
          value={scheduledRounds.length}
          icon={Calendar}
          color="yellow"
          tooltip="Rounds scheduled for today"
        />
        <StatsCard
          title="In Progress"
          value={inProgressRounds.length}
          icon={Play}
          color="blue"
          tooltip="Rounds currently in progress"
        />
        <StatsCard
          title="Completed Today"
          value={completedToday.length}
          subValue={`${completedRounds.length} total completed`}
          icon={CheckCircle}
          color="green"
          tooltip="Rounds completed today"
        />
        <StatsCard
          title="Handover Notes"
          value={handoverNotes.length}
          icon={FileText}
          color="purple"
          tooltip="Total handover notes"
        />
      </div>

      {/* Tabs */}
      <div className="bg-white border border-[#E8E3DC] p-4 sm:p-5 mb-4 sm:mb-6">
        <div className="flex flex-wrap gap-1 border-b border-[#E8E3DC] mb-4 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Tooltip key={tab.id} text={`View ${tab.label}`}>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-1 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-[#008751] text-[#008751]'
                      : 'border-transparent text-[#5A5A5A] hover:text-[#1A1A1A] hover:border-[#D8D4CD]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                  <span className="text-[10px] text-[#B0A89E] ml-0.5">({tab.count})</span>
                </button>
              </Tooltip>
            );
          })}
        </div>

        {/* ==================== DAILY ROUNDS TAB ==================== */}
        {activeTab === 'daily' && (
          <div className="space-y-4">
            {dailyRounds.length === 0 ? (
              <div className="bg-white border border-[#E8E3DC] p-12 text-center">
                <Stethoscope className="w-12 h-12 text-[#D8D4CD] mx-auto mb-3" />
                <p className="text-[#5A5A5A] font-medium">No daily rounds scheduled</p>
                <p className="text-sm text-[#B0A89E] mt-1">Click "Schedule Round" to create one</p>
              </div>
            ) : (
              dailyRounds.map(round => (
                <RoundCard
                  key={round.roundId || round.id}
                  round={round}
                  type="DAILY"
                  onStart={handleStartRound}
                  onComplete={handleCompleteRound}
                  onCancel={handleCancelRound}
                  onViewDetails={(data) => showViewDetails(data, 'DAILY')}
                  onCancelRound={handleCancelRound}
                />
              ))
            )}
          </div>
        )}

        {/* ==================== TEACHING ROUNDS TAB ==================== */}
        {activeTab === 'teaching' && (
          <div className="space-y-4">
            {teachingRounds.length === 0 ? (
              <div className="bg-white border border-[#E8E3DC] p-12 text-center">
                <Users className="w-12 h-12 text-[#D8D4CD] mx-auto mb-3" />
                <p className="text-[#5A5A5A] font-medium">No teaching rounds scheduled</p>
                <p className="text-sm text-[#B0A89E] mt-1">Click "Schedule Round" to create one</p>
              </div>
            ) : (
              teachingRounds.map(round => (
                <RoundCard
                  key={round.roundId || round.id}
                  round={round}
                  type="TEACHING"
                  onStart={handleStartRound}
                  onComplete={handleCompleteRound}
                  onCancel={handleCancelRound}
                  onViewDetails={(data) => showViewDetails(data, 'TEACHING')}
                  onCancelRound={handleCancelRound}
                />
              ))
            )}
          </div>
        )}

        {/* ==================== HANDOVER NOTES TAB ==================== */}
        {activeTab === 'handover' && (
          <div className="space-y-4">
            {handoverNotes.length === 0 ? (
              <div className="bg-white border border-[#E8E3DC] p-12 text-center">
                <FileText className="w-12 h-12 text-[#D8D4CD] mx-auto mb-3" />
                <p className="text-[#5A5A5A] font-medium">No handover notes created</p>
                <p className="text-sm text-[#B0A89E] mt-1">Click "Handover" to create one</p>
              </div>
            ) : (
              handoverNotes.map(note => (
                <HandoverCard
                  key={note.handoverId || note.id}
                  note={note}
                  onEdit={handleEditHandover}
                  onViewDetails={(data) => showViewDetails(data, 'handover')}
                />
              ))
            )}
          </div>
        )}

        {/* ==================== GRAND ROUNDS TAB ==================== */}
        {activeTab === 'grand' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-[#5A5A5A]">Schedule and manage grand rounds</p>
              <ButtonWithTooltip
                onClick={() => setShowGrandRoundForm(true)}
                tooltip="Schedule a grand round"
                variant="primary"
                size="sm"
              >
                <Plus className="w-3.5 h-3.5" />
                Schedule Grand Round
              </ButtonWithTooltip>
            </div>

            <div className="space-y-4">
              {grandRounds.length === 0 ? (
                <div className="bg-white border border-[#E8E3DC] p-12 text-center">
                  <Calendar className="w-12 h-12 text-[#D8D4CD] mx-auto mb-3" />
                  <p className="text-[#5A5A5A] font-medium">No grand rounds scheduled</p>
                  <p className="text-sm text-[#B0A89E] mt-1">Click "Schedule Grand Round" to create one</p>
                </div>
              ) : (
                grandRounds.map(round => (
                  <GrandRoundCard
                    key={round.grandRoundId || round.id}
                    round={round}
                    onEdit={() => {}}
                    onViewDetails={(data) => showViewDetails(data, 'GRAND')}
                  />
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* ==================== DETAILS MODAL ==================== */}
      <DetailsModal
        isOpen={showDetailsModal}
        onClose={() => {
          setShowDetailsModal(false);
          setDetailsData(null);
          setDetailsType('');
        }}
        data={detailsData}
        type={detailsType}
      />

      {/* ==================== COMPLETION NOTES MODAL ==================== */}
      <GenericModal
        isOpen={completionNotesModal.show}
        onClose={() => {
          setCompletionNotesModal({ show: false, roundId: null });
          setCompletionNotes('');
        }}
        title="Complete Ward Round"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-sm text-[#5A5A5A]">Enter completion notes for this ward round:</p>
          <textarea
            placeholder="Enter completion notes..."
            value={completionNotes}
            onChange={(e) => setCompletionNotes(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
            rows="4"
          />
          <div className="flex flex-col sm:flex-row gap-2">
            <ButtonWithTooltip
              onClick={submitCompletionNotes}
              tooltip="Complete round"
              variant="success"
              className="flex-1"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              Complete
            </ButtonWithTooltip>
            <ButtonWithTooltip
              onClick={() => {
                setCompletionNotesModal({ show: false, roundId: null });
                setCompletionNotes('');
              }}
              tooltip="Cancel"
              variant="secondary"
              className="flex-1"
            >
              Cancel
            </ButtonWithTooltip>
          </div>
        </div>
      </GenericModal>

      {/* ==================== CANCELLATION MODAL ==================== */}
      <GenericModal
        isOpen={cancellationModal.show}
        onClose={() => {
          setCancellationModal({ show: false, roundId: null });
          setCancellationReason('');
        }}
        title="Cancel Ward Round"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-sm text-[#5A5A5A]">Please provide a reason for cancellation:</p>
          <textarea
            placeholder="Enter cancellation reason..."
            value={cancellationReason}
            onChange={(e) => setCancellationReason(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
            rows="4"
          />
          <div className="flex flex-col sm:flex-row gap-2">
            <ButtonWithTooltip
              onClick={submitCancellationReason}
              tooltip="Cancel round"
              variant="danger"
              className="flex-1"
            >
              <X className="w-3.5 h-3.5" />
              Cancel Round
            </ButtonWithTooltip>
            <ButtonWithTooltip
              onClick={() => {
                setCancellationModal({ show: false, roundId: null });
                setCancellationReason('');
              }}
              tooltip="Keep round"
              variant="secondary"
              className="flex-1"
            >
              Keep Round
            </ButtonWithTooltip>
          </div>
        </div>
      </GenericModal>

      {/* ==================== EDIT HANDOVER MODAL ==================== */}
      <GenericModal
        isOpen={showEditHandoverModal}
        onClose={() => {
          setShowEditHandoverModal(false);
          setEditingHandover(null);
          setEditedHandoverData({ criticallySevere: '', recentAdmissions: '', notes: '' });
        }}
        title="Edit Handover Note"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
              Critically Severe Patients
            </label>
            <input
              type="text"
              value={editedHandoverData.criticallySevere}
              onChange={(e) => setEditedHandoverData({ ...editedHandoverData, criticallySevere: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
              placeholder="e.g. PAT00001, PAT00003"
            />
          </div>
          <div>
            <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
              Recent Admissions
            </label>
            <input
              type="text"
              value={editedHandoverData.recentAdmissions}
              onChange={(e) => setEditedHandoverData({ ...editedHandoverData, recentAdmissions: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
              placeholder="e.g. PAT00005, PAT00006"
            />
          </div>
          <div>
            <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
              Notes
            </label>
            <textarea
              value={editedHandoverData.notes}
              onChange={(e) => setEditedHandoverData({ ...editedHandoverData, notes: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
              rows="4"
            />
          </div>
          {errorMessage && (
            <div className="text-sm text-[#C8553D]">{errorMessage}</div>
          )}
          <div className="flex flex-col sm:flex-row gap-2">
            <ButtonWithTooltip
              onClick={submitEditHandover}
              tooltip="Save changes"
              variant="primary"
              className="flex-1"
            >
              <Check className="w-3.5 h-3.5" />
              Save Changes
            </ButtonWithTooltip>
            <ButtonWithTooltip
              onClick={() => {
                setShowEditHandoverModal(false);
                setEditingHandover(null);
                setEditedHandoverData({ criticallySevere: '', recentAdmissions: '', notes: '' });
              }}
              tooltip="Cancel"
              variant="secondary"
              className="flex-1"
            >
              Cancel
            </ButtonWithTooltip>
          </div>
        </div>
      </GenericModal>

      {/* ==================== SCHEDULE ROUND MODAL ==================== */}
      <GenericModal
        isOpen={showScheduleForm}
        onClose={() => {
          setShowScheduleForm(false);
          setErrorMessage('');
        }}
        title="Schedule Ward Round"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
              Ward <span className="text-[#C8553D]">*</span>
            </label>
            <select
              value={roundFormData.wardId}
              onChange={(e) => setRoundFormData({ ...roundFormData, wardId: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
            >
              <option value="">Select Ward</option>
              {wards.map(ward => (
                <option key={ward.wardId} value={ward.wardId}>
                  {ward.wardName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
              Round Type
            </label>
            <select
              value={roundFormData.type}
              onChange={(e) => setRoundFormData({ ...roundFormData, type: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
            >
              <option value="DAILY">Daily Ward Round</option>
              <option value="TEACHING">Teaching Round</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                Date <span className="text-[#C8553D]">*</span>
              </label>
              <input
                type="date"
                value={roundFormData.date}
                onChange={(e) => setRoundFormData({ ...roundFormData, date: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                Time
              </label>
              <input
                type="time"
                value={roundFormData.time}
                onChange={(e) => setRoundFormData({ ...roundFormData, time: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
              Consultant Name <span className="text-[#C8553D]">*</span>
            </label>
            <input
              type="text"
              placeholder="Consultant Name"
              value={roundFormData.consultant}
              onChange={(e) => setRoundFormData({ ...roundFormData, consultant: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
              Specialty
            </label>
            <input
              type="text"
              placeholder="Specialty"
              value={roundFormData.consultantSpecialty}
              onChange={(e) => setRoundFormData({ ...roundFormData, consultantSpecialty: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
              Notes
            </label>
            <textarea
              placeholder="Notes"
              value={roundFormData.notes}
              onChange={(e) => setRoundFormData({ ...roundFormData, notes: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
              rows="3"
            />
          </div>

          {errorMessage && (
            <div className="text-sm text-[#C8553D]">{errorMessage}</div>
          )}

          <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-[#E8E3DC]">
            <ButtonWithTooltip
              onClick={handleScheduleRound}
              tooltip="Schedule round"
              variant="primary"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Scheduling...
                </>
              ) : (
                <>
                  <Calendar className="w-3.5 h-3.5" />
                  Schedule
                </>
              )}
            </ButtonWithTooltip>
            <ButtonWithTooltip
              onClick={() => {
                setShowScheduleForm(false);
                setErrorMessage('');
              }}
              tooltip="Cancel"
              variant="secondary"
              className="flex-1"
            >
              Cancel
            </ButtonWithTooltip>
          </div>
        </div>
      </GenericModal>

      {/* ==================== CREATE HANDOVER MODAL ==================== */}
      <GenericModal
        isOpen={showHandoverForm}
        onClose={() => {
          setShowHandoverForm(false);
          setErrorMessage('');
        }}
        title="Create Handover Note"
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
              Ward <span className="text-[#C8553D]">*</span>
            </label>
            <select
              value={handoverFormData.wardId}
              onChange={(e) => setHandoverFormData({ ...handoverFormData, wardId: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
            >
              <option value="">Select Ward</option>
              {wards.map(ward => (
                <option key={ward.wardId} value={ward.wardId}>
                  {ward.wardName}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                Handover Officer <span className="text-[#C8553D]">*</span>
              </label>
              <input
                type="text"
                placeholder="Handover Officer Name"
                value={handoverFormData.handoverOfficer}
                onChange={(e) => setHandoverFormData({ ...handoverFormData, handoverOfficer: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                Receiving Officer <span className="text-[#C8553D]">*</span>
              </label>
              <input
                type="text"
                placeholder="Receiving Officer Name"
                value={handoverFormData.receivingOfficer}
                onChange={(e) => setHandoverFormData({ ...handoverFormData, receivingOfficer: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
              Critically Severe Patients
            </label>
            <input
              type="text"
              placeholder="Comma-separated patient IDs"
              value={handoverFormData.criticallySevere}
              onChange={(e) => setHandoverFormData({ ...handoverFormData, criticallySevere: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
              Recent Admissions
            </label>
            <input
              type="text"
              placeholder="Comma-separated patient IDs"
              value={handoverFormData.recentAdmissions}
              onChange={(e) => setHandoverFormData({ ...handoverFormData, recentAdmissions: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
              General Notes
            </label>
            <textarea
              placeholder="General Notes"
              value={handoverFormData.notes}
              onChange={(e) => setHandoverFormData({ ...handoverFormData, notes: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
              rows="3"
            />
          </div>

          {errorMessage && (
            <div className="text-sm text-[#C8553D]">{errorMessage}</div>
          )}

          <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-[#E8E3DC]">
            <ButtonWithTooltip
              onClick={handleCreateHandover}
              tooltip="Create handover"
              variant="primary"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <FileText className="w-3.5 h-3.5" />
                  Create Handover
                </>
              )}
            </ButtonWithTooltip>
            <ButtonWithTooltip
              onClick={() => {
                setShowHandoverForm(false);
                setErrorMessage('');
              }}
              tooltip="Cancel"
              variant="secondary"
              className="flex-1"
            >
              Cancel
            </ButtonWithTooltip>
          </div>
        </div>
      </GenericModal>

      {/* ==================== GRAND ROUND FORM MODAL ==================== */}
      <GenericModal
        isOpen={showGrandRoundForm}
        onClose={() => {
          setShowGrandRoundForm(false);
          setErrorMessage('');
        }}
        title="Schedule Grand Round"
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                Date <span className="text-[#C8553D]">*</span>
              </label>
              <input
                type="date"
                value={grandRoundFormData.date}
                onChange={(e) => setGrandRoundFormData({ ...grandRoundFormData, date: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                Time
              </label>
              <input
                type="time"
                value={grandRoundFormData.time}
                onChange={(e) => setGrandRoundFormData({ ...grandRoundFormData, time: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
              Topic <span className="text-[#C8553D]">*</span>
            </label>
            <input
              type="text"
              placeholder="Topic"
              value={grandRoundFormData.topic}
              onChange={(e) => setGrandRoundFormData({ ...grandRoundFormData, topic: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
              Presenter <span className="text-[#C8553D]">*</span>
            </label>
            <input
              type="text"
              placeholder="Presenter Name"
              value={grandRoundFormData.presenter}
              onChange={(e) => setGrandRoundFormData({ ...grandRoundFormData, presenter: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
              Location
            </label>
            <input
              type="text"
              placeholder="Location"
              value={grandRoundFormData.location}
              onChange={(e) => setGrandRoundFormData({ ...grandRoundFormData, location: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
              Target Audience
            </label>
            <input
              type="text"
              placeholder="Target Audience"
              value={grandRoundFormData.targetAudience}
              onChange={(e) => setGrandRoundFormData({ ...grandRoundFormData, targetAudience: e.target.value })}
              className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
            />
          </div>

          {errorMessage && (
            <div className="text-sm text-[#C8553D]">{errorMessage}</div>
          )}

          <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-[#E8E3DC]">
            <ButtonWithTooltip
              onClick={handleScheduleGrandRound}
              tooltip="Schedule grand round"
              variant="primary"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Scheduling...
                </>
              ) : (
                <>
                  <Calendar className="w-3.5 h-3.5" />
                  Schedule
                </>
              )}
            </ButtonWithTooltip>
            <ButtonWithTooltip
              onClick={() => {
                setShowGrandRoundForm(false);
                setErrorMessage('');
              }}
              tooltip="Cancel"
              variant="secondary"
              className="flex-1"
            >
              Cancel
            </ButtonWithTooltip>
          </div>
        </div>
      </GenericModal>

      {/* Error Modal */}
      <ErrorModal
        isOpen={errorModal.isOpen}
        onClose={() => setErrorModal({ ...errorModal, isOpen: false })}
        title={errorModal.title}
        message={errorModal.message}
        details={errorModal.details}
      />
    </div>
  );
};

export default WardRoundManagement;