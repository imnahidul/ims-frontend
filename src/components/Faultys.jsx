/////////////19/25-1-2026/////////////////new code/////////////


import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import {
  FaUser,
  FaBuilding,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";

const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;

const Faultys = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editMode, setEditMode] = useState(true);
  const [faultys, setFaultys] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 20;

  const readerRef = useRef(null);

  const emptyForm = {
    faulty_no: "",
    report_date: "",
    return_date: "",
    status: "Pending",
    reported_by: { name: "", department: "", phone: "", email: "", address: "" },
    return_reason: "",
    logo: null,
    items: [{ id: uid(), item: "", description: "", qty: 1, unit: "pcs" }],
    notes: "",
  };

  const [form, setForm] = useState(emptyForm);

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString("en-GB") : "");
  const todayISO = () => new Date().toISOString().split("T")[0];

  const resetForm = () => {
    setForm({ ...emptyForm });
    setEditId(null);
    setEditMode(true);
  };

  const generateFaultyNo = () => {
    const nums = faultys
      .map((f) => parseInt(f.faulty_no?.match(/(\d+)$/)?.[0] || 0))
      .filter(Boolean)
      .sort((a, b) => b - a);
    const next = (nums[0] || 0) + 1;
    return `FLT-${String(next).padStart(4, "0")}`;
  };

  const fetchFaultys = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://90.90.91.34:5000/api/faulty", {
        headers: { Authorization: `Bearer ${localStorage.getItem("pos-token")}` },
      });
      setFaultys(res.data.faultys || []);
      setFiltered(res.data.faultys || []);
    } catch (err) {
      alert("Failed to load faulty items");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaultys();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase().trim();
    const filteredData = term
      ? faultys.filter((f) =>
          [
            f.faulty_no,
            f.reported_by?.name,
            f.reported_by?.department,
            f.return_reason,
          ].some((f) => f?.toLowerCase().includes(term))
        )
      : faultys;
    setFiltered(filteredData);
    setPage(1);
  }, [searchTerm, faultys]);

  const pagesCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, key] = name.split(".");
      setForm((p) => ({ ...p, [parent]: { ...p[parent], [key]: value } }));
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }
  };

  const handleItemChange = (id, field, value) => {
    setForm((p) => ({
      ...p,
      items: p.items.map((it) =>
        it.id === id
          ? {
              ...it,
              [field]: field === "qty" ? Number(value) || 1 : value,
            }
          : it
      ),
    }));
  };

  const addItem = () =>
    setForm((p) => ({
      ...p,
      items: [...p.items, { id: uid(), item: "", description: "", qty: 1, unit: "pcs" }],
    }));

  const removeItem = (id) =>
    setForm((p) => ({ ...p, items: p.items.filter((i) => i.id !== id) }));

  const openAddModal = () => {
    resetForm();
    setForm((f) => ({
      ...f,
      faulty_no: generateFaultyNo(),
      report_date: todayISO(),
    }));
    setModalOpen(true);
  };

  const openEditModal = (faulty) => {
    const itemsWithId = (faulty.items || []).map((it) => ({ ...it, id: it.id || uid() }));
    setForm({
      ...emptyForm,
      ...faulty,
      items: itemsWithId.length > 0 ? itemsWithId : [{ id: uid(), item: "", description: "", qty: 1, unit: "pcs" }],
      report_date: faulty.report_date ? new Date(faulty.report_date).toISOString().split("T")[0] : "",
      return_date: faulty.return_date ? new Date(faulty.return_date).toISOString().split("T")[0] : "",
      logo: faulty.logo || null,
    });
    setEditId(faulty._id);
    setEditMode(faulty.status === "Pending");
    setModalOpen(true);
  };

  const previewSaved = (faulty) => {
    const itemsWithId = (faulty.items || []).map((it) => ({ ...it, id: it.id || uid() }));
    setForm({
      ...emptyForm,
      ...faulty,
      items: itemsWithId.length > 0 ? itemsWithId : [{ id: uid(), item: "", description: "", qty: 1, unit: "pcs" }],
      report_date: faulty.report_date ? new Date(faulty.report_date).toISOString().split("T")[0] : "",
      return_date: faulty.return_date ? new Date(faulty.return_date).toISOString().split("T")[0] : "",
      logo: faulty.logo || null,
    });
    setEditId(faulty._id);
    setEditMode(false);
    setModalOpen(true);
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file || !editMode) return;

    if (readerRef.current) readerRef.current.abort?.();

    const reader = new FileReader();
    readerRef.current = reader;
    reader.onload = (ev) => {
      setForm((p) => ({ ...p, logo: ev.target.result }));
      readerRef.current = null;
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    return () => readerRef.current?.abort?.();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (form.items.some((i) => !i.item.trim())) {
      alert("Please fill all item names");
      return;
    }

    const payload = {
      ...form,
      items: form.items.map(({ id, item, description, qty, unit }) => ({
        id,
        item,
        description,
        qty,
        unit,
      })),
      report_date: form.report_date ? new Date(form.report_date).toISOString() : null,
      return_date: form.return_date ? new Date(form.return_date).toISOString() : null,
    };

    try {
      if (editId) {
        await axios.put(`http://90.90.91.34:5000/api/faulty/${editId}`, payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem("pos-token")}` },
        });
      } else {
        await axios.post("http://90.90.91.34:5000/api/faulty/add", payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem("pos-token")}` },
        });
      }
      alert("Faulty item saved!");
      setModalOpen(false);
      await fetchFaultys();
      resetForm();
    } catch (err) {
      alert("Save failed: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete permanently?")) return;
    try {
      await axios.delete(`http://90.90.91.34:5000/api/faulty/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("pos-token")}` },
      });
      fetchFaultys();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const handlePrint = () => {
    const content = document.getElementById("printable-faulty");
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`
      <!DOCTYPE html>
      <html><head><meta charset="utf-8"><title>${form.faulty_no}</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <style>@page { margin: 0.5in; } body { padding: 40px; }</style>
      </head><body class="font-sans text-sm">
        ${content?.innerHTML || ""}
      </body></html>
    `);
    win.document.close();
    win.focus();
    setTimeout(() => {
      win.print();
      setTimeout(() => win.close(), 500);
    }, 300);
  };

  const generatePDF = () => {
    const doc = new jsPDF("p", "pt", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 50;
    let y = 80;

    if (form.logo && form.logo.startsWith("data:image/")) {
      const format = form.logo.includes("jpeg") || form.logo.includes("jpg") ? "JPEG" : "PNG";
      try { doc.addImage(form.logo, format, margin, y - 50, 140, 90); } catch {}
    }

    const right = pageWidth - margin;
    doc.setFontSize(11);
    doc.text(`Faulty #: ${form.faulty_no}`, right, y, { align: "right" });
    doc.text(`Report Date: ${formatDate(form.report_date)}`, right, y + 20, { align: "right" });
    doc.text(`Return By: ${formatDate(form.return_date)}`, right, y + 40, { align: "right" });
    doc.text(`Status: ${form.status}`, right, y + 60, { align: "right" });

    y += 120;
    doc.setFontSize(12).setFont("helvetica", "bold");
    doc.text("Reported By", margin, y);
    doc.setFont("helvetica", "normal");
    y += 20;

    [form.reported_by.name, form.reported_by.department, form.reported_by.phone, form.reported_by.email, form.reported_by.address]
      .filter(Boolean)
      .forEach((line) => {
        doc.text(line, margin, y);
        y += 18;
      });

    y += 50;
    doc.autoTable({
      startY: y,
      head: [["Item", "Description", "Qty", "Unit"]],
      body: form.items.map((i) => [i.item || "", i.description || "", i.qty || 0, i.unit || "pcs"]),
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [240, 240, 240] },
    });

    y = doc.lastAutoTable.finalY + 50;
    if (form.return_reason) {
      doc.setFont("helvetica", "bold").text("Return Reason:", margin, y);
      doc.setFont("helvetica", "normal");
      doc.splitTextToSize(form.return_reason, pageWidth - margin * 2).forEach((line) => {
        y += 20;
        doc.text(line, margin, y);
      });
    }

    if (form.notes) {
      y += 40;
      doc.setFont("helvetica", "bold").text("Notes:", margin, y);
      doc.setFont("helvetica", "normal");
      doc.splitTextToSize(form.notes, pageWidth - margin * 2).forEach((line) => {
        y += 20;
        doc.text(line, margin, y);
      });
    }

    doc.save(`${form.faulty_no || "faulty"}.pdf`);
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Faulty Items</h1>

      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <input
          type="text"
          placeholder="Search by Faulty No, Name, Department..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full md:w-96 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button onClick={openAddModal} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
          + New Faulty Report
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="w-full text-sm">
            {/* <table className="w-full border-collapse mb-8"> */}
              <thead className="bg-gray-100">
                <tr>
                  {["No", "Faulty No", "Reported By", "Department", "Report Date", "Return By", "Status", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((f, i) => (
                  <tr key={f._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3">{(page - 1) * PAGE_SIZE + i + 1}</td>
                    <td className="px-4 py-3 font-medium">{f.faulty_no}</td>
                    <td className="px-4 py-3">{f.reported_by?.name || "-"}</td>
                    <td className="px-4 py-3">{f.reported_by?.department || "-"}</td>
                    <td className="px-4 py-3">{formatDate(f.report_date)}</td>
                    <td className="px-4 py-3">{formatDate(f.return_date)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        f.status === "Pending" ? "bg-orange-100 text-orange-800" :
                        f.status === "Reviewed" ? "bg-blue-100 text-blue-800" :
                        f.status === "Repaired" || f.status === "Replaced" ? "bg-green-100 text-green-800" :
                        "bg-red-100 text-red-800"
                      }`}>
                        {f.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 space-x-2">
                      <button
                        onClick={() => openEditModal(f)}
                        disabled={f.status !== "Pending"}
                        className={`px-3 py-1 rounded text-white text-xs ${
                          f.status === "Pending" ? "bg-yellow-600 hover:bg-yellow-700" : "bg-gray-400 cursor-not-allowed"
                        }`}
                      >
                        Edit
                      </button>
                      <button onClick={() => handleDelete(f._id)} className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700">
                        Delete
                      </button>
                      <button onClick={() => previewSaved(f)} className="px-3 py-1 bg-indigo-600 text-white rounded text-xs hover:bg-indigo-700">
                        View / Print
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-600">Page {page} of {pagesCount}</div>
            <div className="space-x-3">
              <button disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-100">
                Previous
              </button>
              <button disabled={page >= pagesCount} onClick={() => setPage(p => Math.min(p + 1, pagesCount))} className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-100">
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-start justify-center z-50 overflow-y-auto p-4 pt-20">
          <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full relative">
            <button
              onClick={() => { setModalOpen(false); setTimeout(resetForm, 150); }}
              className="absolute top-1 right-2 text-4xl font-bold text-gray-500 hover:text-red-400 z-10"
            >
              ×
            </button>

            <form onSubmit={handleSave}>
              <div id="printable-faulty" className="p-12 text-sm">
                {/* Header */}
                <div className="flex justify-between items-start mb-8">
                  <div>
                    {form.logo ? (
                      <img src={form.logo} alt="Logo" className="max-w-70 h-auto" />
                    ) : (
                      <div className="w-48 h-32 border-2 border-dashed border-gray-400 rounded flex items-center justify-center text-gray-500">
                        Products Image
                      </div>
                    )}
                    {editMode && (
                      <div className="mt-4">
                        <input type="file" accept="image/*" onChange={handleLogoUpload} className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-600 file:text-white" />
                      </div>
                    )}
                  </div>

                  <div className="text-right">
                    <h1 className="text-4xl font-bold mb-3 text-gray-800">FAULTY REPORT</h1>
                    <p className="text-lg text-gray-600">Item Return/Repair Request</p>
                    <div className="space-y-2 mt-4">
                      <div><strong>Faulty #:</strong> <span className="font-bold text-lg">{form.faulty_no}</span></div>
                      <div><strong>Report Date:</strong> {editMode ? <input type="date" name="report_date" value={form.report_date} onChange={handleFormChange} min={new Date().toISOString().split("T")[0]} className="border-b-2 border-gray-400 ml-2 focus:border-blue-600 outline-none" /> : formatDate(form.report_date)}</div>
                      <div><strong>Return By:</strong> {editMode ? <input type="date" name="return_date" value={form.return_date} onChange={handleFormChange} min={todayISO()} className="border-b-2 border-gray-400 ml-2 focus:border-blue-600 outline-none" /> : formatDate(form.return_date)}</div>
                      <div><strong>Status:</strong> {editMode ? (
                        <select name="status" value={form.status} onChange={handleFormChange} className="ml-2 border rounded px-3 py-1">
                          <option>Pending</option>
                          <option>Reviewed</option>
                          <option>Repaired</option>
                          <option>Replaced</option>
                          <option>Rejected</option>
                        </select>
                      ) : <span className="font-medium ml-2">{form.status}</span>}</div>
                    </div>
                  </div>
                </div>

                {/* Reported By */}
                <div className="grid grid-cols-1 print:grid-cols-2 gap-12 mb-12 print:gap-48">
                  <div>
                    <h3 className="font-bold text-lg mb-4">Reported By</h3>
                    {["name", "department", "phone", "email", "address"].map((field) => (
                      <div key={field} className="flex items-start gap-3 mb-2">
                        {field === "name" && <FaUser className="mt-1 text-gray-600" />}
                        {field === "department" && <FaBuilding className="mt-1 text-gray-600" />}
                        {field === "phone" && <FaPhone className="mt-1 text-gray-600" />}
                        {field === "email" && <FaEnvelope className="mt-1 text-gray-600" />}
                        {field === "address" && <FaMapMarkerAlt className="mt-1 text-gray-600" />}
                        {editMode ? (
                          <input
                            name={`reported_by.${field}`}
                            value={form.reported_by[field] || ""}
                            onChange={handleFormChange}
                            className="flex-1 border-b-2 border-gray-300 focus:border-blue-600 outline-none py-1"
                            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                          />
                        ) : (
                          <span className="flex-1">{form.reported_by[field] || "-"}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Return Reason */}
                <div className="mb-8">
                  <strong className="text-lg block mb-3">Return Reason</strong>
                  {editMode ? (
                    <textarea
                      name="return_reason"
                      value={form.return_reason}
                      onChange={handleFormChange}
                      rows={3}
                      className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="e.g., Defective manufacturing"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg text-gray-700">{form.return_reason || "No reason specified."}</div>
                  )}
                </div>

                {/* Items Table */}
                <table className="w-full border-collapse mb-8">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-3 text-left">Item</th>
                      <th className="border border-gray-300 px-4 py-3 text-left">Description</th>
                      <th className="border border-gray-300 px-4 py-3 text-center w-24">Qty</th>
                      <th className="border border-gray-300 px-4 py-3 text-center w-24">Unit</th>
                      {editMode && <th className="border border-gray-300 px-4 py-3 print:hidden w-24">Action</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {form.items.map((item) => (
                      <tr key={item.id}>
                        <td className="px-4 py-3">
                          {editMode ? (
                            <input
                              value={item.item}
                              onChange={(e) => handleItemChange(item.id, "item", e.target.value)}
                              className="w-full outline-none"
                              placeholder="Item name"
                            />
                          ) : (
                            item.item || "-"
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {editMode ? (
                            <input
                              value={item.description}
                              onChange={(e) => handleItemChange(item.id, "description", e.target.value)}
                              className="w-full outline-none"
                              placeholder="Description"
                            />
                          ) : (
                            item.description || "-"
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {editMode ? (
                            <input
                              type="number"
                              value={item.qty}
                              onChange={(e) => handleItemChange(item.id, "qty", e.target.value)}
                              className="w-20 text-center outline-none"
                              min="1"
                            />
                          ) : (
                            item.qty || 0
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {editMode ? (
                            <input
                              value={item.unit}
                              onChange={(e) => handleItemChange(item.id, "unit", e.target.value)}
                              className="w-20 text-center outline-none"
                              placeholder="pcs"
                            />
                          ) : (
                            item.unit || "pcs"
                          )}
                        </td>
                        {editMode && (
                          <td className="px-4 py-3 text-center print:hidden">
                            <button type="button" onClick={() => removeItem(item.id)} className="text-red-600 hover:underline text-sm">
                              Remove
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>

                {editMode && (
                  <button type="button" onClick={addItem} className="mb-8 px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 print:hidden">
                    + Add Item
                  </button>
                )}

                {/* Notes */}
                {/* <div className="mt-12">
                  <strong className="text-lg block mb-3">Notes / Remarks</strong>
                  {editMode ? (
                    <textarea
                      name="notes"
                      value={form.notes}
                      onChange={handleFormChange}
                      rows={4}
                      className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  ) : (
                    <div className="whitespace-pre-wrap text-gray-700">{form.notes || "No notes added."}</div>
                  )}
                </div> */}
              </div>

              {/* Buttons */}
              <div className="p-4 border-t bg-gray-50 flex justify-center gap-6 print:hidden">
                <button type="button" onClick={handlePrint} className="px-8 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 text-lg">
                  Print
                </button>

                {editMode && (
                  <button type="submit" className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 text-lg font-medium">
                    {editId ? "Update" : "Save"} Faulty Report
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Faultys;