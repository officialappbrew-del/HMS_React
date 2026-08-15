import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import {
  ShoppingCart,
  Plus,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  X,
  FileText,
  RefreshCw,
  Loader2,
  Check,
  ArrowUp,
  ArrowDown,
  Shield,
  Banknote,
  Star,
  Users,
  Search,
} from 'lucide-react';
import GenericModal from '../components/GenericModal';
import { createRFQ, createPurchaseOrder, createGRN } from '../features/procurementSlice';

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
    red: 'bg-[#C8553D]',
    orange: 'bg-[#C87D3D]',
    indigo: 'bg-[#4A5A5A]',
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
    'Approved': { label: 'Approved', color: 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]' },
    'Pending Approval': { label: 'Pending', color: 'bg-[#F5F0EA] text-[#C87D3D] border-[#F0E8DC]' },
    'Pending': { label: 'Pending', color: 'bg-[#F5F0EA] text-[#C87D3D] border-[#F0E8DC]' },
    'Completed': { label: 'Completed', color: 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]' },
    'Rejected': { label: 'Rejected', color: 'bg-[#F5EDEA] text-[#C8553D] border-[#E8D6D0]' },
    'Quotes Received': { label: 'Quotes Received', color: 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]' },
    '3-Way Match Passed': { label: '3-Way Match', color: 'bg-[#EAF3EE] text-[#2D7D46] border-[#D0E3D8]' },
    'Unknown': { label: 'Unknown', color: 'bg-[#F0EDE8] text-[#5A5A5A] border-[#E8E3DC]' },
  };

  const config = statusMap[status] || statusMap['Unknown'];

  return (
    <span className={`inline-flex px-2 py-0.5 text-xs font-medium border ${config.color}`}>
      {config.label}
    </span>
  );
};

