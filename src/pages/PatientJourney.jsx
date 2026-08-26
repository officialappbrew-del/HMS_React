import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Loader2, User, MapPin, Activity, Pill, Receipt,
  Calendar, Eye, X, Stethoscope, Syringe, ChevronDown, ChevronUp,
  Clock, AlertCircle, Phone, FileText, CreditCard, DollarSign,
  Wallet, CheckCircle, AlertTriangle, MinusCircle, ClipboardList,
  Hospital, Shield, Banknote, Coins
} from 'lucide-react';
import { apiRequest } from '../utils/api';

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================
const money = (value) => `₦${Number(value || 0).toLocaleString()}`;
const date = (value) => value ? new Date(value).toLocaleString('en-NG') : 'Not recorded';
const shortDate = (value) => value ? new Date(value).toLocaleDateString('en-NG') : 'N/A';

const getStatusColor = (status) => {
  const colors = {
    paid: 'bg-emerald-100 text-emerald-700',
    partially_paid: 'bg-amber-100 text-amber-700',
    unpaid: 'bg-rose-100 text-rose-700',
    draft: 'bg-gray-100 text-gray-600',
    cancelled: 'bg-red-100 text-red-700',
    completed: 'bg-blue-100 text-blue-700',
  };
  return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-600';
};

const getStatusBadge = (status) => {
  const badges = {
    paid: { icon: CheckCircle, color: 'text-emerald-600' },
    partially_paid: { icon: AlertTriangle, color: 'text-amber-600' },
    unpaid: { icon: AlertCircle, color: 'text-rose-600' },
    draft: { icon: FileText, color: 'text-gray-600' },
    cancelled: { icon: MinusCircle, color: 'text-red-600' },
    completed: { icon: CheckCircle, color: 'text-blue-600' },
  };
  return badges[status?.toLowerCase()] || { icon: FileText, color: 'text-gray-600' };
};

// Payment method icons mapping
const getPaymentMethodIcon = (method) => {
  const icons = {
    cash: Banknote,
    card: CreditCard,
    transfer: Landmark,
    pos: Shield,
    insurance: Hospital,
    other: Coins,
  };
  return icons[method?.toLowerCase()] || Coins;
};

// ============================================================================
// SUBCOMPONENTS
// ============================================================================

const StatCard = ({ icon: Icon, label, value, color = 'emerald', subtitle = null }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 hover:shadow-md transition-shadow duration-200">
    <div className="flex items-center gap-2 sm:gap-3">
      <div className={`p-2 rounded-lg bg-${color}-50 flex-shrink-0`}>
        <Icon className={`w-4 h-4 sm:w-5 sm:h-5 text-${color}-600`} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-lg sm:text-2xl font-bold text-gray-900 truncate">{value || 0}</p>
        <p className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wider truncate">{label}</p>
        {subtitle && <p className="text-[8px] sm:text-[10px] text-gray-400 truncate">{subtitle}</p>}
      </div>
    </div>
  </div>
);

