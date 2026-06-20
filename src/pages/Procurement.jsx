import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { ShoppingCart, Plus, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';
import GenericModal from '../components/GenericModal';
import { createRFQ, createPurchaseOrder, createGRN } from '../features/procurementSlice';

const Procurement = () => {
  // Add safe defaults for Redux state
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

  // Safe calculations with null checks
  const approvedPOs = purchaseOrders.filter(po => po && po.status === 'Approved').length;
  const pendingGRNs = purchaseOrders.filter(po => {
    if (!po || !po.poId) return false;
    return !goodsReceivedNotes.find(g => g && g.poId === po.poId);
  }).length;
  
  const totalProcured = purchaseOrders.reduce((sum, po) => {
    if (!po || !po.totalValue) return sum;
    return sum + po.totalValue;
  }, 0);

  const handleCreateRFQ = () => {
    // Implement RFQ creation logic here
    console.log('Creating new RFQ');
    setShowModal(false);
  };

  return (
    <div className="procurement p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <ShoppingCart className="w-8 h-8 mr-3 text-indigo-600" />
            Procurement Management
          </h1>
          <p className="text-gray-600 mt-2">Vendor management, RFQ, purchase orders, GRN & payment authorization</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium inline-flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          New RFQ
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-indigo-600">
          <div className="flex items-center">
            <ShoppingCart className="w-8 h-8 text-indigo-600 mr-3" />
            <div>
              <p className="text-gray-600 text-sm">Total Vendors</p>
              <p className="text-indigo-600 font-bold text-2xl">{vendors.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-600">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-gray-600 text-sm">Approved POs</p>
              <p className="text-green-600 font-bold text-2xl">{approvedPOs}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-600">
          <div className="flex items-center">
            <AlertCircle className="w-8 h-8 text-orange-600 mr-3" />
            <div>
              <p className="text-gray-600 text-sm">Pending GRN</p>
              <p className="text-orange-600 font-bold text-2xl">{pendingGRNs}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-600">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <p className="text-gray-600 text-sm">RFQs Created</p>
              <p className="text-purple-600 font-bold text-2xl">{rfqs.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-600">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-gray-600 text-sm">Total Procured</p>
              <p className="text-blue-600 font-bold">₦{(totalProcured / 1000000).toFixed(1)}M</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-gray-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('vendors')}
          className={`px-4 py-3 font-medium transition-colors whitespace-nowrap ${
            activeTab === 'vendors'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Vendors ({vendors.length})
        </button>
        <button
          onClick={() => setActiveTab('rfq')}
          className={`px-4 py-3 font-medium transition-colors whitespace-nowrap ${
            activeTab === 'rfq'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          RFQs ({rfqs.length})
        </button>
        <button
          onClick={() => setActiveTab('po')}
          className={`px-4 py-3 font-medium transition-colors whitespace-nowrap ${
            activeTab === 'po'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Purchase Orders ({purchaseOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('grn')}
          className={`px-4 py-3 font-medium transition-colors whitespace-nowrap ${
            activeTab === 'grn'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          GRN ({goodsReceivedNotes.length})
        </button>
        <button
          onClick={() => setActiveTab('matching')}
          className={`px-4 py-3 font-medium transition-colors whitespace-nowrap ${
            activeTab === 'matching'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Invoice Matching ({invoiceMatching.length})
        </button>
        <button
          onClick={() => setActiveTab('payment')}
          className={`px-4 py-3 font-medium transition-colors whitespace-nowrap ${
            activeTab === 'payment'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Payments ({paymentAuthorizations.length})
        </button>
      </div>

      {/* Vendors Tab */}
      {activeTab === 'vendors' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {vendors.length === 0 ? (
            <div className="col-span-2 bg-white rounded-xl shadow-md p-12 text-center">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No vendors found</p>
            </div>
          ) : (
            vendors.map(vendor => (
              <div key={vendor.vendorId} className="bg-white rounded-xl shadow-md p-6 border-l-4 border-indigo-600">
                <h3 className="font-bold text-lg mb-2">{vendor.name || 'Unknown Vendor'}</h3>
                
                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-blue-50 p-2 rounded">
                      <p className="text-gray-600 text-xs">Rating</p>
                      <p className="font-bold text-yellow-600">★ {(vendor.rating || 0).toFixed(1)}</p>
                    </div>
                    <div className="bg-green-50 p-2 rounded">
                      <p className="text-gray-600 text-xs">Lead Time</p>
                      <p className="font-bold">{vendor.leadTime || 0} days</p>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-3 rounded">
                    <p className="text-gray-600 text-xs">Contact</p>
                    <p className="font-bold text-sm">{vendor.email || 'No email'}</p>
                    <p className="font-bold text-sm">{vendor.phone || 'No phone'}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-gray-600 text-xs">Min Order Value</p>
                      <p className="font-bold">₦{(vendor.minOrderValue || 0).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-xs">Years in Business</p>
                      <p className="font-bold">{vendor.yearsInBusiness || 0}</p>
                    </div>
                  </div>

                  {vendor.certificationsHeld && vendor.certificationsHeld.length > 0 && (
                    <div className="bg-purple-50 p-2 rounded">
                      <p className="text-gray-600 text-xs">Certifications</p>
                      <div className="flex gap-1 flex-wrap mt-1">
                        {vendor.certificationsHeld.map((cert, idx) => (
                          <span key={idx} className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded">
                            {cert}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <p className="text-gray-600 text-xs">Total Order Value</p>
                    <p className="font-bold text-lg">₦{(vendor.totalOrderValue || 0).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* RFQ Tab */}
      {activeTab === 'rfq' && (
        <div className="space-y-4">
          {rfqs.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No RFQs found</p>
            </div>
          ) : (
            rfqs.map(rfq => (
              <div key={rfq.rfqId} className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-600">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">RFQ ID</p>
                    <p className="font-bold">{rfq.rfqId || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Created Date</p>
                    <p className="font-bold text-sm">
                      {rfq.createdDate ? new Date(rfq.createdDate).toLocaleDateString('en-NG') : 'Date not available'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Estimated Value</p>
                    <p className="font-bold">₦{(rfq.totalEstimatedValue || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                      rfq.status === 'Quotes Received' ? 'bg-green-200 text-green-800' : 'bg-orange-200 text-orange-800'
                    }`}>
                      {rfq.status || 'Unknown'}
                    </p>
                  </div>
                </div>

                <div className="mb-3 p-3 bg-gray-50 rounded">
                  <p className="text-sm font-semibold text-gray-700">
                    Items: {(rfq.items || []).map(i => i?.description || 'Unknown').join(', ') || 'No items'}
                  </p>
                </div>

                {rfq.quotes && rfq.quotes.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-gray-700">Quotes Received:</p>
                    {rfq.quotes.map((quote, idx) => {
                      if (!quote) return null;
                      const vendor = vendors.find(v => v.vendorId === quote.vendorId);
                      return (
                        <div key={idx} className="flex justify-between items-center p-2 bg-blue-50 rounded text-sm">
                          <span>{(vendor?.name || 'Unknown Vendor')} - ₦{(quote.quotedPrice || 0).toLocaleString()}</span>
                          <span className="text-gray-600">
                            {quote.discount || 0}% discount, {quote.deliveryTime || 0} days
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Purchase Orders Tab */}
      {activeTab === 'po' && (
        <div className="space-y-4">
          {purchaseOrders.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No purchase orders found</p>
            </div>
          ) : (
            purchaseOrders.map(po => (
              <div key={po.poId} className={`rounded-xl shadow-md p-6 ${
                po.status === 'Approved' ? 'bg-green-50 border-l-4 border-green-600' :
                po.status === 'Pending Approval' ? 'bg-orange-50 border-l-4 border-orange-600' :
                'bg-red-50 border-l-4 border-red-600'
              }`}>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">PO ID</p>
                    <p className="font-bold">{po.poId || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Vendor</p>
                    <p className="font-bold text-sm">{po.vendorName || 'Unknown Vendor'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Value</p>
                    <p className="font-bold">₦{(po.totalValue || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Expected Delivery</p>
                    <p className="font-bold text-sm">
                      {po.expectedDelivery ? new Date(po.expectedDelivery).toLocaleDateString('en-NG') : 'Not set'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                      po.status === 'Approved' ? 'bg-green-200 text-green-800' :
                      po.status === 'Pending Approval' ? 'bg-orange-200 text-orange-800' :
                      'bg-red-200 text-red-800'
                    }`}>
                      {po.status || 'Unknown'}
                    </p>
                  </div>
                </div>

                <div className="mb-3 p-3 bg-white bg-opacity-50 rounded">
                  <p className="text-sm">
                    <span className="text-gray-600">Payment Terms: </span>
                    <span className="font-bold">{po.paymentTerms || 'Not specified'}</span>
                  </p>
                </div>

                {po.status === 'Pending Approval' && (
                  <div className="flex gap-2">
                    <button className="flex-1 bg-green-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-green-700">
                      Approve
                    </button>
                    <button className="flex-1 bg-red-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-red-700">
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* GRN Tab */}
      {activeTab === 'grn' && (
        <div className="space-y-4">
          {goodsReceivedNotes.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No goods received notes found</p>
            </div>
          ) : (
            goodsReceivedNotes.map(grn => (
              <div key={grn.grnId} className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-600">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">GRN ID</p>
                    <p className="font-bold">{grn.grnId || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">PO ID</p>
                    <p className="font-bold text-sm">{grn.poId || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">GRN Date</p>
                    <p className="font-bold text-sm">
                      {grn.grnDate ? new Date(grn.grnDate).toLocaleDateString('en-NG') : 'Date not available'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Received By</p>
                    <p className="font-bold text-sm">{grn.receivedBy || 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className="inline-block px-2 py-1 rounded text-xs font-semibold bg-green-200 text-green-800">
                      {grn.status || 'Unknown'}
                    </p>
                  </div>
                </div>

                <div className="mb-3 p-3 bg-blue-50 rounded">
                  <p className="text-sm">
                    <span className="text-gray-600">Inspection: </span>
                    <span className="font-bold text-green-600">✓ {grn.inspectionStatus || 'Not inspected'}</span>
                  </p>
                  <p className="text-sm">
                    <span className="text-gray-600">Inspected By: </span>
                    <span className="font-bold">{grn.inspectedBy || 'Unknown'}</span>
                  </p>
                </div>

                {grn.damageReports && (
                  <p className="text-sm text-red-600 font-semibold">⚠ Damage Reports: {grn.damageReports}</p>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Invoice Matching Tab */}
      {activeTab === 'matching' && (
        <div className="space-y-4">
          {invoiceMatching.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No invoice matching records found</p>
            </div>
          ) : (
            invoiceMatching.map(match => (
              <div key={match.matchingId} className={`rounded-xl shadow-md p-6 ${
                match.status === '3-Way Match Passed' ? 'bg-green-50 border-l-4 border-green-600' : 'bg-yellow-50 border-l-4 border-yellow-600'
              }`}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Match ID</p>
                    <p className="font-bold">{match.matchingId || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">PO - GRN - Invoice</p>
                    <p className="font-bold text-sm">
                      {match.poId || 'N/A'} ✓ {match.grnId || 'N/A'} ✓ {match.invoiceId || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Amount</p>
                    <p className="font-bold">₦{(match.amount || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                      match.status === '3-Way Match Passed' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
                    }`}>
                      {match.status || 'Unknown'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-sm mb-3">
                  <div className="bg-white p-2 rounded">
                    <p className="text-gray-600 text-xs">Qty Match</p>
                    <p className={`font-bold ${match.quantityMatch ? 'text-green-600' : 'text-red-600'}`}>
                      {match.quantityMatch ? '✓ Match' : '✗ Variance'}
                    </p>
                  </div>
                  <div className="bg-white p-2 rounded">
                    <p className="text-gray-600 text-xs">Amount Match</p>
                    <p className={`font-bold ${match.amountMatch ? 'text-green-600' : 'text-red-600'}`}>
                      {match.amountMatch ? '✓ Match' : '✗ Variance'}
                    </p>
                  </div>
                  <div className="bg-white p-2 rounded">
                    <p className="text-gray-600 text-xs">Overall</p>
                    <p className="font-bold text-green-600">✓ Passed</p>
                  </div>
                </div>

                {match.discrepancies && (
                  <p className="text-sm text-orange-600">⚠ Discrepancies: {match.discrepancies}</p>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Payment Tab */}
      {activeTab === 'payment' && (
        <div className="space-y-4">
          {paymentAuthorizations.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No payment authorizations found</p>
            </div>
          ) : (
            paymentAuthorizations.map(payment => (
              <div key={payment.paymentId} className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-600">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Payment ID</p>
                    <p className="font-bold">{payment.paymentId || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">PO ID</p>
                    <p className="font-bold text-sm">{payment.poId || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Amount</p>
                    <p className="font-bold">₦{(payment.authorizedAmount || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Due Date</p>
                    <p className="font-bold text-sm">
                      {payment.dueDate ? new Date(payment.dueDate).toLocaleDateString('en-NG') : 'Not set'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <p className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                      payment.paymentStatus === 'Completed' ? 'bg-green-200 text-green-800' :
                      payment.paymentStatus === 'Pending' ? 'bg-orange-200 text-orange-800' :
                      'bg-blue-200 text-blue-800'
                    }`}>
                      {payment.paymentStatus || 'Unknown'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                  <div className="bg-blue-50 p-3 rounded">
                    <p className="text-gray-600 text-xs">Authorized By</p>
                    <p className="font-bold">{payment.authorizedBy || 'Unknown'}</p>
                    <p className="text-gray-600 text-xs">
                      {payment.authorizationDate ? new Date(payment.authorizationDate).toLocaleDateString('en-NG') : 'Date not available'}
                    </p>
                  </div>
                  <div className="bg-purple-50 p-3 rounded">
                    <p className="text-gray-600 text-xs">Payment Method</p>
                    <p className="font-bold">{payment.paymentMethod || 'Not specified'}</p>
                    <p className="text-gray-600 text-xs">{payment.bankDetails || 'Not specified'}</p>
                  </div>
                </div>

                {payment.paymentStatus === 'Pending' && (
                  <button className="w-full bg-green-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-green-700">
                    Execute Payment
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal */}
      <GenericModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Create New RFQ"
        size="lg"
      >
        <div className="space-y-4">
          <input type="text" placeholder="Item Description" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          <input type="number" placeholder="Estimated Quantity" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          <input type="number" placeholder="Estimated Unit Cost" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          <select className="w-full px-4 py-2 border border-gray-300 rounded-lg">
            <option value="">Select Vendors to Quote</option>
            {vendors.map(vendor => (
              <option key={vendor.vendorId} value={vendor.vendorId}>
                {vendor.name || vendor.vendorId}
              </option>
            ))}
          </select>
          <input type="date" placeholder="RFQ Deadline" className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          <div className="flex gap-2">
            <button onClick={handleCreateRFQ} className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
              Create RFQ
            </button>
            <button onClick={() => setShowModal(false)} className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg">
              Cancel
            </button>
          </div>
        </div>
      </GenericModal>
    </div>
  );
};

export default Procurement;