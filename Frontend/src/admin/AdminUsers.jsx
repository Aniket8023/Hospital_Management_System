import React from 'react';

export default function AdminUsers() {
  const staff = [
    { name: 'Dr. Akshay Raju Shinde', email: 'akshay.shinde@shindehospital.com', role: 'Chief ENT Specialist' },
    { name: 'Dr. Rajendra Shinde', email: 'rajendra.shinde@shindehospital.com', role: 'Founder & Director' },
    { name: 'Admin Staff', email: 'admin@shindehospital.com', role: 'System Administrator' }
  ];

  return (
    <div className="p-6 md:p-8 space-y-6 font-sans text-gray-800 text-left bg-gray-50/30 min-h-screen">
      <div className="border-b border-gray-100 pb-5">
        <h1 className="text-2xl font-extrabold text-[#0B2C56] tracking-tight">Users</h1>
        <p className="text-gray-400 text-xs mt-1">View list of system administrators and staff accounts</p>
      </div>

      <div className="bg-white border border-gray-150 rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse text-xs md:text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-150 text-[10px] uppercase text-gray-400 font-extrabold tracking-wider">
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-150 text-gray-700 font-medium">
            {staff.map((u, i) => (
              <tr key={i} className="hover:bg-gray-50/50 transition">
                <td className="p-4 font-extrabold text-[#0B2C56]">{u.name}</td>
                <td className="p-4 font-mono">{u.email}</td>
                <td className="p-4">
                  <span className="px-2.5 py-1 bg-blue-50 text-blue-800 rounded-full font-bold text-[10px] border border-blue-100">
                    {u.role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