const TimelineEvent = ({ event }) => {
  const eventIconMap = {
    visit: MapPin,
    consultation: Stethoscope,
    vital: Activity,
    prescription: Pill,
    dispense: Syringe,
    billing: Receipt,
  };
  
  const EventIcon = eventIconMap[event.type] || Clock;

  const colorMap = {
    visit: 'bg-blue-600',
    consultation: 'bg-purple-600',
    vital: 'bg-emerald-600',
    prescription: 'bg-amber-600',
    dispense: 'bg-rose-600',
    billing: 'bg-indigo-600',
  };

  const bgColor = colorMap[event.type] || 'bg-gray-600';

  return (
    <div className="flex gap-2 sm:gap-4 group">
      <div className="flex flex-col items-center">
        <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full ${bgColor} flex items-center justify-center shadow-md ring-2 ring-white z-10 flex-shrink-0`}>
          <EventIcon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
        </div>
        <div className="w-0.5 flex-1 bg-gray-200 group-last:hidden" />
      </div>
      <div className="flex-1 bg-white rounded-lg border border-gray-200 p-3 sm:p-4 mb-3 sm:mb-4 hover:border-emerald-300 transition-all duration-200 min-w-0">
        <div className="flex flex-col sm:flex-row flex-wrap items-start justify-between gap-1 sm:gap-2">
          <div className="flex-1 min-w-0 w-full sm:w-auto">
            <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
              <h4 className="text-xs sm:text-sm font-semibold text-gray-900 break-words">{event.title}</h4>
              <span className="text-[10px] sm:text-xs text-gray-500 font-mono bg-gray-50 px-1.5 sm:px-2 py-0.5 rounded truncate">
                {event.type}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mt-0.5 break-words">{event.subtitle}</p>
          </div>
          <div className="text-[10px] sm:text-xs text-gray-500 whitespace-nowrap flex items-center gap-1 flex-shrink-0">
            <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            {shortDate(event.timestamp)}
          </div>
        </div>
        {event.detail && (
          <p className="text-[10px] sm:text-xs text-gray-500 mt-1 sm:mt-2 border-t border-gray-100 pt-1 sm:pt-2 break-words">
            {event.detail}
          </p>
        )}
        {event.extra && (
          <p className="text-[10px] sm:text-xs text-emerald-600 mt-1 font-medium break-words">{event.extra}</p>
        )}
        {event.actor && (
          <p className="text-[10px] sm:text-xs text-gray-400 mt-1 break-words flex items-center gap-1">
            <User className="w-3 h-3" />
            {event.actor}
          </p>
        )}
        {event.cost && (
          <p className="text-[10px] sm:text-xs text-indigo-600 mt-1 font-medium flex items-center gap-1">
            <DollarSign className="w-3 h-3" />
            {money(event.cost)}
          </p>
        )}
      </div>
    </div>
  );
};

const InvoiceCard = ({ invoice, onView, expandedInvoices, toggleInvoiceExpand, visitLabel }) => {
  const statusColor = getStatusColor(invoice.status);
  const StatusIcon = getStatusBadge(invoice.status).icon;
  const hasBalance = Number(invoice.balance_due || 0) > 0;
  const isExpanded = expandedInvoices.includes(invoice.id);
  const items = invoice.items || [];
  const totalItems = items.length;

  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200">
      {/* Invoice Header */}
      <div className="p-3 sm:p-5">
        <div className="flex flex-col lg:flex-row flex-wrap items-start justify-between gap-3">
          <div className="flex-1 min-w-0 w-full lg:w-auto">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm sm:text-base font-semibold text-gray-900 truncate max-w-[140px] sm:max-w-[200px]">
                {invoice.invoice_number}
              </h4>
              <span className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${statusColor} flex-shrink-0 inline-flex items-center gap-1`}>
                <StatusIcon className="w-3 h-3" />
                {invoice.status || 'Unknown'}
              </span>
              {totalItems > 0 && (
                <span className="text-[10px] sm:text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full flex-shrink-0">
                  {totalItems} {totalItems === 1 ? 'item' : 'items'}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
              {shortDate(invoice.invoice_date)}
              {invoice.department && ` · ${invoice.department}`}
              {visitLabel && ` · ${visitLabel}`}
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto">
            <div className="text-left">
              <p className="text-[10px] sm:text-xs text-gray-500">Total</p>
              <p className="text-xs sm:text-sm font-semibold text-gray-900">{money(invoice.total_amount)}</p>
            </div>
            <div className="text-left">
              <p className="text-[10px] sm:text-xs text-gray-500">Paid</p>
              <p className="text-xs sm:text-sm font-semibold text-emerald-600">{money(invoice.amount_paid)}</p>
            </div>
            <div className="text-left">
              <p className="text-[10px] sm:text-xs text-gray-500">Balance</p>
              <p className={`text-xs sm:text-sm font-bold ${hasBalance ? 'text-rose-600' : 'text-emerald-600'}`}>
                {money(invoice.balance_due)}
              </p>
            </div>
            <div className="flex items-end justify-start lg:justify-end gap-1">
              {totalItems > 0 && (
                <button
                  onClick={() => toggleInvoiceExpand(invoice.id)}
                  className="p-1.5 sm:p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                  title={isExpanded ? 'Hide items' : 'Show items'}
                >
                  {isExpanded ? <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5" /> : <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5" />}
                </button>
              )}
              <button
                onClick={() => onView(invoice)}
                className="p-1.5 sm:p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors flex-shrink-0"
                title="View full details"
              >
                <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Invoice Items Preview */}
        {(invoice.items || []).length > 0 && !isExpanded && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] sm:text-xs font-medium text-gray-500">Items:</span>
              <div className="flex flex-wrap gap-1">
                {(invoice.items || []).slice(0, 3).map((item, idx) => (
                  <span key={idx} className="text-[10px] sm:text-xs bg-gray-50 px-2 py-0.5 rounded-full text-gray-600 truncate max-w-[150px] sm:max-w-[200px]">
                    {item.description}
                    <span className="text-gray-400 ml-1">({money(item.line_total)})</span>
                  </span>
                ))}
                {(invoice.items || []).length > 3 && (
                  <span className="text-[10px] sm:text-xs text-gray-400">
                    +{(invoice.items || []).length - 3} more
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Expanded Items Details */}
      {isExpanded && totalItems > 0 && (
        <div className="border-t border-gray-100 bg-gray-50 rounded-b-xl overflow-hidden">
          <div className="p-3 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <h5 className="text-xs sm:text-sm font-semibold text-gray-700 flex items-center gap-2">
                <ClipboardList className="w-4 h-4" />
                Invoice Items Details
              </h5>
              <span className="text-[10px] sm:text-xs text-gray-500">
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </span>
            </div>
            
            {/* Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600">#</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600">Description</th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600">Type</th>
                    <th className="px-3 py-2 text-center font-semibold text-gray-600">Qty</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-600">Unit Price</th>
                    <th className="px-3 py-2 text-right font-semibold text-gray-600">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {items.map((item, index) => (
                    <tr key={item.id || index} className="hover:bg-gray-100 transition-colors">
                      <td className="px-3 py-2 text-gray-500">{index + 1}</td>
                      <td className="px-3 py-2 font-medium text-gray-900">{item.description}</td>
                      <td className="px-3 py-2 text-gray-600">{item.item_type || 'Service'}</td>
                      <td className="px-3 py-2 text-center text-gray-600">{item.quantity || 1}</td>
                      <td className="px-3 py-2 text-right text-gray-600">{money(item.unit_price || 0)}</td>
                      <td className="px-3 py-2 text-right font-semibold text-indigo-600">{money(item.line_total || 0)}</td>
                    </tr>
                  ))}
                </tbody>
                {/* Totals Row */}
                <tfoot className="bg-gray-100 font-semibold">
                  <tr>
                    <td colSpan="5" className="px-3 py-2 text-right text-gray-700">Subtotal:</td>
                    <td className="px-3 py-2 text-right text-gray-900">{money(invoice.subtotal || invoice.total_amount)}</td>
                  </tr>
                  {invoice.discount > 0 && (
                    <tr className="text-emerald-600">
                      <td colSpan="5" className="px-3 py-2 text-right">Discount:</td>
                      <td className="px-3 py-2 text-right">-{money(invoice.discount)}</td>
                    </tr>
                  )}
                  {invoice.tax > 0 && (
                    <tr className="text-amber-600">
                      <td colSpan="5" className="px-3 py-2 text-right">Tax:</td>
                      <td className="px-3 py-2 text-right">+{money(invoice.tax)}</td>
                    </tr>
                  )}
                  <tr className="text-indigo-700 border-t-2 border-gray-300">
                    <td colSpan="5" className="px-3 py-2 text-right text-base">Total:</td>
                    <td className="px-3 py-2 text-right text-base font-bold">{money(invoice.total_amount)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Payment Summary */}
            {invoice.payments && invoice.payments.length > 0 && (
              <div className="mt-4 pt-3 border-t border-gray-200">
                <h6 className="text-xs font-semibold text-gray-700 mb-2">Payment History</h6>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {invoice.payments.map((payment, idx) => (
                    <div key={idx} className="bg-white rounded-lg px-3 py-2 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-gray-600">{shortDate(payment.payment_date)}</span>
                        <span className="text-gray-400 ml-2 capitalize">{payment.payment_method}</span>
                      </div>
                      <span className="font-semibold text-emerald-600">{money(payment.amount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const PaymentModal = ({
  invoice,
  onClose,
  onPaymentSubmit,
  paymentAmount,
  setPaymentAmount,
  paymentMethod,
  setPaymentMethod,
  paymentSaving,
  paymentError,
}) => {
  if (!invoice) return null;

  const totalPaid = invoice.payments?.reduce((sum, p) => sum + Number(p.amount), 0) || 0;
  const totalItems = invoice.items?.length || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-3xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto bg-white rounded-xl sm:rounded-2xl shadow-2xl mx-2 sm:mx-0" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 rounded-t-xl sm:rounded-t-2xl flex flex-wrap items-center justify-between gap-2 z-10">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 truncate">{invoice.invoice_number}</h2>
              <span className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${getStatusColor(invoice.status)}`}>
                {invoice.status || 'Unknown'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-gray-500">{shortDate(invoice.invoice_date)}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            aria-label="Close"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
            {[
              { label: 'Subtotal', value: money(invoice.subtotal), color: 'text-gray-900', icon: DollarSign },
              { label: 'Total Paid', value: money(totalPaid), color: 'text-emerald-600', icon: CreditCard },
              { label: 'Balance Due', value: money(invoice.balance_due), color: Number(invoice.balance_due) > 0 ? 'text-rose-600' : 'text-emerald-600', icon: Wallet },
              { label: 'Items', value: totalItems, color: 'text-gray-900', icon: FileText },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="bg-gray-50 rounded-lg p-2 sm:p-3 text-center min-w-0">
                  <Icon className={`w-3 h-3 sm:w-4 sm:h-4 mx-auto mb-1 ${item.color}`} />
                  <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider">{item.label}</p>
                  <p className={`text-sm sm:text-base font-bold ${item.color} truncate`}>{item.value}</p>
                </div>
              );
            })}
          </div>

          {/* Line Items with Costs */}
          <div>
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-900">Line Items</h3>
              <span className="text-[10px] sm:text-xs text-gray-500">{totalItems} items</span>
            </div>
            <div className="bg-gray-50 rounded-lg divide-y divide-gray-200 max-h-[250px] overflow-y-auto">
              {(invoice.items || []).map((item) => (
                <div key={item.id} className="flex flex-wrap items-center justify-between gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-3 hover:bg-gray-100 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-gray-900 break-words">{item.description}</p>
                    <p className="text-[10px] sm:text-xs text-gray-500">
                      {item.item_type || 'Service'} · Qty {item.quantity} · Unit {money(item.unit_price)}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs sm:text-sm font-bold text-indigo-600">{money(item.line_total)}</p>
                  </div>
                </div>
              ))}
              {!invoice.items?.length && (
                <p className="px-3 sm:px-4 py-3 text-xs sm:text-sm text-gray-500">No line items recorded.</p>
              )}
              
              {(invoice.items || []).length > 0 && (
                <div className="px-3 sm:px-4 py-2 sm:py-3 bg-gray-100 rounded-b-lg">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs sm:text-sm font-semibold text-gray-700">Total</span>
                    <span className="text-xs sm:text-sm font-bold text-gray-900">{money(invoice.total_amount)}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Payment History */}
          <div>
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <h3 className="text-xs sm:text-sm font-semibold text-gray-900">Payment History</h3>
              <span className="text-[10px] sm:text-xs text-gray-500">
                Total: {money(totalPaid)}
              </span>
            </div>
            {(invoice.payments || []).length ? (
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {invoice.payments.map((payment) => (
                  <div key={payment.id} className="flex flex-wrap items-center justify-between gap-2 bg-gray-50 rounded-lg px-3 sm:px-4 py-2 sm:py-3 hover:bg-gray-100 transition-colors">
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-gray-900 break-words">{date(payment.payment_date)}</p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] sm:text-xs text-gray-500 capitalize">{payment.payment_method}</span>
                        {payment.reference && (
                          <span className="text-[10px] sm:text-xs text-gray-400">Ref: {payment.reference}</span>
                        )}
                      </div>
                      {payment.received_by && (
                        <p className="text-[10px] sm:text-xs text-gray-400">By: {payment.received_by}</p>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-emerald-600 flex-shrink-0">{money(payment.amount)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs sm:text-sm text-gray-500 bg-gray-50 rounded-lg px-3 sm:px-4 py-3">No payments recorded.</p>
            )}
          </div>

          {/* Payment Form - NO HARD-CODED ICONS */}
          {Number(invoice.balance_due || 0) > 0 && (
            <form onSubmit={onPaymentSubmit} className="border-t border-gray-200 pt-4 sm:pt-6">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
                <h3 className="text-xs sm:text-sm font-semibold text-gray-900">Record Payment</h3>
                <span className="text-[10px] sm:text-xs text-rose-600 ml-auto font-medium">
                  Balance: {money(invoice.balance_due)}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] sm:text-xs font-medium text-gray-700 mb-1 sm:mb-1.5">
                    Amount (₦)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs sm:text-sm">₦</span>
                    <input
                      type="number"
                      min="0.01"
                      max={invoice.balance_due}
                      step="0.01"
                      required
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      placeholder={`Max ${money(invoice.balance_due)}`}
                      className="w-full border border-gray-300 rounded-lg pl-8 pr-3 sm:pl-10 sm:pr-4 py-2 sm:py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] sm:text-xs font-medium text-gray-700 mb-1 sm:mb-1.5">
                    Payment Method
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="transfer">Transfer</option>
                    <option value="pos">POS</option>
                    <option value="insurance">Insurance</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {paymentError && (
                <div className="mt-3 p-2 sm:p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  <p className="text-xs sm:text-sm text-rose-700 break-words">{paymentError}</p>
                </div>
              )}

              <div className="mt-3 sm:mt-4 flex flex-wrap gap-2 sm:gap-3">
                <button
                  type="submit"
                  disabled={paymentSaving}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {paymentSaving && <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />}
                  {paymentSaving ? 'Processing...' : 'Confirm Payment'}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

const PrescriptionCard = ({ rx }) => {
  const hasDispense = rx.dispense_status === 'dispensed';
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 hover:border-amber-300 transition-all">
      <div className="flex flex-col sm:flex-row flex-wrap items-start justify-between gap-2">
        <div className="flex-1 min-w-0 w-full sm:w-auto">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-xs sm:text-sm font-semibold text-gray-900 break-words">{rx.drug_name}</h4>
            <span className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full flex-shrink-0 ${
              hasDispense ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
            }`}>
              {hasDispense ? 'Dispensed' : 'Pending'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 break-words">{rx.dosage} · {rx.frequency}</p>
          {rx.route && <p className="text-[10px] sm:text-xs text-gray-500 break-words">Route: {rx.route}</p>}
          {rx.cost && (
            <p className="text-[10px] sm:text-xs text-indigo-600 font-medium mt-1 flex items-center gap-1">
              <DollarSign className="w-3 h-3" />
              {money(rx.cost)}
            </p>
          )}
        </div>
        <div className="text-left sm:text-right text-[10px] sm:text-xs text-gray-500 whitespace-nowrap flex-shrink-0">
          <p>Prescribed: {shortDate(rx.prescribed_date)}</p>
          {rx.prescribed_by_name && <p className="text-gray-400 truncate max-w-[120px] sm:max-w-none">By: {rx.prescribed_by_name}</p>}
        </div>
      </div>
    </div>
  );
};

const VitalCard = ({ vital }) => (
  <div className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 hover:border-emerald-300 transition-all">
    <div className="flex flex-col sm:flex-row flex-wrap items-start justify-between gap-2">
      <div className="flex-1 min-w-0 w-full sm:w-auto">
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <Activity className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600 flex-shrink-0" />
          <span className="text-xs sm:text-sm text-gray-900 font-medium break-words">
            {vital.blood_pressure_systolic && vital.blood_pressure_diastolic
              ? `${vital.blood_pressure_systolic}/${vital.blood_pressure_diastolic}`
              : 'BP not recorded'}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-2 sm:gap-x-4 gap-y-0.5 sm:gap-y-1 mt-1 sm:mt-1.5">
          {[
            ['Pulse', vital.pulse, 'bpm'],
            ['Temp', vital.temperature, '°C'],
            ['RR', vital.respiratory_rate, ''],
            ['SpO₂', vital.oxygen_saturation, '%'],
            ['Weight', vital.weight, 'kg'],
            ['Pain', vital.pain_score, '/10'],
            ['Glucose', vital.blood_glucose, 'mmol/L'],
          ].map(([label, value, unit]) => (
            value !== null && value !== undefined && value !== '' && (
              <div key={label} className="flex items-baseline gap-0.5 sm:gap-1">
                <span className="text-[10px] sm:text-xs text-gray-500">{label}:</span>
                <span className="text-[10px] sm:text-xs font-medium text-gray-900 truncate">{value}{unit}</span>
              </div>
            )
          ))}
        </div>
      </div>
      <div className="text-left sm:text-right text-[10px] sm:text-xs text-gray-500 whitespace-nowrap flex-shrink-0">
        <p>{shortDate(vital.recorded_at)}</p>
        {vital.recorded_by_name && <p className="text-gray-400 truncate max-w-[100px] sm:max-w-none">By: {vital.recorded_by_name}</p>}
      </div>
    </div>
  </div>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const PatientJourney = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [journey, setJourney] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [paymentSaving, setPaymentSaving] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [showAllTimeline, setShowAllTimeline] = useState(false);
  const [expandedInvoices, setExpandedInvoices] = useState([]);
  const [expandedVisits, setExpandedVisits] = useState([]);

  // Fetch data
  useEffect(() => {
    let active = true;
    setLoading(true);
    apiRequest(`/api/v1/patients/patients/${patientId}/journey/`)
      .then((data) => { if (active) setJourney(data); })
      .catch((err) => { if (active) setError(err.message || 'Unable to load patient journey.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [patientId]);

  // Memoized calculations
  const patient = journey?.patient || {};
  const invoices = journey?.invoices || [];
  const consultations = journey?.consultations || [];
  const dispenses = journey?.dispenses || [];
  
  const financialSummary = useMemo(() => {
    const totalBilled = invoices.reduce((sum, inv) => sum + Number(inv.total_amount || 0), 0);
    const totalPaid = invoices.reduce((sum, inv) => sum + Number(inv.amount_paid || 0), 0);
    const totalDue = invoices.reduce((sum, inv) => sum + Number(inv.balance_due || 0), 0);
    const totalItems = invoices.reduce((sum, inv) => sum + (inv.items?.length || 0), 0);
    
    return { totalBilled, totalPaid, totalDue, totalItems };
  }, [invoices]);

  const { totalBilled, totalPaid, totalDue, totalItems } = financialSummary;

  // Toggle invoice expansion
  const toggleInvoiceExpand = (invoiceId) => {
    setExpandedInvoices(prev => 
      prev.includes(invoiceId) 
        ? prev.filter(id => id !== invoiceId)
        : [...prev, invoiceId]
    );
  };

  const toggleVisitExpand = (visitId) => {
    setExpandedVisits(prev =>
      prev.includes(visitId)
        ? prev.filter(id => id !== visitId)
        : [...prev, visitId]
    );
  };

  // Build timeline with costs
  const clinicalTimeline = useMemo(() => {
    const events = (journey?.visits || []).flatMap((visit) => {
      const consultation = consultations.find((item) => item.visit === visit.id);
      const vitalRecords = (journey?.vitals || []).filter((item) => item.visit === visit.id);
      const prescriptionRecords = (journey?.prescriptions || []).filter((item) => item.visit === visit.id);
      const dispenseRecords = dispenses.filter(
        (item) => item.prescription && (journey?.prescriptions || []).some(
          (rx) => rx.id === item.prescription && rx.visit === visit.id
        )
      );
      
      const visitInvoices = invoices.filter((inv) => inv.visit === visit.id);
      const visitTotal = visitInvoices.reduce((sum, inv) => sum + Number(inv.total_amount || 0), 0);

      const eventsList = [{
        id: `visit-${visit.id}`,
        visitId: visit.id,
        visitNumber: visit.visit_number || visit.id,
        type: 'visit',
        timestamp: visit.checkin_time || visit.created_at,
        title: `Visit #${visit.visit_number || visit.id}`,
        subtitle: visit.department_name || visit.visit_type || visit.reason || 'Clinical visit',
        detail: `${visit.visit_status || 'Status unavailable'}`,
        actor: null,
        extra: visitTotal > 0 ? `Visit total: ${money(visitTotal)}` : null,
        cost: visitTotal > 0 ? visitTotal : null,
      }];

      if (consultation) {
        eventsList.push({
          id: `consult-${consultation.id}`,
          visitId: visit.id,
          visitNumber: visit.visit_number || visit.id,
          type: 'consultation',
          timestamp: consultation.created_at || consultation.updated_at || visit.checkin_time || visit.created_at,
          title: 'Consultation',
          subtitle: `Dr. ${consultation.doctor_name || 'Not recorded'}`,
          detail: consultation.chief_complaint || consultation.assessment || consultation.plan || 'No summary',
          actor: consultation.doctor_name || null,
          extra: consultation.follow_up_date ? `Follow-up: ${shortDate(consultation.follow_up_date)}` : null,
          cost: consultation.consultation_fee || null,
        });
      }

      vitalRecords.forEach((vital) => {
        const parts = [];
        if (vital.blood_pressure_systolic && vital.blood_pressure_diastolic)
          parts.push(`BP ${vital.blood_pressure_systolic}/${vital.blood_pressure_diastolic}`);
        if (vital.pulse) parts.push(`Pulse ${vital.pulse}`);
        if (vital.temperature) parts.push(`Temp ${vital.temperature}°C`);
        if (vital.weight) parts.push(`Weight ${vital.weight}kg`);
        if (vital.oxygen_saturation) parts.push(`SpO₂ ${vital.oxygen_saturation}%`);
        if (vital.pain_score) parts.push(`Pain ${vital.pain_score}/10`);
        if (vital.blood_glucose) parts.push(`Glucose ${vital.blood_glucose}mmol/L`);

        eventsList.push({
          id: `vital-${vital.id}`,
          visitId: visit.id,
          visitNumber: visit.visit_number || visit.id,
          type: 'vital',
          timestamp: vital.recorded_at || vital.created_at,
          title: 'Vitals Recorded',
          subtitle: parts.join(' · ') || 'No vitals data',
          detail: `Recorded by ${vital.recorded_by_name || 'Unknown'}`,
          actor: vital.recorded_by_name || null,
          extra: null,
          cost: null,
        });
      });

      prescriptionRecords.forEach((rx) => {
        eventsList.push({
          id: `rx-${rx.id}`,
          visitId: visit.id,
          visitNumber: visit.visit_number || visit.id,
          type: 'prescription',
          timestamp: rx.prescribed_date || rx.created_at,
          title: `${rx.drug_name}`,
          subtitle: `${rx.dosage} · ${rx.frequency}`,
          detail: `Prescribed by ${rx.prescribed_by_name || 'Unknown'}`,
          actor: rx.prescribed_by_name || null,
          extra: rx.status ? `Status: ${rx.status}` : null,
          cost: rx.drug_cost || null,
        });
      });

      dispenseRecords.forEach((item) => {
        eventsList.push({
          id: `dispense-${item.id}`,
          visitId: visit.id,
          visitNumber: visit.visit_number || visit.id,
          type: 'dispense',
          timestamp: item.dispensed_date || item.created_at,
          title: `${item.drug_name || 'Medication'} Dispensed`,
          subtitle: `${item.quantity || 1} item(s)`,
          detail: `Dispensed by ${item.dispensed_by_name || item.dispensed_by || 'Unknown'}`,
          actor: item.dispensed_by_name || item.dispensed_by || null,
          extra: item.dispense_cost ? `Dispense cost: ${money(item.dispense_cost)}` : null,
          cost: item.dispense_cost || null,
        });
      });

      return eventsList;
    });

    invoices.forEach((invoice) => {
      events.push({
        id: `invoice-${invoice.id}`,
        visitId: invoice.visit || null,
        visitNumber: invoice.visit ? (journey?.visits || []).find((visit) => visit.id === invoice.visit)?.visit_number || invoice.visit : null,
        type: 'billing',
        timestamp: invoice.invoice_date || invoice.created_at,
        title: `Invoice ${invoice.invoice_number}`,
        subtitle: `${invoice.items?.length || 0} items · ${invoice.status || 'Unknown'}`,
        detail: `Total: ${money(invoice.total_amount)} · Paid: ${money(invoice.amount_paid)} · Balance: ${money(invoice.balance_due)}`,
        actor: null,
        extra: null,
        cost: invoice.total_amount,
        amountPaid: invoice.amount_paid,
        balanceDue: invoice.balance_due,
      });
    });

    return events.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));
  }, [journey, consultations, dispenses, invoices]);

  const visibleTimeline = showAllTimeline ? clinicalTimeline : clinicalTimeline.slice(0, 8);
  const timelineGroups = useMemo(() => {
    const groups = new Map();

    visibleTimeline.forEach((event) => {
      const key = event.visitId || 'unlinked';
      if (!groups.has(key)) {
        groups.set(key, {
          id: key,
          visitNumber: event.visitNumber,
          visitEvent: event.type === 'visit' ? event : null,
          events: [],
          billing: { count: 0, total: 0, paid: 0, due: 0 },
        });
      }
      const group = groups.get(key);
      if (event.type === 'visit') group.visitEvent = event;
      if (event.type === 'billing') {
        group.billing.count += 1;
        group.billing.total += Number(event.cost || 0);
        group.billing.paid += Number(event.amountPaid || 0);
        group.billing.due += Number(event.balanceDue || 0);
      }
      group.events.push(event);
    });

    return Array.from(groups.values());
  }, [visibleTimeline]);

  // Handlers
  const handleRecordPayment = async (event) => {
    event.preventDefault();
    setPaymentSaving(true);
    setPaymentError('');
    try {
      const updatedInvoice = await apiRequest('/api/v1/billing/patient-payments/', {
        method: 'POST',
        body: JSON.stringify({
          invoice: selectedInvoice.id,
          amount: Number(paymentAmount),
          payment_method: paymentMethod,
        }),
      });
      setJourney((current) => ({
        ...current,
        invoices: (current.invoices || []).map((inv) =>
          inv.id === updatedInvoice.id ? updatedInvoice : inv
        ),
      }));
      setSelectedInvoice(updatedInvoice);
      setPaymentAmount('');
    } catch (err) {
      setPaymentError(err.message || 'Unable to record payment.');
    } finally {
      setPaymentSaving(false);
    }
  };

  // Loading & Error States
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 animate-spin text-emerald-600 mx-auto" />
          <p className="mt-3 sm:mt-4 text-gray-500 text-xs sm:text-sm">Loading patient journey...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 flex items-center justify-center">
        <div className="bg-white rounded-xl border border-rose-200 p-6 sm:p-8 max-w-md text-center shadow-lg mx-2">
          <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-rose-600 mx-auto mb-3 sm:mb-4" />
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Unable to load patient data</h3>
          <p className="text-gray-500 text-xs sm:text-sm mb-4 sm:mb-6 break-words">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium text-white transition-colors"
          >
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" /> Go Back
          </button>
        </div>
      </div>
    );
  }

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600 hover:text-emerald-600 transition-colors mb-4 sm:mb-6 group"
        >
          <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Patient List
        </button>

        {/* Patient Header */}
        <header className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6 shadow-sm">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-4 w-full lg:w-auto">
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-md flex-shrink-0">
                <User className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-base sm:text-xl lg:text-2xl font-bold text-gray-900 break-words">
                  {patient.full_name || `${patient.first_name || ''} ${patient.last_name || ''}`.trim()}
                </h1>
                <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-0.5 sm:gap-y-1 mt-0.5">
                  <span className="text-[10px] sm:text-sm text-gray-500">MRN: <span className="font-mono font-medium text-gray-700">{patient.mrn || 'N/A'}</span></span>
                  <span className="text-[10px] sm:text-sm text-gray-500">Hospital No: <span className="font-medium text-gray-700">{patient.hospital_number || 'N/A'}</span></span>
                  {patient.phone && (
                    <span className="text-[10px] sm:text-sm text-gray-500 flex items-center gap-0.5 sm:gap-1">
                      <Phone className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> <span className="truncate max-w-[80px] sm:max-w-none">{patient.phone}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-start lg:items-end gap-0.5 w-full lg:w-auto border-t lg:border-t-0 pt-3 lg:pt-0">
              <p className="text-[10px] sm:text-xs uppercase tracking-wider text-gray-500 font-medium">Outstanding Balance</p>
              <p className={`text-lg sm:text-2xl lg:text-3xl font-bold ${totalDue > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                {money(totalDue)}
              </p>
              {totalDue > 0 && (
                <p className="text-[10px] sm:text-xs text-rose-500">Please settle outstanding balance</p>
              )}
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 mb-4 sm:mb-6">
          <StatCard icon={MapPin} label="Visits" value={journey?.visits?.length} />
          <StatCard icon={Stethoscope} label="Consultations" value={consultations.length} />
          <StatCard icon={Pill} label="Prescriptions" value={journey?.prescriptions?.length} color="amber" />
          <StatCard icon={Activity} label="Vitals" value={journey?.vitals?.length} color="teal" />
          <StatCard icon={Receipt} label="Invoices" value={invoices.length} color="blue" subtitle={`${totalItems} items`} />
        </div>

        {/* Financial Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2">
              <div className="p-1.5 sm:p-2 bg-indigo-50 rounded-lg">
                <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-600" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider">Total Billed</p>
                <p className="text-base sm:text-xl font-bold text-gray-900">{money(totalBilled)}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2">
              <div className="p-1.5 sm:p-2 bg-emerald-50 rounded-lg">
                <CreditCard className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider">Total Paid</p>
                <p className="text-base sm:text-xl font-bold text-emerald-600">{money(totalPaid)}</p>
              </div>
            </div>
          </div>
          <div className={`bg-white rounded-xl border ${totalDue > 0 ? 'border-rose-200' : 'border-emerald-200'} p-3 sm:p-4 hover:shadow-md transition-shadow`}>
            <div className="flex items-center gap-2">
              <div className={`p-1.5 sm:p-2 ${totalDue > 0 ? 'bg-rose-50' : 'bg-emerald-50'} rounded-lg`}>
                <Wallet className={`w-3 h-3 sm:w-4 sm:h-4 ${totalDue > 0 ? 'text-rose-600' : 'text-emerald-600'}`} />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider">Outstanding</p>
                <p className={`text-base sm:text-xl font-bold ${totalDue > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {money(totalDue)}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2">
              <div className="p-1.5 sm:p-2 bg-blue-50 rounded-lg">
                <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wider">Total Items</p>
                <p className="text-base sm:text-xl font-bold text-gray-900">{totalItems}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Section */}
        <section className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 flex-shrink-0" />
              <h2 className="text-sm sm:text-lg font-semibold text-gray-900">Clinical Timeline</h2>
              <span className="text-[10px] sm:text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full flex-shrink-0">
                {clinicalTimeline.length} events
              </span>
            </div>
            {clinicalTimeline.length > 8 && (
              <button
                onClick={() => setShowAllTimeline(!showAllTimeline)}
                className="inline-flex items-center gap-1 text-[10px] sm:text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors flex-shrink-0"
              >
                {showAllTimeline ? (
                  <>Show Less <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4" /></>
                ) : (
                  <>View All <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" /></>
                )}
              </button>
            )}
          </div>

          {clinicalTimeline.length ? (
            <div className="space-y-4">
              {timelineGroups.map((group) => (
                <div key={group.id} className="rounded-lg border border-gray-200 bg-gray-50/70 p-3 sm:p-4">
                  <button
                    type="button"
                    onClick={() => toggleVisitExpand(group.id)}
                    className="w-full flex flex-wrap items-center justify-between gap-2 text-left"
                    aria-expanded={expandedVisits.includes(group.id)}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      <h3 className="text-xs sm:text-sm font-semibold text-gray-900">
                        {group.visitNumber ? `Visit #${group.visitNumber}` : 'Other records'}
                      </h3>
                      {group.visitEvent?.subtitle && (
                        <span className="text-[10px] sm:text-xs text-gray-500 truncate">{group.visitEvent.subtitle}</span>
                      )}
                    </div>
                    {group.visitEvent?.timestamp && (
                      <span className="text-[10px] sm:text-xs text-gray-500 whitespace-nowrap">
                        {shortDate(group.visitEvent.timestamp)}
                      </span>
                    )}
                    {group.billing.count > 0 && (
                      <span className="text-[10px] sm:text-xs text-gray-600 whitespace-nowrap">
                        {group.billing.count} bill{group.billing.count === 1 ? '' : 's'} · {money(group.billing.total)} · Due {money(group.billing.due)}
                      </span>
                    )}
                    {expandedVisits.includes(group.id) ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                  </button>
                  {expandedVisits.includes(group.id) && (
                    <div className="relative pl-1 sm:pl-2 mt-3">
                      {group.events.map((event) => (
                        <TimelineEvent key={event.id} event={event} />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 sm:py-8">
              <Clock className="w-8 h-8 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-2 sm:mb-3" />
              <p className="text-xs sm:text-sm text-gray-500">No clinical events recorded for this patient.</p>
            </div>
          )}
        </section>

        {/* Vitals & Prescriptions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
          {/* Vitals */}
          <section className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6 shadow-sm">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
              <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 flex-shrink-0" />
              <h2 className="text-sm sm:text-lg font-semibold text-gray-900">Vital Signs</h2>
              <span className="text-[10px] sm:text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full flex-shrink-0">
                {journey?.vitals?.length || 0}
              </span>
            </div>
            <div className="space-y-2 sm:space-y-3 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
              {(journey?.vitals || []).length ? (
                (journey?.vitals || []).map((vital) => (
                  <VitalCard key={vital.id} vital={vital} />
                ))
              ) : (
                <div className="text-center py-6 sm:py-8 bg-gray-50 rounded-xl">
                  <Activity className="w-8 h-8 sm:w-10 sm:h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-xs sm:text-sm text-gray-500">No vital records available</p>
                </div>
              )}
            </div>
          </section>

          {/* Prescriptions */}
          <section className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6 shadow-sm">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
              <Pill className="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 flex-shrink-0" />
              <h2 className="text-sm sm:text-lg font-semibold text-gray-900">Prescriptions</h2>
              <span className="text-[10px] sm:text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full flex-shrink-0">
                {journey?.prescriptions?.length || 0}
              </span>
            </div>
            <div className="space-y-2 sm:space-y-3 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
              {(journey?.prescriptions || []).length ? (
                (journey?.prescriptions || []).map((rx) => (
                  <PrescriptionCard key={rx.id} rx={rx} />
                ))
              ) : (
                <div className="text-center py-6 sm:py-8 bg-gray-50 rounded-xl">
                  <Pill className="w-8 h-8 sm:w-10 sm:h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-xs sm:text-sm text-gray-500">No prescriptions available</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Invoices with Expandable Items */}
        <section className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Receipt className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
              <h2 className="text-sm sm:text-lg font-semibold text-gray-900">Patient Bills</h2>
              <span className="text-[10px] sm:text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full flex-shrink-0">
                {invoices.length} invoices
              </span>
            </div>
            {invoices.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="text-[10px] sm:text-xs text-gray-500">
                  Total Items: <span className="font-medium text-gray-700">{totalItems}</span>
                </span>
                <span className={`text-[10px] sm:text-sm font-medium ${totalDue > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  Total Due: {money(totalDue)}
                </span>
              </div>
            )}
          </div>

          {invoices.length ? (
            <div className="space-y-2 sm:space-y-3">
              {invoices.map((invoice) => (
                <InvoiceCard
                  key={invoice.id}
                  invoice={invoice}
                  onView={setSelectedInvoice}
                  expandedInvoices={expandedInvoices}
                  toggleInvoiceExpand={toggleInvoiceExpand}
                  visitLabel={invoice.visit ? `Visit #${journey?.visits?.find((visit) => visit.id === invoice.visit)?.visit_number || invoice.visit}` : null}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-6 sm:py-8 bg-gray-50 rounded-xl">
              <Receipt className="w-8 h-8 sm:w-10 sm:h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-xs sm:text-sm text-gray-500">No invoices recorded for this patient.</p>
            </div>
          )}
        </section>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        invoice={selectedInvoice}
        onClose={() => {
          setSelectedInvoice(null);
          setPaymentError('');
          setPaymentAmount('');
        }}
        onPaymentSubmit={handleRecordPayment}
        paymentAmount={paymentAmount}
        setPaymentAmount={setPaymentAmount}
        paymentMethod={paymentMethod}
        setPaymentMethod={setPaymentMethod}
        paymentSaving={paymentSaving}
        paymentError={paymentError}
      />

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
        @media (min-width: 640px) {
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
        }
      `}</style>
    </div>
  );
};

export default PatientJourney;