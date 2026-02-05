////////////31/01f-2026/////////////corrections item indexing but saving//////

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

const GatePass = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editMode, setEditMode] = useState(true);
  const [gatePasses, setGatePasses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 20;

  const readerRef = useRef(null);

  const emptyForm = {
    gate_pass_no: "",
    date: "",
    type: "Returnable",
    office_address: "",
    location: "",
    phone: "",
    hotline: "",
    telephone: "",
    logo: null,
    reported_by: { name: "", department: "", phone: "", email: "", address: "" },
    items: [{ id: uid(), description: "", qty: 1, unit: "pcs", remark: "" }],
  };

  const [form, setForm] = useState(emptyForm);

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString("en-GB") : "");
  const todayISO = () => new Date().toISOString().split("T")[0];

  const resetForm = () => {
    setForm({ ...emptyForm });
    setEditId(null);
    setEditMode(true);
  };

  const generateGatePassNo = () => {
    const nums = gatePasses
      .map((g) => parseInt(g.gate_pass_no?.match(/(\d+)$/)?.[0] || 0))
      .filter(Boolean)
      .sort((a, b) => b - a);
    const next = (nums[0] || 0) + 1;
    return `GP-${String(next).padStart(4, "0")}`;
  };

  const fetchGatePasses = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://90.90.91.34:5000/api/gatepass", {
        headers: { Authorization: `Bearer ${localStorage.getItem("pos-token")}` },
      });
      setGatePasses(res.data.gatePasses || []);
      setFiltered(res.data.gatePasses || []);
    } catch (err) {
      alert("Failed to load gate passes");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGatePasses();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase().trim();
    const filteredData = term
      ? gatePasses.filter((g) =>
          [
            g.gate_pass_no,
            g.reported_by?.name,
            g.reported_by?.department,
          ].some((f) => f?.toLowerCase().includes(term))
        )
      : gatePasses;
    setFiltered(filteredData);
    setPage(1);
  }, [searchTerm, gatePasses]);

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
      items: [...p.items, { id: uid(), description: "", qty: 1, unit: "pcs", remark: "" }],
    }));

  const removeItem = (id) =>
    setForm((p) => ({ ...p, items: p.items.filter((i) => i.id !== id) }));

  const openAddModal = () => {
    resetForm();
    setForm((f) => ({
      ...f,
      gate_pass_no: generateGatePassNo(),
      date: todayISO(),
    }));
    setModalOpen(true);
  };

  const openEditModal = (gatePass) => {
    const itemsWithId = (gatePass.items || []).map((it) => ({ ...it, id: it.id || uid() }));
    setForm({
      ...emptyForm,
      ...gatePass,
      items: itemsWithId.length > 0 ? itemsWithId : [{ id: uid(), description: "", qty: 1, unit: "pcs", remark: "" }],
      date: gatePass.date ? new Date(gatePass.date).toISOString().split("T")[0] : "",
      logo: gatePass.logo || null,
    });
    setEditId(gatePass._id);
    setEditMode(true);
    setModalOpen(true);
  };

  const previewSaved = (gatePass) => {
    const itemsWithId = (gatePass.items || []).map((it) => ({ ...it, id: it.id || uid() }));
    setForm({
      ...emptyForm,
      ...gatePass,
      items: itemsWithId.length > 0 ? itemsWithId : [{ id: uid(), description: "", qty: 1, unit: "pcs", remark: "" }],
      date: gatePass.date ? new Date(gatePass.date).toISOString().split("T")[0] : "",
      logo: gatePass.logo || null,
    });
    setEditId(gatePass._id);
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
    if (form.items.some((i) => !i.description.trim())) {
      alert("Please fill description for all items");
      return;
    }

    const payload = {
      ...form,
      items: form.items.map(({ id, description, qty, unit, remark }) => ({
        id,
        description,
        qty,
        unit,
        remark,
      })),
      date: form.date ? new Date(form.date).toISOString() : null,
    };

    try {
      if (editId) {
        await axios.put(`http://90.90.91.34:5000/api/gatepass/${editId}`, payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem("pos-token")}` },
        });
      } else {
        await axios.post("http://90.90.91.34:5000/api/gatepass/add", payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem("pos-token")}` },
        });
      }
      alert("Gate Pass saved!");
      setModalOpen(false);
      await fetchGatePasses();
      resetForm();
    } catch (err) {
      alert("Save failed: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete permanently?")) return;
    try {
      await axios.delete(`http://90.90.91.34:5000/api/gatepass/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("pos-token")}` },
      });
      fetchGatePasses();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const handlePrint = () => {
    const content = document.getElementById("printable-gate-pass");
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`
      <!DOCTYPE html>
      <html><head><meta charset="utf-8"><title>${form.gate_pass_no}</title>
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
    doc.text(`Gate Pass #: ${form.gate_pass_no}`, right, y, { align: "right" });
    doc.text(`Type: ${form.type}`, right, y + 20, { align: "right" });
    doc.text(`Date: ${formatDate(form.date)}`, right, y + 40, { align: "right" });

    y += 100;
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
      head: [["No", "Description", "Qty", "Unit", "Remark"]],
      body: form.items.map((i, index) => [
        index + 1,
        i.description || "",
        i.qty || 0,
        i.unit || "pcs",
        i.remark || ""
      ]),
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [240, 240, 240] },
    });

    y = doc.lastAutoTable.finalY + 50;
    const sigWidth = (pageWidth - margin * 2) / 4 - 20;
    ["Received By", "Issued By", "Recommended By", "Approved By"].forEach((title, idx) => {
      const x = margin + idx * (sigWidth + 20);
      doc.line(x, y, x + sigWidth, y);
      doc.text(title, x, y + 20);
    });

    doc.save(`${form.gate_pass_no || "gatepass"}.pdf`);
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Gate Passes</h1>

      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <input
          type="text"
          placeholder="Search by Gate Pass No, Name, Department..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full md:w-96 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button onClick={openAddModal} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
          + New Gate Pass
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  {["No", "Gate Pass No", "Reported By", "Department", "Type", "Date", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((g, i) => (
                  <tr key={g._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3">{(page - 1) * PAGE_SIZE + i + 1}</td>
                    <td className="px-4 py-3 font-medium">{g.gate_pass_no}</td>
                    <td className="px-4 py-3">{g.reported_by?.name || "-"}</td>
                    <td className="px-4 py-3">{g.reported_by?.department || "-"}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        g.type === "Returnable" ? "bg-green-100 text-green-800" : "bg-purple-100 text-purple-800"
                      }`}>
                        {g.type}
                      </span>
                    </td>
                    <td className="px-4 py-3">{formatDate(g.date)}</td>
                    <td className="px-4 py-3 space-x-2">
                      <button
                        onClick={() => openEditModal(g)}
                        className="px-3 py-1 bg-yellow-600 text-white rounded text-xs hover:bg-yellow-700"
                      >
                        Edit
                      </button>
                      <button onClick={() => handleDelete(g._id)} className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700">
                        Delete
                      </button>
                      <button onClick={() => previewSaved(g)} className="px-3 py-1 bg-indigo-600 text-white rounded text-xs hover:bg-indigo-700">
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
              <div id="printable-gate-pass" className="p-12 text-sm">
                {/* Header */}
                <div className="flex justify-between items-start mb-8">
                  <div>
                    {form.logo ? (
                      <img src={form.logo} alt="Logo" className="max-w-70 h-auto" />
                    ) : (
                      <div className="w-48 h-32 border-2 border-dashed border-gray-400 rounded flex items-center justify-center text-gray-500">
                        Company Logo
                      </div>
                    )}
                    {editMode && (
                      <div className="mt-4">
                        <input type="file" accept="image/*" onChange={handleLogoUpload} className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-600 file:text-white" />
                      </div>
                    )}
                  </div>

                  <div className="text-right">
                    <h1 className="text-4xl font-bold mb-3 text-gray-800">GATE PASS</h1>
                    <p className="text-lg text-gray-600">Material Movement Authorization</p>

                    <div className="space-y-2 mt-4">
                      <h4>Arman Center, House-305, Ward-02 Sahid amin Uddin</h4>
                      <h4>Road, Lahiripara, Gopalpur, pabna-6600</h4>
                      <h4>Phone: 01790775011 , Telephone: 02588843762</h4>
                      <h4>Hotline: 09610969594</h4>
                    </div>
                  </div>
                </div>

                {/* Info Row */}
                <div className="flex justify-between items-center mb-4 text-base font-medium">
                  <div>
                    <strong>Gate Pass #:</strong>{" "}
                    <span className="font-bold text-lg">{form.gate_pass_no}</span>
                  </div>

                  <div>
                    <strong>Type:</strong>{" "}
                    {editMode ? (
                      <select
                        name="type"
                        value={form.type}
                        onChange={handleFormChange}
                        className="ml-2 border rounded px-3 py-1 focus:border-blue-600 outline-none"
                      >
                        <option value="Returnable">Returnable</option>
                        <option value="Non-Returnable">Non-Returnable</option>
                      </select>
                    ) : (
                      <span className="font-medium ml-2">{form.type}</span>
                    )}
                  </div>

                  <div>
                    <strong>Date:</strong>{" "}
                    {editMode ? (
                      <input
                        type="date"
                        name="date"
                        value={form.date}
                        onChange={handleFormChange}
                        min={todayISO()}
                        className="border-b-2 border-gray-400 ml-2 focus:border-blue-600 outline-none"
                      />
                    ) : (
                      formatDate(form.date)
                    )}
                  </div>
                </div>

                {/* Reported By */}
                <div className="mb-4">
                  <h3 className="font-bold text-lg mb-2">The Following Item's are allowed to issue in favour of :</h3>
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

                {/* Items Table */}
                <table className="w-full border-collapse mb-8">
                  <thead>
                    <tr className="bg-gray-100 text-sm">
                      <th className="border border-gray-300 px-4 py-3 text-left w-20 print:w-20">No</th>
                      <th className="border border-gray-300 px-4 py-3 text-left w-64 print:w-64">Description</th>
                      <th className="border border-gray-300 px-4 py-3 text-center w-24">Qty</th>
                      <th className="border border-gray-300 px-4 py-3 text-center w-24">Unit</th>
                      <th className="border border-gray-300 px-4 py-3 text-left">Remark</th>
                      {editMode && <th className="border border-gray-300 px-4 py-3 print:hidden w-24">Action</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {form.items.map((item, index) => (
                      <tr key={item.id}>
                        <td className=" border-gray-300 px-4 py-3 text-center font-medium">
                          {index + 1}
                        </td>
                        <td className=" border-gray-300 px-4 py-3">
                          {editMode ? (
                            <textarea
                              value={item.description}
                              onChange={(e) => handleItemChange(item.id, "description", e.target.value)}
                              className="w-full outline-none resize-y min-h-[2.5rem]"
                              placeholder="Item name / Description"
                            />
                          ) : (
                            item.description || "-"
                          )}
                        </td>
                        <td className=" border-gray-300 px-4 py-3 text-center">
                          {editMode ? (
                            <input
                              type="number"
                              value={item.qty}
                              onChange={(e) => handleItemChange(item.id, "qty", e.target.value)}
                              className="w-20 text-center outline-none "
                              min="1"
                            />
                          ) : (
                            item.qty || 0
                          )}
                        </td>
                        <td className=" border-gray-300 px-4 py-3 text-center">
                          {editMode ? (
                            <input
                              value={item.unit}
                              onChange={(e) => handleItemChange(item.id, "unit", e.target.value)}
                              className="w-20 text-center outline-none "
                              placeholder="pcs"
                            />
                          ) : (
                            item.unit || "pcs"
                          )}
                        </td>
                        <td className=" border-gray-300 px-4 py-3">
                          {editMode ? (
                            <input
                              value={item.remark}
                              onChange={(e) => handleItemChange(item.id, "remark", e.target.value)}
                              className="w-full outline-none"
                              placeholder="Remark"
                            />
                          ) : (
                            item.remark || "-"
                          )}
                        </td>
                        {editMode && (
                          <td className=" border-gray-300 px-4 py-3 text-center print:hidden">
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
                  <button type="button" onClick={addItem} className="mb-1 px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 print:hidden">
                    + Add Item
                  </button>
                )}

                {/* Signatures */}
              
                <div className=" grid grid-cols-4 gap-6 mt-12 border-t pt-12">
                  {["Received By", "Issued By", "Recommended By", "Approved By"].map((title) => (
                    <div key={title} className="text-center">
                      <div className="h-20 border-b-2 border-gray-400 mb-2"></div>
                      <p className="font-semibold">{title}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="p-4 border-t bg-gray-50 flex justify-center gap-6 print:hidden">
                <button type="button" onClick={handlePrint} className="px-8 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 text-lg">
                  Print
                </button>
                {editMode && (
                  <button type="submit" className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 text-lg font-medium">
                    {editId ? "Update" : "Save"} Gate Pass
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

export default GatePass;

/////here is the  code//////////