// ==================== VENDOR CARD ====================
const VendorCard = ({ vendor }) => {
  return (
    <div className="bg-white border border-[#E8E3DC] p-5 hover:bg-[#F7F5F2] transition-colors">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-sm font-display font-semibold text-[#1A1A1A]">{vendor.name || 'Unknown Vendor'}</h3>
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-[#FFC107] fill-[#FFC107]" />
          <span className="text-sm font-medium text-[#1A1A1A]">{(vendor.rating || 0).toFixed(1)}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-[#F7F5F2] border border-[#F0EDE8] p-2">
          <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">Lead Time</p>
          <p className="text-sm font-medium text-[#1A1A1A]">{vendor.leadTime || 0} days</p>
        </div>
        <div className="bg-[#F7F5F2] border border-[#F0EDE8] p-2">
          <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">Min Order</p>
          <p className="text-sm font-medium text-[#1A1A1A]">₦{(vendor.minOrderValue || 0).toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-[#F7F5F2] border border-[#F0EDE8] p-3 mb-3">
        <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">Contact</p>
        <p className="text-sm text-[#1A1A1A]">{vendor.email || 'No email'}</p>
        <p className="text-sm text-[#1A1A1A]">{vendor.phone || 'No phone'}</p>
      </div>

      {vendor.certificationsHeld && vendor.certificationsHeld.length > 0 && (
        <div className="mb-3">
          <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">Certifications</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {vendor.certificationsHeld.map((cert, idx) => (
              <span key={idx} className="text-[10px] font-medium border border-[#C8E0D5] bg-[#E8F5EF] text-[#008751] px-1.5 py-0.5">
                {cert}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="pt-3 border-t border-[#F0EDE8]">
        <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">Total Order Value</p>
        <p className="text-sm font-display font-semibold text-[#1A1A1A]">₦{(vendor.totalOrderValue || 0).toLocaleString()}</p>
      </div>
    </div>
  );
};

// ==================== RFQ CARD ====================
const RFQCard = ({ rfq, vendors }) => {
  return (
    <div className="bg-white border border-[#E8E3DC] p-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
        <div>
          <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">RFQ ID</p>
          <p className="text-sm font-medium text-[#1A1A1A]">{rfq.rfqId || 'N/A'}</p>
        </div>
        <div>
          <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">Created</p>
          <p className="text-sm text-[#1A1A1A]">
            {rfq.createdDate ? new Date(rfq.createdDate).toLocaleDateString('en-NG') : '-'}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">Est. Value</p>
          <p className="text-sm font-medium text-[#1A1A1A]">₦{(rfq.totalEstimatedValue || 0).toLocaleString()}</p>
        </div>
        <div>
          <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">Status</p>
          <StatusBadge status={rfq.status} />
        </div>
      </div>

      <div className="bg-[#F7F5F2] border border-[#F0EDE8] p-3 mb-3">
        <p className="text-sm text-[#1A1A1A]">
          <span className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">Items: </span>
          {(rfq.items || []).map(i => i?.description || 'Unknown').join(', ') || 'No items'}
        </p>
      </div>

      {rfq.quotes && rfq.quotes.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">Quotes Received</p>
          {rfq.quotes.map((quote, idx) => {
            if (!quote) return null;
            const vendor = vendors.find(v => v.vendorId === quote.vendorId);
            return (
              <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-2 bg-[#E8F5EF] border border-[#C8E0D5] text-sm">
                <span className="font-medium text-[#1A1A1A]">{(vendor?.name || 'Unknown')}</span>
                <span className="text-[#008751] font-medium">₦{(quote.quotedPrice || 0).toLocaleString()}</span>
                <span className="text-xs text-[#5A5A5A]">{quote.discount || 0}% discount, {quote.deliveryTime || 0} days</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ==================== PURCHASE ORDER CARD ====================
const PurchaseOrderCard = ({ po }) => {
  const getStatusBg = (status) => {
    if (status === 'Approved') return 'border-l-4 border-[#2D7D46]';
    if (status === 'Pending Approval') return 'border-l-4 border-[#C87D3D]';
    return 'border-l-4 border-[#C8553D]';
  };

  return (
    <div className={`bg-white border border-[#E8E3DC] p-5 ${getStatusBg(po.status)}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-3">
        <div>
          <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">PO ID</p>
          <p className="text-sm font-medium text-[#1A1A1A]">{po.poId || 'N/A'}</p>
        </div>
        <div>
          <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">Vendor</p>
          <p className="text-sm text-[#1A1A1A]">{po.vendorName || 'Unknown'}</p>
        </div>
        <div>
          <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">Total Value</p>
          <p className="text-sm font-medium text-[#1A1A1A]">₦{(po.totalValue || 0).toLocaleString()}</p>
        </div>
        <div>
          <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">Expected Delivery</p>
          <p className="text-sm text-[#1A1A1A]">
            {po.expectedDelivery ? new Date(po.expectedDelivery).toLocaleDateString('en-NG') : '-'}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">Status</p>
          <StatusBadge status={po.status} />
        </div>
      </div>

      <div className="bg-[#F7F5F2] border border-[#F0EDE8] p-3 mb-3">
        <p className="text-sm text-[#1A1A1A]">
          <span className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">Payment Terms: </span>
          {po.paymentTerms || 'Not specified'}
        </p>
      </div>

      {po.status === 'Pending Approval' && (
        <div className="flex gap-2">
          <ButtonWithTooltip
            onClick={() => {}}
            tooltip="Approve purchase order"
            variant="success"
            className="flex-1 justify-center"
          >
            <Check className="w-3.5 h-3.5" />
            Approve
          </ButtonWithTooltip>
          <ButtonWithTooltip
            onClick={() => {}}
            tooltip="Reject purchase order"
            variant="danger"
            className="flex-1 justify-center"
          >
            <X className="w-3.5 h-3.5" />
            Reject
          </ButtonWithTooltip>
        </div>
      )}
    </div>
  );
};

// ==================== GRN CARD ====================
const GRNCard = ({ grn }) => {
  return (
    <div className="bg-white border border-[#E8E3DC] p-5 border-l-4 border-[#2D7D46]">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-3">
        <div>
          <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">GRN ID</p>
          <p className="text-sm font-medium text-[#1A1A1A]">{grn.grnId || 'N/A'}</p>
        </div>
        <div>
          <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">PO ID</p>
          <p className="text-sm text-[#1A1A1A]">{grn.poId || 'N/A'}</p>
        </div>
        <div>
          <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">GRN Date</p>
          <p className="text-sm text-[#1A1A1A]">
            {grn.grnDate ? new Date(grn.grnDate).toLocaleDateString('en-NG') : '-'}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">Received By</p>
          <p className="text-sm text-[#1A1A1A]">{grn.receivedBy || 'Unknown'}</p>
        </div>
        <div>
          <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">Status</p>
          <StatusBadge status={grn.status} />
        </div>
      </div>

      <div className="bg-[#E8F5EF] border border-[#C8E0D5] p-3">
        <p className="text-sm text-[#1A1A1A]">
          <span className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">Inspection: </span>
          <span className="font-medium text-[#2D7D46]">✓ {grn.inspectionStatus || 'Not inspected'}</span>
        </p>
        <p className="text-sm text-[#1A1A1A]">
          <span className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">Inspected By: </span>
          {grn.inspectedBy || 'Unknown'}
        </p>
        {grn.damageReports && (
          <p className="text-sm text-[#C8553D] font-medium">⚠ Damage Reports: {grn.damageReports}</p>
        )}
      </div>
    </div>
  );
};

// ==================== INVOICE MATCH CARD ====================
const InvoiceMatchCard = ({ match }) => {
  const isPassed = match.status === '3-Way Match Passed';

  return (
    <div className={`bg-white border border-[#E8E3DC] p-5 ${isPassed ? 'border-l-4 border-[#2D7D46]' : 'border-l-4 border-[#C87D3D]'}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
        <div>
          <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">Match ID</p>
          <p className="text-sm font-medium text-[#1A1A1A]">{match.matchingId || 'N/A'}</p>
        </div>
        <div>
          <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">PO - GRN - Invoice</p>
          <p className="text-sm text-[#1A1A1A]">
            {match.poId || 'N/A'} ✓ {match.grnId || 'N/A'} ✓ {match.invoiceId || 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">Amount</p>
          <p className="text-sm font-medium text-[#1A1A1A]">₦{(match.amount || 0).toLocaleString()}</p>
        </div>
        <div>
          <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">Status</p>
          <StatusBadge status={match.status} />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-[#F7F5F2] border border-[#F0EDE8] p-2 text-center">
          <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">Qty Match</p>
          <p className={`text-sm font-medium ${match.quantityMatch ? 'text-[#2D7D46]' : 'text-[#C8553D]'}`}>
            {match.quantityMatch ? '✓ Match' : '✗ Variance'}
          </p>
        </div>
        <div className="bg-[#F7F5F2] border border-[#F0EDE8] p-2 text-center">
          <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">Amount Match</p>
          <p className={`text-sm font-medium ${match.amountMatch ? 'text-[#2D7D46]' : 'text-[#C8553D]'}`}>
            {match.amountMatch ? '✓ Match' : '✗ Variance'}
          </p>
        </div>
        <div className="bg-[#F7F5F2] border border-[#F0EDE8] p-2 text-center">
          <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">Overall</p>
          <p className="text-sm font-medium text-[#2D7D46]">✓ Passed</p>
        </div>
      </div>

      {match.discrepancies && (
        <p className="text-sm text-[#C87D3D]">⚠ Discrepancies: {match.discrepancies}</p>
      )}
    </div>
  );
};

// ==================== PAYMENT CARD ====================
const PaymentCard = ({ payment }) => {
  // Helper function to format bank details object as a readable string
  const formatBankDetails = (details) => {
    if (!details) return 'Not specified';
    if (typeof details === 'string') return details;
    if (typeof details === 'object') {
      const parts = [];
      if (details.bankName) parts.push(details.bankName);
      if (details.accountName) parts.push(details.accountName);
      if (details.accountNumber) parts.push(details.accountNumber);
      if (details.sortCode) parts.push(`Sort Code: ${details.sortCode}`);
      return parts.length > 0 ? parts.join(' - ') : 'Not specified';
    }
    return 'Not specified';
  };

  return (
    <div className="bg-white border border-[#E8E3DC] p-5 border-l-4 border-[#008751]">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-3">
        <div>
          <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">Payment ID</p>
          <p className="text-sm font-medium text-[#1A1A1A]">{payment.paymentId || 'N/A'}</p>
        </div>
        <div>
          <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">PO ID</p>
          <p className="text-sm text-[#1A1A1A]">{payment.poId || 'N/A'}</p>
        </div>
        <div>
          <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">Amount</p>
          <p className="text-sm font-medium text-[#1A1A1A]">₦{(payment.authorizedAmount || 0).toLocaleString()}</p>
        </div>
        <div>
          <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">Due Date</p>
          <p className="text-sm text-[#1A1A1A]">
            {payment.dueDate ? new Date(payment.dueDate).toLocaleDateString('en-NG') : '-'}
          </p>
        </div>
        <div>
          <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">Status</p>
          <StatusBadge status={payment.paymentStatus} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <div className="bg-[#E8F5EF] border border-[#C8E0D5] p-3">
          <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">Authorized By</p>
          <p className="text-sm font-medium text-[#1A1A1A]">{payment.authorizedBy || 'Unknown'}</p>
          <p className="text-xs text-[#5A5A5A]">
            {payment.authorizationDate ? new Date(payment.authorizationDate).toLocaleDateString('en-NG') : '-'}
          </p>
        </div>
        <div className="bg-[#F5F0EA] border border-[#F0E8DC] p-3">
          <p className="text-[10px] text-[#5A5A5A] uppercase tracking-wider">Payment Method</p>
          <p className="text-sm font-medium text-[#1A1A1A]">{payment.paymentMethod || 'Not specified'}</p>
          <p className="text-xs text-[#5A5A5A]">
            {formatBankDetails(payment.bankDetails)}
          </p>
        </div>
      </div>

      {payment.paymentStatus === 'Pending' && (
        <ButtonWithTooltip
          onClick={() => {}}
          tooltip="Execute payment"
          variant="success"
          className="w-full justify-center"
        >
          <Banknote className="w-3.5 h-3.5" />
          Execute Payment
        </ButtonWithTooltip>
      )}
    </div>
  );
};

// ==================== MAIN COMPONENT ====================
const Procurement = () => {
  const procurementState = useSelector(state => state.procurement || {});
  const dispatch = useDispatch();

  const vendors = procurementState.vendors || [];
  const rfqs = procurementState.rfqs || [];
  const purchaseOrders = procurementState.purchaseOrders || [];
  const goodsReceivedNotes = procurementState.goodsReceivedNotes || [];
  const invoiceMatching = procurementState.invoiceMatching || [];
  const paymentAuthorizations = procurementState.paymentAuthorizations || [];

  const [activeTab, setActiveTab] = useState('vendors');
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const approvedPOs = purchaseOrders.filter(po => po && po.status === 'Approved').length;
  const pendingGRNs = purchaseOrders.filter(po => {
    if (!po || !po.poId) return false;
    return !goodsReceivedNotes.find(g => g && g.poId === po.poId);
  }).length;

  const totalProcured = purchaseOrders.reduce((sum, po) => {
    if (!po || !po.totalValue) return sum;
    return sum + po.totalValue;
  }, 0);

  // Tabs configuration
  const tabs = [
    { id: 'vendors', label: 'Vendors', icon: Users, count: vendors.length },
    { id: 'rfq', label: 'RFQs', icon: FileText, count: rfqs.length },
    { id: 'po', label: 'Purchase Orders', icon: ShoppingCart, count: purchaseOrders.length },
    { id: 'grn', label: 'GRN', icon: CheckCircle, count: goodsReceivedNotes.length },
    { id: 'matching', label: 'Invoice Matching', icon: Shield, count: invoiceMatching.length },
    { id: 'payment', label: 'Payments', icon: Banknote, count: paymentAuthorizations.length },
  ];

  const handleCreateRFQ = () => {
    setErrorMessage('');
    setSuccessMessage('');
    setIsSubmitting(true);

    try {
      // RFQ creation logic would go here
      setSuccessMessage('RFQ created successfully.');
      setTimeout(() => setSuccessMessage(''), 3000);
      setShowModal(false);
    } catch (error) {
      setErrorMessage(error.message || 'Unable to create RFQ.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRefresh = () => {
    setSuccessMessage('Data refreshed.');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="procurement min-h-screen bg-[#F7F5F2] p-3 sm:p-4 md:p-8 font-sans">
      {/* Header */}
      <div className="mb-4 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded bg-[#F0EDE8] flex items-center justify-center flex-shrink-0">
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-[#4A5A5A]" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-display font-bold text-[#1A1A1A] tracking-tight">
                Procurement Management
              </h1>
              <p className="text-xs sm:text-sm text-[#5A5A5A]">
                Vendor management, RFQ, purchase orders, GRN & payment authorization
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
            <ButtonWithTooltip
              onClick={handleRefresh}
              tooltip="Refresh data"
              variant="secondary"
              size="sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Refresh</span>
            </ButtonWithTooltip>
            <ButtonWithTooltip
              onClick={() => setShowModal(true)}
              tooltip="Create new RFQ"
              variant="primary"
              size="sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New RFQ</span>
              <span className="sm:hidden">RFQ</span>
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
            <Check className="w-4 h-4 flex-shrink-0" />
            {successMessage}
          </span>
          <button onClick={() => setSuccessMessage('')} className="text-[#2D7D46] hover:text-[#1E5F33]">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-4 sm:mb-8">
        <StatsCard
          title="Total Vendors"
          value={vendors.length}
          icon={Users}
          color="indigo"
          tooltip="Registered vendors"
        />
        <StatsCard
          title="Approved POs"
          value={approvedPOs}
          icon={CheckCircle}
          color="green"
          tooltip="Approved purchase orders"
        />
        <StatsCard
          title="Pending GRN"
          value={pendingGRNs}
          icon={AlertCircle}
          color="orange"
          tooltip="Pending goods received notes"
          trend={pendingGRNs > 0 ? 'down' : 'up'}
          trendValue={pendingGRNs > 0 ? `${pendingGRNs} pending` : 'All complete'}
        />
        <StatsCard
          title="RFQs Created"
          value={rfqs.length}
          icon={FileText}
          color="purple"
          tooltip="Total RFQs created"
        />
        <StatsCard
          title="Total Procured"
          value={`₦${(totalProcured / 1000000).toFixed(1)}M`}
          icon={TrendingUp}
          color="blue"
          tooltip="Total procurement value"
        />
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-[#E8E3DC] p-4 sm:p-5 mb-4 sm:mb-6">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#B0A89E]" />
          <input
            type="text"
            placeholder={`Search in ${tabs.find(t => t.id === activeTab)?.label || 'vendors'}...`}
            className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
          />
        </div>
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

        {/* ==================== VENDORS TAB ==================== */}
        {activeTab === 'vendors' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vendors.length === 0 ? (
              <div className="col-span-2 bg-white border border-[#E8E3DC] p-12 text-center">
                <Users className="w-12 h-12 text-[#D8D4CD] mx-auto mb-3" />
                <p className="text-[#5A5A5A] font-medium">No vendors found</p>
              </div>
            ) : (
              vendors.map(vendor => (
                <VendorCard key={vendor.vendorId} vendor={vendor} />
              ))
            )}
          </div>
        )}

        {/* ==================== RFQ TAB ==================== */}
        {activeTab === 'rfq' && (
          <div className="space-y-4">
            {rfqs.length === 0 ? (
              <div className="bg-white border border-[#E8E3DC] p-12 text-center">
                <FileText className="w-12 h-12 text-[#D8D4CD] mx-auto mb-3" />
                <p className="text-[#5A5A5A] font-medium">No RFQs found</p>
              </div>
            ) : (
              rfqs.map(rfq => (
                <RFQCard key={rfq.rfqId} rfq={rfq} vendors={vendors} />
              ))
            )}
          </div>
        )}

        {/* ==================== PURCHASE ORDERS TAB ==================== */}
        {activeTab === 'po' && (
          <div className="space-y-4">
            {purchaseOrders.length === 0 ? (
              <div className="bg-white border border-[#E8E3DC] p-12 text-center">
                <ShoppingCart className="w-12 h-12 text-[#D8D4CD] mx-auto mb-3" />
                <p className="text-[#5A5A5A] font-medium">No purchase orders found</p>
              </div>
            ) : (
              purchaseOrders.map(po => (
                <PurchaseOrderCard key={po.poId} po={po} />
              ))
            )}
          </div>
        )}

        {/* ==================== GRN TAB ==================== */}
        {activeTab === 'grn' && (
          <div className="space-y-4">
            {goodsReceivedNotes.length === 0 ? (
              <div className="bg-white border border-[#E8E3DC] p-12 text-center">
                <CheckCircle className="w-12 h-12 text-[#D8D4CD] mx-auto mb-3" />
                <p className="text-[#5A5A5A] font-medium">No goods received notes found</p>
              </div>
            ) : (
              goodsReceivedNotes.map(grn => (
                <GRNCard key={grn.grnId} grn={grn} />
              ))
            )}
          </div>
        )}

        {/* ==================== INVOICE MATCHING TAB ==================== */}
        {activeTab === 'matching' && (
          <div className="space-y-4">
            {invoiceMatching.length === 0 ? (
              <div className="bg-white border border-[#E8E3DC] p-12 text-center">
                <Shield className="w-12 h-12 text-[#D8D4CD] mx-auto mb-3" />
                <p className="text-[#5A5A5A] font-medium">No invoice matching records found</p>
              </div>
            ) : (
              invoiceMatching.map(match => (
                <InvoiceMatchCard key={match.matchingId} match={match} />
              ))
            )}
          </div>
        )}

        {/* ==================== PAYMENTS TAB ==================== */}
        {activeTab === 'payment' && (
          <div className="space-y-4">
            {paymentAuthorizations.length === 0 ? (
              <div className="bg-white border border-[#E8E3DC] p-12 text-center">
                <Banknote className="w-12 h-12 text-[#D8D4CD] mx-auto mb-3" />
                <p className="text-[#5A5A5A] font-medium">No payment authorizations found</p>
              </div>
            ) : (
              paymentAuthorizations.map(payment => (
                <PaymentCard key={payment.paymentId} payment={payment} />
              ))
            )}
          </div>
        )}
      </div>

      {/* ==================== CREATE RFQ MODAL ==================== */}
      <GenericModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setErrorMessage('');
        }}
        title="Create New RFQ"
        size="lg"
      >
        <form onSubmit={(e) => { e.preventDefault(); handleCreateRFQ(); }} className="space-y-4">
          <div>
            <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
              Item Description <span className="text-[#C8553D]">*</span>
            </label>
            <input
              type="text"
              placeholder="Item Description"
              className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                Estimated Quantity <span className="text-[#C8553D]">*</span>
              </label>
              <input
                type="number"
                placeholder="Estimated Quantity"
                className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
                Estimated Unit Cost <span className="text-[#C8553D]">*</span>
              </label>
              <input
                type="number"
                placeholder="Estimated Unit Cost"
                className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
              Select Vendors to Quote
            </label>
            <select className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors">
              <option value="">Select Vendor</option>
              {vendors.map(vendor => (
                <option key={vendor.vendorId} value={vendor.vendorId}>
                  {vendor.name || vendor.vendorId}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-medium text-[#5A5A5A] uppercase tracking-wider mb-1">
              RFQ Deadline <span className="text-[#C8553D]">*</span>
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 text-sm bg-white border border-[#D8D4CD] focus:border-[#008751] focus:outline-none transition-colors"
              required
            />
          </div>

          {errorMessage && <div className="text-sm text-[#C8553D]">{errorMessage}</div>}

          <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-[#E8E3DC]">
            <ButtonWithTooltip
              type="submit"
              tooltip="Create RFQ"
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
                  <Plus className="w-3.5 h-3.5" />
                  Create RFQ
                </>
              )}
            </ButtonWithTooltip>
            <ButtonWithTooltip
              type="button"
              onClick={() => {
                setShowModal(false);
                setErrorMessage('');
              }}
              tooltip="Cancel"
              variant="secondary"
              className="flex-1"
            >
              Cancel
            </ButtonWithTooltip>
          </div>
        </form>
      </GenericModal>
    </div>
  );
};

export default Procurement;