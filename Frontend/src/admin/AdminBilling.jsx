import React, { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { getAuthHeaders } from '../utils/auth';
import { ArrowLeft, Printer, Download, Edit, FileText } from 'lucide-react';


export default function AdminBilling({ patients = [], hash }) {
  const API = 'http://localhost:8080';

  // Parse bill ID if in detail view
  const isDetailView = hash && hash.startsWith('/admin/billing/details/');
  const billId = isDetailView ? hash.substring('/admin/billing/details/'.length) : null;

  const [detailBill, setDetailBill] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);

  useEffect(() => {
    setIsDownloaded(false);
    if (!billId) {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
        setPdfUrl(null);
      }
      setDetailBill(null);
      return;
    }

    const loadDetails = async () => {
      setLoadingDetail(true);
      try {
        const detailsRes = await fetch(`${API}/bills/${billId}`, {
          headers: getAuthHeaders()
        });
        if (detailsRes.ok) {
          const data = await detailsRes.json();
          setDetailBill(data);
        }

        const pdfRes = await fetch(`${API}/bills/${billId}/pdf`, {
          headers: getAuthHeaders()
        });
        if (pdfRes.ok) {
          const blob = await pdfRes.blob();
          const blobUrl = URL.createObjectURL(blob);
          setPdfUrl(blobUrl);
        }
      } catch (e) {
        toast.error(String('Failed to load bill details/pdf'));
      } finally {
        setLoadingDetail(false);
      }
    };

    loadDetails();
  }, [billId]);

  const handleDownloadPdf = () => {
    if (pdfUrl && detailBill) {
      const a = document.createElement('a');
      a.href = pdfUrl;
      const year = detailBill.billDate ? detailBill.billDate.split('-')[0] : new Date().getFullYear();
      const formattedInvoiceNo = 'INV-' + year + '-' + String(detailBill.id).padStart(5, '0');
      a.download = `Invoice_${formattedInvoiceNo}.pdf`;
      a.click();
      setIsDownloaded(true);
    }
  };

  // Form state
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [selectedAppointmentId, setSelectedAppointmentId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [billNo, setBillNo] = useState('B-' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0'));
  const [billItems, setBillItems] = useState([{ itemName: '', quantity: 1, unitPrice: 0 }]);
  // Patient search and options
  const [patientSearch, setPatientSearch] = useState('');
  const [patientOptions, setPatientOptions] = useState(patients);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Sync patient options initially/when prop changes
  useEffect(() => {
    setPatientOptions(patients);
  }, [patients]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Appointments state
  const [appointments, setAppointments] = useState([]);

  // Filter appointments for selected patient
  const filteredAppointments = selectedPatientId
    ? appointments.filter(a => String(a.patient?.id) === String(selectedPatientId))
    : appointments;

  // Auto-select appointment if there's only one for the selected patient
  useEffect(() => {
    if (selectedPatientId && filteredAppointments.length === 1) {
      setSelectedAppointmentId(filteredAppointments[0].id);
    } else if (!selectedPatientId) {
      setSelectedAppointmentId('');
    }
  }, [selectedPatientId, filteredAppointments]);

  // Bills list and filter
  const [bills, setBills] = useState([]);
  const [filterPatientId, setFilterPatientId] = useState('');
  const [loadingBills, setLoadingBills] = useState(false);
  const [saving, setSaving] = useState(false);

  // Calculate total
  const totalAmount = billItems.reduce(
    (sum, it) => sum + Number(it.quantity || 0) * Number(it.unitPrice || 0),
    0
  );

  // Load appointments
  useEffect(() => {
    fetch(`${API}/appointments`, { headers: { ...getAuthHeaders() } })
      .then(res => res.json())
      .then(data => setAppointments(Array.isArray(data) ? data : []))
      .catch(console.error);
  }, []);


  // Search patients by name (API integration)
  useEffect(() => {
    if (!patientSearch.trim()) {
      setPatientOptions(patients);
      return;
    }

    const handler = setTimeout(() => {
      const fetchPatients = async () => {
        const url = `${API}/patients/search/name?name=${encodeURIComponent(patientSearch)}`;
        try {
          const res = await fetch(url, { headers: { ...getAuthHeaders() } });
          if (res.ok) {
            const data = await res.json();
            setPatientOptions(Array.isArray(data) ? data : []);
          }
        } catch (e) {
          toast.error(String(e));
        }
      };
      fetchPatients();
    }, 300);
    return () => clearTimeout(handler);
  }, [patientSearch, patients]);


  // Load bills
  const fetchBills = async (patientId = '') => {
    // Sync patientOptions when prop changes

    setLoadingBills(true);
    try {
      const url = patientId ? `${API}/bills/patient/${patientId}` : `${API}/bills`;
      const res = await fetch(url, { headers: { ...getAuthHeaders() } });
      console.log('FETCH BILLS STATUS:', res.status);
      if (res.ok) {
        const text = await res.text();
        console.log("RAW BILL RESPONSE:");
        console.log(text);
        const data = JSON.parse(text);
        setBills(Array.isArray(data) ? data : []);
      } else {
        const text = await res.text();
        toast.error(String('Failed to load bills:'));
      }
    } catch (e) {
      toast.error(String('Failed to load bills'));
    } finally {
      setLoadingBills(false);
    }
  };

  useEffect(() => { fetchBills(); }, []);

  // Item handlers
  const handleAddItem = () => setBillItems([...billItems, { itemName: '', quantity: 1, unitPrice: 0 }]);
  const handleRemoveItem = idx => setBillItems(billItems.filter((_, i) => i !== idx));
  const handleItemChange = (idx, field, value) => {
    const upd = [...billItems];
    upd[idx][field] = value;
    setBillItems(upd);
  };

  // Save bill
  const handleSave = async () => {
// <<<<<<< Updated upstream
//     if (!selectedPatientId) { toast.error('Please select a patient'); return; }
//     if (!selectedAppointmentId) { toast.error('Please select an appointment'); return; }
//     if (billItems.some(it => !it.itemName)) { toast.error('Please fill in all item names'); return; }
// =======
if (!selectedPatientId) {
    toast.error('Please select a patient');
    return;
}

if (billItems.some(it => !it.itemName)) {
    toast.error('Please fill in all item names');
    return;
}
    if (!selectedPatientId) { alert('Please select a patient'); return; }
    //if (!selectedAppointmentId) { alert('Please select an appointment'); return; }
    if (billItems.some(it => !it.itemName)) { alert('Please fill in all item names'); return; }
//>>>>>>> Stashed changes

    const payload = {
    patientId: Number(selectedPatientId),
    appointmentId: selectedAppointmentId
        ? Number(selectedAppointmentId)
        : null,
    items: billItems.map(item => ({
        itemName: item.itemName,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice)
    }))
};

    setSaving(true);
    try {
      const res = await fetch(`${API}/bills`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify(payload)
      });
      const text = await res.text();
      console.log('BILL CREATE STATUS:', res.status, 'RESPONSE:', text);
      if (res.ok) {
        toast.success('Invoice created successfully!');
        // Refetch the bills list to show the new entry
        await fetchBills(filterPatientId);
        setSelectedPatientId('');
        setPatientSearch('');
        setSelectedAppointmentId('');
        setBillItems([{ itemName: '', quantity: 1, unitPrice: 0 }]);
        setBillNo('B-' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0'));
        setDate(new Date().toISOString().split('T')[0]);
      } else {
        toast.error('Failed to create invoice: ' + text);
      }
    } catch (e) {
      toast.error(String(e));
      toast.error('Network error: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  // Update payment status
  const handlePaymentUpdate = async (billId, status) => {
    try {
      const res = await fetch(`${API}/bills/${billId}/payment`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
        body: JSON.stringify({ paymentStatus: status })
      });
      if (res.ok) fetchBills(filterPatientId);
    } catch (e) { toast.error(String(e)); }
  };

  // Download PDF
  const handleDownload = async (billId) => {
    try {
      const res = await fetch(`${API}/bills/${billId}/pdf`, {
        headers: { ...getAuthHeaders() }
      });
      if (!res.ok) throw new Error('Download Failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice_${billId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      toast.error(String(e));
      toast.error('Failed to download invoice');
    }
  };

  const getStatusStyle = (status) => {
    if (status === 'PAID') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (status === 'UNPAID') return 'bg-rose-50 text-rose-700 border-rose-200';
    return 'bg-amber-50 text-amber-700 border-amber-200';
  };

  if (isDetailView) {
    if (loadingDetail) {
      return (
        <div className="p-6 md:p-8 font-sans text-gray-800 text-left bg-gray-50/30 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <span className="text-4xl animate-spin inline-block">⏳</span>
            <p className="mt-2 text-sm font-semibold text-gray-500">Loading invoice details...</p>
          </div>
        </div>
      );
    }

    if (!detailBill) {
      return (
        <div className="p-6 md:p-8 font-sans text-gray-800 text-left bg-gray-50/30 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <span className="text-4xl text-rose-500">⚠️</span>
            <p className="mt-2 text-sm font-semibold text-gray-500">Invoice not found.</p>
            <button onClick={() => window.location.hash = '/admin/billing'} className="mt-4 px-4 py-2 bg-[#0B2C56] text-white rounded-lg text-xs font-bold shadow-xs">
              Back to Bills
            </button>
          </div>
        </div>
      );
    }

    const year = detailBill.billDate ? detailBill.billDate.split('-')[0] : new Date().getFullYear();
    const formattedInvoiceNo = 'INV-' + year + '-' + String(detailBill.id).padStart(5, '0');
    const formattedDate = detailBill.billDate ? new Date(detailBill.billDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A';
    const formattedPatientId = detailBill.patient?.id ? 'PT-' + year + '-' + String(detailBill.patient.id).padStart(5, '0') : 'N/A';
    const doctorName = detailBill.appointment?.doctor?.user?.name ? `Dr. ${detailBill.appointment.doctor.user.name}` : 'N/A';

    const handlePrintPdf = () => {
      const iframe = document.getElementById('pdf-preview-iframe');
      if (iframe) {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
      } else {
        window.print();
      }
    };

    const handleEditBill = () => {
      setSelectedPatientId(detailBill.patient?.id || '');
      setPatientSearch(detailBill.patient?.fullName || '');
      setSelectedAppointmentId(detailBill.appointment?.id || '');
      if (detailBill.items) {
        setBillItems(detailBill.items.map(it => ({
          itemName: it.itemName,
          quantity: it.quantity,
          unitPrice: it.unitPrice
        })));
      }
      window.location.hash = '/admin/billing';
    };

    const getPaymentBadge = (status) => {
      const normStatus = (status || '').toUpperCase();
      if (normStatus === 'PAID') {
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Paid
          </span>
        );
      }
      if (normStatus === 'UNPAID' || normStatus === 'FAILED') {
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            Failed
          </span>
        );
      }
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
          Pending
        </span>
      );
    };

    const TimelineItem = ({ title, date, active, completed, isLast }) => {
      return (
        <div className="flex gap-4 relative">
          {!isLast && (
            <div className={`absolute left-[15px] top-[30px] bottom-0 w-[2px] ${completed ? 'bg-emerald-500' : 'bg-gray-200'}`} />
          )}
          <div className="flex flex-col items-center z-10">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
              completed 
                ? 'bg-emerald-500 border-emerald-500 text-white' 
                : active 
                  ? 'bg-amber-50 border-amber-500 text-amber-500 animate-pulse' 
                  : 'bg-gray-50 border-gray-200 text-gray-400'
            }`}>
              {completed ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <div className={`w-2 h-2 rounded-full ${active ? 'bg-amber-500' : 'bg-gray-300'}`} />
              )}
            </div>
          </div>
          <div className="pb-6">
            <h4 className={`text-xs font-extrabold ${completed || active ? 'text-gray-800' : 'text-gray-400'}`}>
              {title}
            </h4>
            {date && (
              <p className="text-[10px] text-gray-400 font-semibold mt-0.5">{date}</p>
            )}
          </div>
        </div>
      );
    };

    return (
      <div className="p-6 md:p-8 space-y-6 font-sans text-gray-800 text-left bg-gray-50/30 min-h-screen">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center border-b border-gray-200 pb-5 gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#0B2C56] flex items-center gap-2">
              Invoice Details
            </h1>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-gray-500 text-xs mt-1 font-semibold">
              <span className="text-[#0b2c56] bg-blue-50 px-2 py-0.5 rounded text-[11px] font-bold">
                {formattedInvoiceNo}
              </span>
              <span className="text-gray-300">|</span>
              <span>Created: {formattedDate}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => window.location.hash = '/admin/billing'}
              className="px-4 py-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-lg shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer min-w-[90px]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <button
              onClick={handlePrintPdf}
              className="px-4 py-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-lg shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer min-w-[90px]"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
            <button
              onClick={handleDownloadPdf}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer min-w-[90px]"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
            <button
              onClick={handleEditBill}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer min-w-[90px]"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit</span>
            </button>
          </div>
        </div>

        {/* 12-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - 3 cols span */}
          <div className="lg:col-span-3 space-y-6">
            {/* Merged Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-150 shadow-sm space-y-4">
              <h2 className="text-[#0B2C56] font-extrabold text-sm border-b pb-2 mb-2">Invoice Information</h2>
              
              <div className="space-y-3.5 text-xs text-left">
                <div className="flex justify-between items-center py-1">
                  <span className="font-bold text-gray-400 uppercase tracking-wider text-[10px]">Invoice No</span>
                  <span className="font-extrabold text-gray-800">{formattedInvoiceNo}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="font-bold text-gray-400 uppercase tracking-wider text-[10px]">Patient</span>
                  <span className="font-bold text-gray-700">{detailBill.patient?.fullName || 'N/A'}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="font-bold text-gray-400 uppercase tracking-wider text-[10px]">Doctor</span>
                  <span className="font-bold text-gray-700">{doctorName}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="font-bold text-gray-400 uppercase tracking-wider text-[10px]">Date</span>
                  <span className="font-bold text-gray-700">{formattedDate}</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="font-bold text-gray-400 uppercase tracking-wider text-[10px]">Payment</span>
                  {getPaymentBadge(detailBill.paymentStatus)}
                </div>
              </div>

              <div className="border-t border-gray-100 my-4 pt-4 space-y-2.5 text-xs">
                <div className="flex justify-between text-gray-500 font-semibold">
                  <span>Subtotal</span>
                  <span className="text-gray-800 font-bold">₹ {Number(detailBill.totalAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-gray-500 font-semibold">
                  <span>Discount</span>
                  <span className="text-gray-800 font-bold">₹ 0.00</span>
                </div>
                <div className="flex justify-between text-gray-500 font-semibold">
                  <span>Tax (0%)</span>
                  <span className="text-gray-800 font-bold">₹ 0.00</span>
                </div>
              </div>

              <div className="border-t border-gray-150 my-4 pt-4 flex justify-between items-center">
                <span className="text-xs font-extrabold text-[#0B2C56]">Grand Total</span>
                <span className="text-base font-extrabold text-[#0B2C56]">₹ {Number(detailBill.totalAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            {/* Timeline Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-150 shadow-sm space-y-4">
              <h3 className="text-[#0B2C56] font-extrabold text-xs uppercase tracking-wider mb-2">Invoice Timeline</h3>
              <div className="flex flex-col mt-4">
                <TimelineItem 
                  title="Invoice Created" 
                  date={formattedDate} 
                  completed={true} 
                  isLast={false} 
                />
                <TimelineItem 
                  title="Payment Pending" 
                  date={detailBill.paymentStatus !== 'PAID' ? 'Awaiting Action' : null} 
                  completed={true} 
                  isLast={false} 
                />
                <TimelineItem 
                  title="Paid" 
                  date={detailBill.paymentStatus === 'PAID' ? 'Transaction Complete' : 'Awaiting Payment'} 
                  active={detailBill.paymentStatus !== 'PAID'} 
                  completed={detailBill.paymentStatus === 'PAID'} 
                  isLast={false} 
                />
                <TimelineItem 
                  title="Downloaded" 
                  date={isDownloaded ? 'Downloaded to local' : 'Not downloaded yet'} 
                  active={detailBill.paymentStatus === 'PAID' && !isDownloaded} 
                  completed={isDownloaded} 
                  isLast={true} 
                />
              </div>
            </div>
          </div>

          {/* Right Column - 9 cols span */}
          <div className="lg:col-span-9 bg-white rounded-2xl overflow-hidden border border-gray-150 shadow-sm flex flex-col">
            <div className="px-6 py-4 border-b border-gray-150 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-[#0B2C56] font-extrabold text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                Invoice Preview
              </h2>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handlePrintPdf} 
                  className="px-3 py-1 text-xs font-bold text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition flex items-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Print
                </button>
                <button 
                  onClick={handleDownloadPdf} 
                  className="px-3 py-1 text-xs font-bold text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </button>
              </div>
            </div>

            
            
            <div className="flex-1 bg-[#f8fafc] p-4 flex items-center justify-center min-h-[600px] relative">
              
              {pdfUrl ? (
                <iframe
                  id="pdf-preview-iframe"
                  src={`${pdfUrl}#toolbar=1&navpanes=0&statusbar=0`}
                  className="w-full h-[calc(100vh-270px)] min-h-[600px] border-0 rounded-xl bg-white shadow-xs"
                  title="Invoice PDF Viewer"
                />
              ) : (
                <div className="text-center text-gray-400 text-sm flex flex-col items-center gap-2">
                  <div className="animate-spin text-2xl">⏳</div>
                  <span>Loading PDF Preview...</span>
                </div>
              )}

              
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 font-sans text-gray-800 bg-gray-50/30 min-h-screen space-y-8">

      {/* Page Header */}
      <div className="flex justify-between items-center border-b border-gray-100 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0B2C56]">Billing</h1>
          <p className="text-gray-400 text-xs mt-1 font-semibold">Generate invoices and track payments</p>
        </div>
      </div>

      {/* ─── Create Invoice Card ─── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Card Header */}
        <div className="bg-gradient-to-r from-[#0B2C56] to-[#154175] px-6 py-4">
          <h2 className="text-white font-bold text-base">🧾 Create Invoice</h2>
          <p className="text-blue-200 text-xs mt-0.5">Fill in patient, appointment, and items</p>
        </div>

        <div className="p-6 space-y-6">

          {/* Row 1: Patient + Appointment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="relative" ref={dropdownRef}>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Patient *</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Type to search patient..."
                  value={patientSearch}
                  onChange={e => {
                    setPatientSearch(e.target.value);
                    setShowDropdown(true);
                    if (!e.target.value) {
                      setSelectedPatientId('');
                    }
                  }}
                  onFocus={() => setShowDropdown(true)}
                  className="w-full px-3 py-2.5 pr-8 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0B2C56] bg-white transition-colors"
                />
                {patientSearch && (
                  <button
                    type="button"
                    onClick={() => {
                      setPatientSearch('');
                      setSelectedPatientId('');
                      setPatientOptions(patients);
                      setShowDropdown(false);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>

              {showDropdown && (
                <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {patientOptions.length === 0 ? (
                    <div className="px-4 py-3 text-xs text-gray-500 text-center">
                      No patients found
                    </div>
                  ) : (
                    patientOptions.map(p => (
                      <div
                        key={p.id}
                        onClick={() => {
                          setSelectedPatientId(p.id);
                          setPatientSearch(p.fullName);
                          setShowDropdown(false);
                        }}
                        className={`px-4 py-2 text-sm text-gray-700 cursor-pointer flex justify-between items-center border-b border-gray-50 last:border-0 hover:bg-blue-50/50 transition-colors ${
                          String(selectedPatientId) === String(p.id) ? 'bg-blue-50/50 font-bold' : ''
                        }`}
                      >
                        <div>
                          <span className="font-semibold">{p.fullName}</span>
                          <span className="ml-2 text-[10px] text-gray-400 font-mono">ID: {p.id}</span>
                        </div>
                        {p.mobile && (
                          <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded font-mono">
                            {p.mobile}
                          </span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            <div>
              {/* <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Appointment *</label> */}
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                Appointment (Optional)
            </label>
              <select
                value={selectedAppointmentId}
                onChange={e => setSelectedAppointmentId(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0B2C56] bg-white transition-colors"
              >
                <option value="">— Select Appointment —</option>
                {filteredAppointments.map(a => (
                  <option key={a.id} value={a.id}>
                    #{a.id} — {a.patient?.fullName || 'No Name'} ({a.appointmentDate} | {a.appointmentTime})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Date + Bill No */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Date</label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0B2C56]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Bill No (Auto)</label>
              <input
                type="text"
                value={billNo}
                onChange={e => setBillNo(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none"
                readOnly
              />
            </div>
          </div>

          {/* Items Table */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Invoice Items</label>
              <button
                onClick={handleAddItem}
                className="text-xs font-bold text-[#0B2C56] hover:text-[#154175] border border-[#0B2C56]/30 hover:border-[#0B2C56] px-3 py-1 rounded-lg transition flex items-center gap-1"
              >
                + Add Item
              </button>
            </div>

            {/* Items Header */}
            <div className="grid grid-cols-12 gap-2 px-3 py-2 bg-gray-50 rounded-lg text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">
              <div className="col-span-6">Item Name</div>
              <div className="col-span-2 text-center">Qty</div>
              <div className="col-span-3 text-center">Unit Price (₹)</div>
              <div className="col-span-1"></div>
            </div>

            <div className="space-y-2">
              {billItems.map((it, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                  <input
                    type="text"
                    placeholder="e.g. ENT Consultation"
                    value={it.itemName}
                    onChange={e => handleItemChange(idx, 'itemName', e.target.value)}
                    className="col-span-6 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0B2C56]"
                  />
                  <input
                    type="number"
                    min="1"
                    placeholder="1"
                    value={it.quantity}
                    onChange={e => handleItemChange(idx, 'quantity', e.target.value)}
                    className="col-span-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-center focus:outline-none focus:border-[#0B2C56]"
                  />
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={it.unitPrice}
                    onChange={e => handleItemChange(idx, 'unitPrice', e.target.value)}
                    className="col-span-3 px-3 py-2 border border-gray-200 rounded-lg text-sm text-center focus:outline-none focus:border-[#0B2C56]"
                  />
                  <button
                    onClick={() => handleRemoveItem(idx)}
                    className="col-span-1 text-rose-400 hover:text-rose-600 font-bold text-lg flex justify-center transition"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Total + Save */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="text-sm text-gray-500 font-semibold">
              {billItems.length} item(s)
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Total Amount</p>
                <p className="text-2xl font-extrabold text-[#0B2C56]">₹ {totalAmount.toLocaleString('en-IN')}</p>
              </div>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2.5 bg-[#0B2C56] hover:bg-[#154175] disabled:opacity-50 text-white text-sm font-bold rounded-lg shadow transition flex items-center gap-2"
              >
                {saving ? '⏳ Saving...' : '💾 Save Invoice'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Bills Table ─── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="text-base font-extrabold text-[#0B2C56]">📋 Bills History</h2>
            <p className="text-gray-400 text-xs mt-0.5">View and manage all invoices</p>
          </div>
          <select
            value={filterPatientId}
            onChange={e => { setFilterPatientId(e.target.value); fetchBills(e.target.value); }}
            className="border border-gray-200 text-xs px-3 py-1.5 rounded-lg focus:outline-none focus:border-[#0B2C56]"
          >
            <option value="">All Patients</option>
            {patients.map(p => (
              <option key={p.id} value={p.id}>{p.fullName}</option>
            ))}
          </select>
        </div>

        {loadingBills ? (
          <div className="text-center py-12 text-gray-400 text-xs">
            <span className="text-2xl">⏳</span>
            <p className="mt-2">Loading bills...</p>
          </div>
        ) : bills.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-xs">
            <span className="text-2xl">🧾</span>
            <p className="mt-2">No bills found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs md:text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-[10px] uppercase text-gray-400 font-extrabold tracking-wider">
                  <th className="p-4">ID</th>
                  <th className="p-4">Patient</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Total</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {bills.map(bill => (
                  <tr key={bill.id} className="hover:bg-gray-50/50 transition">
                    <td className="p-4 font-bold text-gray-700">#{bill.id}</td>
                    <td className="p-4 font-extrabold text-[#0B2C56]">{bill.patient?.fullName || '—'}</td>
                    <td className="p-4 text-gray-500">{bill.billDate || '—'}</td>
                    <td className="p-4 font-bold text-gray-800">
                      {bill.totalAmount ? `₹ ${Number(bill.totalAmount).toLocaleString('en-IN')}` : '—'}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase border inline-block ${getStatusStyle(bill.paymentStatus)}`}>
                        {bill.paymentStatus || 'Pending'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => window.location.hash = `/admin/billing/details/${bill.id}`}
                          className="px-2.5 py-1 text-blue-600 hover:text-blue-800 font-bold text-xs"
                          title="View Details"
                        >
                          👁️
                        </button>
                        {bill.paymentStatus !== 'PAID' && (
                          <button
                            onClick={() => handlePaymentUpdate(bill.id, 'PAID')}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[9px] font-bold rounded transition shadow-xs"
                          >
                            ✓ Mark Paid
                          </button>
                        )}
                        <button
                          onClick={() => handleDownload(bill.id)}
                          className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white text-[9px] font-bold rounded transition shadow-xs"
                        >
                          ⬇ Download
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
