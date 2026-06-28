import React, { useState, useEffect, useRef } from "react";
import { getAuthHeaders } from "../utils/auth";

export default function AdminReports({ patients = [] }) {

  const API = "http://localhost:8080";

  const [doctors, setDoctors] = useState([]);
  const [reports, setReports] = useState([]);

  const [patientId, setPatientId] = useState("");
  const [patientSearch, setPatientSearch] = useState("");
  const [patientOptions, setPatientOptions] = useState(patients);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setPatientOptions(patients);
  }, [patients]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
          console.error(e);
        }
      };
      fetchPatients();
    }, 300);
    return () => clearTimeout(handler);
  }, [patientSearch, patients]);

  const [doctorId, setDoctorId] = useState("");
  const [reportName, setReportName] = useState("");
  const [reportType, setReportType] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    try {
      const res = await fetch(
        `${API}/doctor`,
        {
          headers: {
            ...getAuthHeaders()
          }
        }
      );

      const data = await res.json();

      setDoctors(data);

    } catch (err) {
      console.error(err);
    }
  };

  const loadReports = async (patientId) => {

    try {

      const res = await fetch(
        `${API}/reports/patient/${patientId}`,
        {
          headers: {
            ...getAuthHeaders()
          }
        }
      );

      const data = await res.json();

      setReports(data);

    } catch (err) {
      console.error(err);
    }
  };

  const handleUpload = async () => {

    if (
      !patientId ||
      !doctorId ||
      !reportName ||
      !reportType ||
      !file
    ) {
      alert("Fill all fields");
      return;
    }

    try {

      const formData = new FormData();

      formData.append(
        "patientId",
        patientId
      );

      formData.append(
        "doctorId",
        doctorId
      );

      formData.append(
        "reportName",
        reportName
      );

      formData.append(
        "reportType",
        reportType
      );

      formData.append(
        "file",
        file
      );

      const res = await fetch(
        `${API}/reports/upload`,
        {
          method: "POST",
          headers: {
            Authorization:
              getAuthHeaders().Authorization
          },
          body: formData
        }
      );

      if (res.ok) {

        alert(
          "Report Uploaded Successfully"
        );

        loadReports(patientId);

        setReportName("");
        setReportType("");
        setFile(null);

      } else {

        alert(
          "Upload Failed"
        );
      }

    } catch (err) {

      console.error(err);
    }
  };

  const downloadReport = async (
    reportId,
    reportName
  ) => {

    try {

      const res = await fetch(
        `${API}/reports/${reportId}/download`,
        {
          headers: {
            ...getAuthHeaders()
          }
        }
      );

      const blob =
        await res.blob();

      const url =
        window.URL.createObjectURL(
          blob
        );

      const a =
        document.createElement(
          "a"
        );

      a.href = url;

      a.download =
        reportName;

      a.click();

      window.URL.revokeObjectURL(
        url
      );

    } catch (err) {

      console.error(err);
    }
  };

  const deleteReport = async (id) => {

    if (!window.confirm("Delete Report ?"))
      return;

    try {

      const res = await fetch(
        `${API}/reports/${id}`,
        {
          method: "DELETE",
          headers: {
            ...getAuthHeaders()
          }
        }
      );

      if (res.ok) {

        alert("Report Deleted");

        loadReports(patientId);

      }

    } catch (err) {

      console.error(err);
    }
  };

  return (
    <div className="p-6">

      <h2 className="text-2xl font-bold mb-6">
        Medical Reports
      </h2>

      <div className="bg-white p-5 rounded shadow mb-6">

        <div className="grid md:grid-cols-2 gap-4">

          <div className="relative" ref={dropdownRef}>
            <div className="relative">
              <input
                type="text"
                placeholder="Search patient by name..."
                value={patientSearch}
                onChange={(e) => {
                  setPatientSearch(e.target.value);
                  setShowDropdown(true);
                  if (!e.target.value) {
                    setPatientId("");
                    setReports([]);
                  }
                }}
                onFocus={() => setShowDropdown(true)}
                className="w-full border p-2 rounded focus:outline-none focus:border-[#0B2C56] bg-white pr-8 text-sm placeholder-gray-400 font-medium"
              />
              {patientSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setPatientSearch("");
                    setPatientId("");
                    setPatientOptions(patients);
                    setReports([]);
                    setShowDropdown(false);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {showDropdown && (
              <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-200 rounded shadow-lg max-h-60 overflow-y-auto">
                {patientOptions.length === 0 ? (
                  <div className="px-4 py-3 text-xs text-gray-500 text-center">
                    No patients found
                  </div>
                ) : (
                  patientOptions.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setPatientId(p.id);
                        setPatientSearch(p.fullName);
                        setShowDropdown(false);
                        loadReports(p.id);
                      }}
                      className={`px-4 py-2.5 text-sm text-gray-750 cursor-pointer flex justify-between items-center border-b border-gray-50 last:border-0 hover:bg-blue-50/50 transition-colors ${
                        String(patientId) === String(p.id) ? "bg-blue-50/50 font-bold" : ""
                      }`}
                    >
                      <div>
                        <span className="font-semibold text-gray-900">{p.fullName}</span>
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

          <select
            value={doctorId}
            onChange={(e) =>
              setDoctorId(
                e.target.value
              )
            }
            className="border p-2 rounded"
          >
            <option value="">
              Select Doctor
            </option>

            {doctors.map(
              (d) => (
                <option
                  key={d.id}
                  value={d.id}
                >
                  {d.user?.name}
                </option>
              )
            )}
          </select>

          <input
            type="text"
            placeholder="Report Name"
            value={reportName}
            onChange={(e) =>
              setReportName(
                e.target.value
              )
            }
            className="border p-2 rounded"
          />

          <input
            type="text"
            placeholder="Report Type"
            value={reportType}
            onChange={(e) =>
              setReportType(
                e.target.value
              )
            }
            className="border p-2 rounded"
          />

          <input
            type="file"
            onChange={(e) =>
              setFile(
                e.target.files[0]
              )
            }
            className="border p-2 rounded"
          />
        </div>

        <button
          onClick={handleUpload}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Upload Report
        </button>

      </div>

      <div className="bg-white p-5 rounded shadow">

        <h3 className="font-bold mb-4">
          Reports
        </h3>

        <table className="w-full border">

          <thead>
            <tr className="bg-gray-100">

              <th className="p-2">
                ID
              </th>

              <th className="p-2">
                Report Name
              </th>

              <th className="p-2">
                Type
              </th>

              <th className="p-2">
                Date
              </th>

              <th className="p-2">
                Action
              </th>

            </tr>
          </thead>

          <tbody>

            {reports.map(
              (r) => (
                <tr
                  key={r.id}
                >
                  <td className="p-2">
                    {r.id}
                  </td>

                  <td className="p-2">
                    {r.reportName}
                  </td>

                  <td className="p-2">
                    {r.reportType}
                  </td>

                  <td className="p-2">
                    {r.uploadDate}
                  </td>

                  <td className="p-2">

                    <div className="flex gap-3">

                      <button
                        onClick={() =>
                          downloadReport(
                            r.id,
                            r.reportName
                          )
                        }
                        className="text-blue-600"
                      >
                        Download
                      </button>

                      <button
                        onClick={() =>
                          deleteReport(r.id)
                        }
                        className="text-red-600"
                      >
                        Delete
                      </button>

                    </div>

                  </td>
                </tr>
              )
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}