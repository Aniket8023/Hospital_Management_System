import React, { useState } from 'react';

export default function AdminDoctors({ doctors, addDoctor, editDoctor, deleteDoctor, departments, setAdminTab }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDocId, setEditingDocId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    specialty: '',
    email: '',
    phone: '',
    department: 'ENT',
    timeSlots: '09:00 AM - 11:00 AM, 04:00 PM - 06:00 PM',
    image: ''
  });

  const [formError, setFormError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const openAddForm = () => {
    setEditingDocId(null);
    setFormData({
      name: '',
      role: '',
      specialty: '',
      email: '',
      phone: '',
      department: 'ENT',
      timeSlots: '09:00 AM - 11:00 AM, 04:00 PM - 06:00 PM',
      image: ''
    });
    setFormError('');
    setIsFormOpen(true);
  };

  const openEditForm = (doc) => {
    setEditingDocId(doc.id);
    setFormData({
      name: doc.name,
      role: doc.role,
      specialty: doc.specialty,
      email: doc.email,
      phone: doc.phone,
      department: doc.department,
      timeSlots: doc.timeSlots.join(', '),
      image: doc.image
    });
    setFormError('');
    setIsFormOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.role || !formData.specialty || !formData.email || !formData.phone) {
      setFormError('Please fill out all required fields.');
      return;
    }

    const slotsArray = formData.timeSlots
      .split(',')
      .map(slot => slot.trim())
      .filter(slot => slot.length > 0);

    const docPayload = {
      name: formData.name,
      role: formData.role,
      specialty: formData.specialty,
      email: formData.email,
      phone: formData.phone,
      department: formData.department,
      timeSlots: slotsArray.length > 0 ? slotsArray : ["09:00 AM - 11:00 AM"],
      image: formData.image || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300'
    };

    if (editingDocId) {
      editDoctor(editingDocId, docPayload);
    } else {
      addDoctor(docPayload);
    }

    setIsFormOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this doctor profile?')) {
      deleteDoctor(id);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 font-sans text-gray-800 text-left bg-gray-50/30 min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-100 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0B2C56]">Manage Doctors</h1>
          <p className="text-gray-500 text-xs mt-1 font-semibold">Register specialists and manage consultation hours</p>
        </div>

        {/* Tab Controls */}
        <div className="flex gap-1.5 bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setAdminTab('dashboard')}
            className="px-4 py-2 rounded-lg text-xs font-bold text-gray-600 hover:bg-white/60 transition cursor-pointer"
          >
            Dashboard
          </button>
          <button
            onClick={() => setAdminTab('appointments')}
            className="px-4 py-2 rounded-lg text-xs font-bold text-gray-600 hover:bg-white/60 transition cursor-pointer"
          >
            Manage Appointments
          </button>
          <button
            onClick={() => setAdminTab('doctors')}
            className="px-4 py-2 rounded-lg text-xs font-bold bg-white text-[#0B2C56] shadow-xs cursor-pointer"
          >
            Manage Doctors
          </button>
        </div>
      </div>

      {/* Control bar */}
      <div className="flex justify-between items-center bg-white border border-gray-150 p-4 rounded-xl shadow-xs">
        <span className="text-xs font-semibold text-gray-500">
          Showing {doctors.length} Registered Specialist(s)
        </span>
        <button
          onClick={openAddForm}
          className="px-4 py-2 bg-[#0B2C56] hover:bg-[#154175] text-white text-xs font-bold rounded-lg shadow-xs transition duration-150 flex items-center gap-1.5 cursor-pointer"
        >
          <span>➕</span>
          <span>Add Specialist</span>
        </button>
      </div>

      {/* Grid of Doctors */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doc) => (
          <div key={doc.id} className="bg-white border border-gray-150 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
            
            <div className="flex gap-4 items-start">
              <img
                src={doc.image}
                alt={doc.name}
                className="w-16 h-16 rounded-xl object-cover border border-gray-100 flex-shrink-0"
              />
              <div className="space-y-1 text-left">
                <span className="bg-blue-50 text-[#0B2C56] text-[8px] font-extrabold px-2 py-0.5 rounded-full border border-blue-100 uppercase tracking-wide inline-block">
                  {doc.department}
                </span>
                <h3 className="font-extrabold text-gray-800 text-sm leading-snug">{doc.name}</h3>
                <p className="text-gray-500 text-[10.5px] font-medium leading-none">{doc.role}</p>
              </div>
            </div>

            <div className="border-t border-b border-gray-100 py-3 text-xs space-y-1.5 text-gray-600 font-semibold leading-relaxed">
              <p>✉️ Email: <span className="font-normal text-gray-500">{doc.email}</span></p>
              <p>📞 Phone: <span className="font-normal text-gray-500">{doc.phone}</span></p>
              <div className="pt-1.5">
                <span className="text-[9px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1">Available slots</span>
                <div className="flex flex-wrap gap-1">
                  {doc.timeSlots.map((slot, idx) => (
                    <span key={idx} className="bg-gray-50 border border-gray-150 px-2 py-0.5 rounded text-[9px] font-bold text-gray-600">
                      {slot}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => openEditForm(doc)}
                className="px-3 py-1.5 border border-gray-200 text-gray-600 hover:bg-gray-50 text-[11px] font-bold rounded-lg cursor-pointer"
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => handleDelete(doc.id)}
                className="px-3 py-1.5 border border-rose-200 text-rose-600 hover:bg-rose-50 text-[11px] font-bold rounded-lg cursor-pointer"
              >
                🗑️ Delete
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-[#0B2C56]/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 w-full max-w-lg shadow-2xl space-y-6 text-left">
            
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-extrabold text-[#0B2C56] text-lg">
                {editingDocId ? 'Edit Doctor Profile' : 'Register New Specialist'}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-gray-400 hover:text-gray-600 font-extrabold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg p-3">
                ⚠️ {formError}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs md:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Doctor Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Dr. Rajendra Shinde"
                    className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Designation/Role *</label>
                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    placeholder="e.g. Chief ENT Specialist"
                    className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 bg-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="doctor@shindehospital.com"
                    className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 bg-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Phone *</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="8888551743"
                    className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 bg-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Department *</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 bg-white cursor-pointer"
                  >
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 mb-1">Specialties *</label>
                  <input
                    type="text"
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleInputChange}
                    placeholder="e.g. Ear Care, Tinnitus"
                    className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Consultation slots (comma-separated) *</label>
                <input
                  type="text"
                  name="timeSlots"
                  value={formData.timeSlots}
                  onChange={handleInputChange}
                  placeholder="e.g. 09:00 AM - 11:00 AM, 06:00 PM - 08:00 PM"
                  className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 bg-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Photo Unsplash URL (Optional)</label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 bg-white"
                />
              </div>

              <div className="border-t border-gray-100 pt-4 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 text-xs font-bold rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0B2C56] hover:bg-[#154175] text-white text-xs font-bold rounded-lg shadow-xs cursor-pointer"
                >
                  {editingDocId ? 'Save Profile' : 'Add Specialist'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
