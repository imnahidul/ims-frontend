
//30-11-2025,2  update and latest 
// import React, { useEffect, useState, useMemo, useRef } from "react";
// import axios from "axios";
// import { 
//   FaUser, 
//   FaBuilding, 
//   FaPhone, 
//   FaStickyNote, 
//   FaEnvelope, 
//   FaMapMarkerAlt 
// } from "react-icons/fa";
// import jsPDF from "jspdf";
// import "jspdf-autotable";

// const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;

// const Requisitions = () => {
//   const [modalOpen, setModalOpen] = useState(false);
//   const [editId, setEditId] = useState(null);
//   const [editMode, setEditMode] = useState(true);
//   const [requisitions, setRequisitions] = useState([]);
//   const [filtered, setFiltered] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [page, setPage] = useState(1);
//   const PAGE_SIZE = 20;

//   const readerRef = useRef(null);

//   const emptyForm = {
//     requisition_no: "",
//     issue_date: "",
//     required_date: "",
//     status: "Pending",
//     requested_by: { name: "", department: "", phone: "", email: "", address: "" },
//     purpose: "",
//     logo: null,
//     //items: [{ id: uid(), item: "", description: "", qty: 1, unit: "pcs", price: 0, total: 0 }],
//     items: [{ id: uid(), item: "", description: "", qty: 1, unit: "pcs", price: 0, total: 0 }],
//     notes: "",
//   };

//   const [form, setForm] = useState(emptyForm);

//   const formatDate = (d) => (d ? new Date(d).toLocaleDateString("en-GB") : "");
//   const todayISO = () => new Date().toISOString().split("T")[0];

//   const resetForm = () => {
//     setForm({ ...emptyForm });
//     setEditId(null);
//     setEditMode(true);
//   };

//   const generateRequisitionNo = () => {
//     const nums = requisitions
//       .map((r) => parseInt(r.requisition_no?.match(/(\d+)$/)?.[0] || 0))
//       .filter(Boolean)
//       .sort((a, b) => b - a);
//     const next = (nums[0] || 0) + 1;
//     return `REQ-${String(next).padStart(4, "0")}`;
//   };

//   const totals = useMemo(() => {
//     const updatedItems = form.items.map((it) => {
//       const qty = Number(it.qty) || 0;
//       const price = Number(it.price) || 0;
//       const total = Number((qty * price).toFixed(2));
//       return { ...it, qty, price, total };
//     });
//     const subtotal = Number(updatedItems.reduce((s, i) => s + i.total, 0).toFixed(2));
//     const total = subtotal;
//     return { items: updatedItems, subtotal, total };
//   }, [form.items]);

//   const fetchRequisitions = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get("http://localhost:3000/api/requisition", {
//         headers: { Authorization: `Bearer ${localStorage.getItem("pos-token")}` },
//       });
//       setRequisitions(res.data.requisitions || []);
//       setFiltered(res.data.requisitions || []);
//     } catch (err) {
//       alert("Failed to load requisitions");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRequisitions();
//   }, []);

//   useEffect(() => {
//     const term = searchTerm.toLowerCase().trim();
//     const filteredData = term
//       ? requisitions.filter((r) =>
//           [r.requisition_no, r.requested_by?.name, r.requested_by?.department, r.purpose]
//             .some((f) => f?.toLowerCase().includes(term))
//         )
//       : requisitions;
//     setFiltered(filteredData);
//     setPage(1);
//   }, [searchTerm, requisitions]);

//   const pagesCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
//   const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

//   const handleFormChange = (e) => {
//     const { name, value } = e.target;
//     if (name.includes(".")) {
//       const [parent, key] = name.split(".");
//       setForm((p) => ({ ...p, [parent]: { ...p[parent], [key]: value } }));
//     } else {
//       setForm((p) => ({ ...p, [name]: value }));
//     }
//   };

//   const handleItemChange = (id, field, value) => {
//     setForm((p) => ({
//       ...p,
//       items: p.items.map((it) =>
//         it.id === id
//           ? { ...it, [field]: field === "qty" || field === "price" ? Number(value) || 0 : value }
//           : it
//       ),
//     }));
//   };

//   const addItem = () =>
//     setForm((p) => ({
//       ...p,
//       items: [...p.items, { id: uid(), item: "", description: "", qty: 1, unit: "pcs", price: 0, total: 0 }],
//     }));

//   const removeItem = (id) =>
//     setForm((p) => ({ ...p, items: p.items.filter((i) => i.id !== id) }));

//   const openAddModal = () => {
//     resetForm();
//     setForm((f) => ({
//       ...f,
//       requisition_no: generateRequisitionNo(),
//       issue_date: todayISO(),
//     }));
//     setModalOpen(true);
//   };

//   const openEditModal = (req) => {
//     const itemsWithId = (req.items || []).map((it) => ({ ...it, id: it.id || uid() }));
//     setForm({
//       ...emptyForm,
//       ...req,
//       items: itemsWithId.length > 0 ? itemsWithId : [{ id: uid(), item: "", description: "", qty: 1, unit: "pcs", price: 0, total: 0 }],
//       issue_date: req.issue_date ? new Date(req.issue_date).toISOString().split("T")[0] : "",
//       required_date: req.required_date ? new Date(req.required_date).toISOString().split("T")[0] : "",
//       logo: req.logo || null,
//     });
//     setEditId(req._id);
//     setEditMode(req.status === "Pending");
//     setModalOpen(true);
//   };

//   const previewSaved = (req) => {
//     const itemsWithId = (req.items || []).map((it) => ({ ...it, id: it.id || uid() }));
//     setForm({
//       ...emptyForm,
//       ...req,
//       items: itemsWithId.length > 0 ? itemsWithId : [{ id: uid(), item: "", description: "", qty: 1, unit: "pcs", price: 0, total: 0 }],
//       issue_date: req.issue_date ? new Date(req.issue_date).toISOString().split("T")[0] : "",
//       required_date: req.required_date ? new Date(req.required_date).toISOString().split("T")[0] : "",
//       logo: req.logo || null,
//     });
//     setEditId(req._id);
//     setEditMode(false);
//     setModalOpen(true);
//   };

//   const handleLogoUpload = (e) => {
//     const file = e.target.files?.[0];
//     if (!file || !editMode) return;

//     if (readerRef.current) {
//       try { readerRef.current.abort(); } catch {} 
//     }

//     const reader = new FileReader();
//     readerRef.current = reader;
//     reader.onload = (ev) => {
//       setForm((p) => ({ ...p, logo: ev.target.result }));
//       readerRef.current = null;
//     };
//     reader.onerror = () => { readerRef.current = null; };
//     reader.readAsDataURL(file);
//   };

//   useEffect(() => {
//     return () => {
//       if (readerRef.current && typeof readerRef.current.abort === "function") {
//         try { readerRef.current.abort(); } catch {}
//       }
//     };
//   }, []);

//   const handleSave = async (e) => {
//     e.preventDefault();
//     if (form.items.some((i) => !i.item.trim())) {
//       alert("Please fill all item names");
//       return;
//     }

//     const payload = {
//       ...form,
//       logo: form.logo,
//       items: totals.items.map(({ id, item, description, qty, unit, price, total }) => ({
//         id, item, description, qty, unit, price, total,
//       })),
//       subtotal: totals.subtotal,
//       total: totals.total,
//       issue_date: form.issue_date ? new Date(form.issue_date).toISOString() : null,
//       required_date: form.required_date ? new Date(form.required_date).toISOString() : null,
//     };

//     try {
//       if (editId) {
//         await axios.put(`http://localhost:3000/api/requisition/${editId}`, payload, {
//           headers: { Authorization: `Bearer ${localStorage.getItem("pos-token")}` },
//         });
//       } else {
//         await axios.post("http://localhost:3000/api/requisition/add", payload, {
//           headers: { Authorization: `Bearer ${localStorage.getItem("pos-token")}` },
//         });
//       }
//       alert("Requisition saved!");
//       setModalOpen(false);
//       await fetchRequisitions();
//       setTimeout(resetForm, 200);
//     } catch (err) {
//       alert("Save failed: " + (err.response?.data?.message || err.message));
//       console.error(err);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!confirm("Delete this requisition permanently?")) return;
//     try {
//       await axios.delete(`http://localhost:3000/api/requisition/${id}`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem("pos-token")}` },
//       });
//       fetchRequisitions();
//     } catch (err) {
//       alert("Delete failed");
//       console.error(err);
//     }
//   };

//   const handlePrint = () => {
//     const content = document.getElementById("printable-requisition");
//     const win = window.open("", "_blank");
//     if (!win) return;
//     win.document.write(`
//       <!DOCTYPE html>
//       <html>
//         <head>
//           <meta charset="utf-8" />
//           <title>${form.requisition_no}</title>
//           <script src="https://cdn.tailwindcss.com"></script>
//           <style>
//             @page { margin: 0.5in; }
//             @media print {
//               .print-grid-cols-2 { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 4rem; }
//             }
//           </style>
//         </head>
//         <body class="p-12 font-sans text-sm">
//           ${content ? content.innerHTML : ""}
//         </body>
//       </html>
//     `);
//     win.document.close();
//     win.focus();
//     setTimeout(() => {
//       try {
//         win.print();
//         setTimeout(() => win.close(), 500);
//       } catch (err) {
//         console.error("Print error", err);
//       }
//     }, 250);
//   };

//   const generatePDF = () => {
//     const doc = new jsPDF("p", "pt", "a4");
//     const pageWidth = doc.internal.pageSize.getWidth();
//     const margin = 50;
//     let y = 80;

//     if (form.logo && typeof form.logo === "string" && form.logo.startsWith("data:image/")) {
//       const isJpeg = form.logo.startsWith("data:image/jpeg") || form.logo.startsWith("data:image/jpg");
//       const format = isJpeg ? "JPEG" : "PNG";
//       try {
//         doc.addImage(form.logo, format, margin, y - 50, 140, 90);
//       } catch (err) {
//         console.warn("Failed to add logo to PDF", err);
//       }
//     }

//     doc.setFontSize(11);
//     const right = pageWidth - margin;
//     doc.text(`Requisition #: ${form.requisition_no}`, right, y, { align: "right" });
//     doc.text(`Issue Date: ${formatDate(form.issue_date)}`, right, y + 20, { align: "right" });
//     doc.text(`Required By: ${formatDate(form.required_date)}`, right, y + 40, { align: "right" });
//     doc.text(`Status: ${form.status}`, right, y + 60, { align: "right" });

//     y += 100;

//     const colWidth = (pageWidth - margin * 2 - 60) / 2;
//     doc.setFontSize(12).setFont("helvetica", "bold");
//     doc.text("Requested By", margin, y);
//     doc.setFont("helvetica", "normal");
//     y += 20;

//     const drawCol = (data, x) => {
//       let cy = y;
//       [data.name, data.department, data.phone, data.email, data.address]
//         .filter(Boolean)
//         .forEach((line) => {
//           doc.text(line || "", x, cy);
//           cy += 18;
//         });
//     };
//     drawCol(form.requested_by, margin);

//     y += 120;

//     doc.autoTable({
//       startY: y,
//       head: [["Item", "Description", "Qty", "Unit", "Price", "Total"]],
//       body: totals.items.map((i, idx) => [
//         i.item || "",
//         i.description || "",
//         i.qty || 0,
//         i.unit || "",
//         Number(i.price || 0).toFixed(2),
//         Number(totals.items[idx]?.total || 0).toFixed(2),
//       ]),
//       theme: "grid",
//       styles: { fontSize: 10 },
//       headStyles: { fillColor: [240, 240, 240] },
//     });

//     y = doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY + 50 : y + 200;
//     const tx = pageWidth - margin - 120;

//     doc.setFontSize(14).setFont("helvetica", "bold");
//     doc.text("Total Amount:", tx, y);
//     doc.text(`BDT ${totals.total.toFixed(2)}`, pageWidth - margin, y, { align: "right" });

//     if (form.purpose) {
//       y += 50;
//       doc.setFont("helvetica", "bold").text("Purpose:", margin, y);
//       doc.setFont("helvetica", "normal");
//       const splitPurpose = doc.splitTextToSize(form.purpose, pageWidth - margin * 2);
//       y += 20;
//       splitPurpose.forEach((line) => {
//         doc.text(line, margin, y);
//         y += 18;
//       });
//     }

//     if (form.notes) {
//       y += 20;
//       doc.setFont("helvetica", "bold").text("Notes:", margin, y);
//       doc.setFont("helvetica", "normal");
//       const splitNotes = doc.splitTextToSize(form.notes, pageWidth - margin * 2);
//       y += 20;
//       splitNotes.forEach((line) => {
//         doc.text(line, margin, y);
//         y += 18;
//       });
//     }

//     doc.save(`${form.requisition_no || "requisition"}.pdf`);
//   };

//   return (
//     <div className="p-6 min-h-screen bg-gray-50">
//       <h1 className="text-3xl font-bold mb-6">Requisitions</h1>

//       <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
//         <input
//           type="text"
//           placeholder="Search by Req No, Name, Department..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="border rounded-lg px-4 py-2 w-full md:w-96 focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//         <button onClick={openAddModal} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
//           + New Requisition
//         </button>
//       </div>

//       {loading ? (
//         <div className="text-center py-10">Loading...</div>
//       ) : (
//         <>
//           <div className="overflow-x-auto bg-white rounded-lg shadow">
//             <table className="w-full text-sm">
//               <thead className="bg-gray-100">
//                 <tr>
//                   {["No", "Req No", "Requested By", "Department", "Date", "Required By", "Total", "Status", "Actions"].map((h) => (
//                     <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {paginated.map((r, i) => (
//                   <tr key={r._id} className="border-t hover:bg-gray-50 transition">
//                     <td className="px-4 py-3">{(page - 1) * PAGE_SIZE + i + 1}</td>
//                     <td className="px-4 py-3 font-medium">{r.requisition_no}</td>
//                     <td className="px-4 py-3">{r.requested_by?.name || "-"}</td>
//                     <td className="px-4 py-3">{r.requested_by?.department || "-"}</td>
//                     <td className="px-4 py-3">{formatDate(r.issue_date)}</td>
//                     <td className="px-4 py-3">{formatDate(r.required_date)}</td>
//                     <td className="px-4 py-3 font-medium">BDT {Number(r.total || 0).toFixed(2)}</td>
//                     <td className="px-4 py-3">
//                       <span className={`px-2 py-1 rounded text-xs font-medium ${
//                         r.status === "Pending" ? "bg-orange-100 text-orange-800" :
//                         r.status === "Approved" ? "bg-green-100 text-green-800" :
//                         r.status === "Rejected" ? "bg-red-100 text-red-800" :
//                         "bg-purple-100 text-purple-800"
//                       }`}>
//                         {r.status}
//                       </span>
//                     </td>
//                     <td className="px-4 py-3 space-x-2">
//                       <button 
//                         onClick={() => openEditModal(r)}
//                         disabled={r.status !== "Pending"}
//                         className={`px-3 py-1 rounded text-white text-xs ${
//                           r.status === "Pending" 
//                             ? "bg-yellow-600 hover:bg-yellow-700" 
//                             : "bg-gray-400 cursor-not-allowed"
//                         }`}
//                       >
//                         Edit
//                       </button>
//                       <button 
//                         onClick={() => handleDelete(r._id)} 
//                         className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
//                       >
//                         Delete
//                       </button>
//                       <button 
//                         onClick={() => previewSaved(r)} 
//                         className="px-3 py-1 bg-indigo-600 text-white rounded text-xs hover:bg-indigo-700"
//                       >
//                         View / Print
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           <div className="flex justify-between items-center mt-6">
//             <div className="text-sm text-gray-600">Page {page} of {pagesCount}</div>
//             <div className="space-x-3">
//               <button 
//                 disabled={page <= 1} 
//                 onClick={() => setPage(p => Math.max(1, p - 1))} 
//                 className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-100"
//               >
//                 Previous
//               </button>
//               <button 
//                 disabled={page >= pagesCount} 
//                 onClick={() => setPage(p => Math.min(p + 1, pagesCount))} 
//                 className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-100"
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         </>
//       )}

//       {/*  ESTIMATES LAYOUT + REQUISITIONS DATA & SPACING */}
//       {modalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-60 flex items-start justify-center z-50 overflow-y-auto p-4 pt-20">
//           <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full relative">
//             <button 
//               onClick={() => { 
//                 setModalOpen(false); 
//                 setTimeout(resetForm, 150); 
//               }} 
//               className="absolute top-1 right-2 text-4xl font-bold text-gray-500 hover:text-red-400 z-10"
//             >
//               ×
//             </button>

//             <form onSubmit={handleSave}>
//               <div id="printable-requisition" className="p-12 text-sm"> {/*  REQUISITION SPACING */}
//                 {/*  ESTIMATES HEADER LAYOUT */}
//                 <div className="flex justify-between items-start mb-4">
//                   <div>
//                     {form.logo ? (
//                       <img src={form.logo} alt="Company Logo" className="max-w-70 h-auto" />
//                     ) : (
//                       <div className="w-48 h-32 border-2 border-dashed border-gray-400 flex items-center justify-center text-gray-500 rounded">
//                         Company Logo
//                       </div>
//                     )}
//                     {editMode && (
//                       <div className="mt-4">
//                         <input
//                           type="file"
//                           accept="image/*"
//                           onChange={handleLogoUpload}
//                           className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
//                         />
//                       </div>
//                     )}
//                   </div>

//                   <div className="text-right">
//                     <h1 className="text-4xl font-bold mb-3 text-gray-800">REQUISITION</h1>
//                      <p className="text-lg mt-2 text-gray-600">Internal Material / Purchase Request</p>
//                     <div className="space-y-2">
//                       <div><strong>Requisition #:</strong> <span className="font-bold text-lg">{form.requisition_no}</span></div>
//                       <div><strong>Issue Date:</strong> {editMode ? 
//                         <input type="date" name="issue_date" value={form.issue_date} onChange={handleFormChange} className="border-b-2 border-gray-400 ml-2 focus:border-blue-600 outline-none" /> 
//                         : formatDate(form.issue_date)
//                       }</div>
//                       <div><strong>Required By:</strong> {editMode ? 
//                         <input type="date" name="required_date" value={form.required_date} onChange={handleFormChange} className="border-b-2 border-gray-400 ml-2 focus:border-blue-600 outline-none" /> 
//                         : formatDate(form.required_date)
//                       }</div>
//                       <div><strong>Status:</strong> {editMode ? 
//                         <select name="status" value={form.status} onChange={handleFormChange} className="ml-2 border rounded px-3 py-1">
//                           <option>Pending</option>
//                           <option>Approved</option>
//                           <option>Rejected</option>
//                           <option>Ordered</option>
//                         </select> 
//                         : <span className="font-medium ml-2">{form.status}</span>
//                       }</div>
//                     </div>
//                     <div className="text-xl font-bold mt-1">
//                       <span>Total Amount</span>
//                       <span>(BDT): {totals.total.toFixed(2)}</span>
//                     </div>
//                   </div>
//                 </div>

//                 {/*  ESTIMATES 2-COLUMN LAYOUT + REQUISITIONS DATA */}
//                 <div className="grid grid-cols-1 print:grid-cols-2 justify-between mb-12 gap-0 print:gap-48">
//                   {["requested_by"].map((section) => (
//                     <div key={section}>
//                       <h3 className="font-bold text-lg mb-4">Requested By</h3>
//                       {["name", "department", "phone", "email", "address"].map((field) => (
//                         <div key={field} className="flex items-start gap-3 mb-1">
//                           {field === "name" && <FaUser className="mt-1 text-gray-600" />}
//                           {field === "department" && <FaBuilding className="mt-1 text-gray-600" />} 
//                           {field === "email" && <FaEnvelope className="mt-1 text-gray-600" />}
//                           {field === "phone" && <FaPhone className="mt-1 text-gray-600" />}
//                           {field === "address" && <FaMapMarkerAlt className="mt-1 text-gray-600" />}
//                           {editMode ? (
//                             <input
//                               name={`${section}.${field}`}  
//                               value={form[section][field] || ""}
//                               onChange={handleFormChange}
//                               className="flex-1 border-b-2 border-gray-300 focus:border-blue-600 outline-none py-1"
//                               placeholder={field.replace(/_/g, " ").charAt(0).toUpperCase() + field.replace(/_/g, " ").slice(1)}
//                             />
//                           ) : (
//                             <span className="flex-1">{form[section][field] || "-"}</span>
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                   ))}
//                 </div>

//                 {/*  PURPOSE - Above Items Table */}
//                 <div className="mb-6">
//                   <strong className="text-lg block mb-3">Purpose of Requisition</strong>
//                   {editMode ? (
//                     <textarea 
//                       name="purpose" 
//                       value={form.purpose} 
//                       onChange={handleFormChange} 
//                       rows={3} 
//                       className="w-full rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" 
//                       placeholder="e.g., Office supplies for new branch"
//                     />
//                   ) : (
//                     <div className="whitespace-pre-wrap text-gray-700 p-3 bg-gray-50 rounded-lg">{form.purpose || "No purpose specified."}</div>
//                   )}
//                 </div>

//                 {/*  ITEMS TABLE - ESTIMATES STYLE + UNIT COLUMN */}
//                 <table className="w-auto border-collapse mb-6">
//                   <thead>
//                     <tr className="bg-gray-100">
//                       <th className="border border-gray-300 px-4 py-3 text-left">Item</th>
//                       <th className="border border-gray-300 px-4 py-3 text-left">Description</th>
//                       <th className="border border-gray-300 px-4 py-3 text-center w-20">Qty</th>
//                       <th className="border border-gray-300 px-4 py-3 text-center w-20">Unit</th>
//                       <th className="border border-gray-300 px-4 py-3 text-right w-24">Price</th>
//                       <th className="border border-gray-300 px-4 py-3 text-right w-28">Total</th>
//                       {editMode && <th className="border border-gray-300 px-4 py-3 print:hidden w-24">Action</th>}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {form.items.map((item) => (
//                       <tr key={item.id}>
//                         <td className="px-2 py-2">
//                           {editMode ? 
//                             <input value={item.item} onChange={(e) => handleItemChange(item.id, "item", e.target.value)} className="w-full outline-none" placeholder="Item" /> 
//                             : <span>{item.item || "-"}</span>
//                           }
//                         </td>
//                         <td className="px-3 py-1">
//                           {editMode ? 
//                             <input value={item.description} onChange={(e) => handleItemChange(item.id, "description", e.target.value)} className="w-full outline-none" placeholder="Description" /> 
//                             : <span>{item.description || "-"}</span>
//                           }
//                         </td>
//                         <td className="px-3 py-2 text-center">
//                           {editMode ? 
//                             <input type="number" value={item.qty} onChange={(e) => handleItemChange(item.id, "qty", e.target.value)} className="w-16 text-center outline-none" min="0" /> 
//                             : <span>{item.qty || 0}</span>
//                           }
//                         </td>
//                         <td className="px-3 py-2 text-center">
//                           {editMode ? 
//                             <input value={item.unit} onChange={(e) => handleItemChange(item.id, "unit", e.target.value)} className="w-16 text-center outline-none" placeholder="pcs" /> 
//                             : <span>{item.unit || "-"}</span>
//                           }
//                         </td>
//                         <td className="px-3 py-2 text-right">
//                           {editMode ? 
//                             <input type="number" step="0.01" value={item.price} onChange={(e) => handleItemChange(item.id, "price", e.target.value)} className="w-20 text-right outline-none" min="0" /> 
//                             : <span>{Number(item.price || 0).toFixed(2)}</span>
//                           }
//                         </td>
//                         <td className="px-3 py-2 text-right font-medium">
//                           BDT {Number(totals.items.find(i => i.id === item.id)?.total || 0).toFixed(2)}
//                         </td>
//                         {editMode && (
//                           <td className="px-3 py-2 text-center print:hidden">
//                             <button type="button" onClick={() => removeItem(item.id)} className="text-red-600 hover:underline text-sm">Remove</button>
//                           </td>
//                         )}
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>

//                 {editMode && (
//                   <button type="button" onClick={addItem} className="mb-8 px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 print:hidden">
//                     + Add Item
//                   </button>
//                 )}

//                 {/*  TOTALS - ESTIMATES STYLE */}
//                 {/* <div className="w-96 ml-auto border-t-4 border-double border-gray-800 pt-6">
//                   <div className="flex justify-between text-lg"><span>Subtotal</span><span>BDT{totals.subtotal.toFixed(2)}</span></div>
//                   <div className="flex justify-between text-2xl font-bold border-t-4 border-double border-gray-800 pt-4 mt-4">
//                     <span>Total Amount</span>
//                     <span>(BDT) {totals.total.toFixed(2)}</span>
//                   </div>
//                 </div> */}
//               <div className="w-96 ml-auto border-t-4 border-double border-gray-800 pt-6">
//                   <div className="flex justify-between text-xl font-bold">
//                     <span>Total Amount</span>
//                     <span>BDT {totals.total.toFixed(2)}</span>
//                   </div>
//                 </div>

//                 {/*  NOTES */}
//                 <div className="mt-3">
//                   <strong className="text-lg block mb-3">Notes / Remarks</strong>
//                   {editMode ? (
//                     <textarea name="notes" value={form.notes} onChange={handleFormChange} rows={4} className="w-full rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
//                   ) : (
//                     <div className="whitespace-pre-wrap text-gray-700">{form.notes || "No notes added."}</div>
//                   )}
//                 </div>
//               </div>

//               {/* ACTION BUTTONS */}
//               <div className="p-3 border-t bg-gray-50 flex justify-center gap-6 print:hidden flex-wrap">
//                 <button type="button" onClick={handlePrint} className="px-8 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition text-lg">
//                   Print
//                 </button>
//                 {/* <button type="button" onClick={generatePDF} className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-lg">
//                   Download PDF
//                 </button> */}
//                 {editMode && (
//                   <button type="submit" className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-lg font-medium">
//                     {editId ? "Update" : "Save"} Requisition
//                   </button>
//                 )}
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Requisitions;

/////////2-12-2025 //////Running 14-12-25//////////// update No price and Total amount removed//////////
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

const Requisitions = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editMode, setEditMode] = useState(true);
  const [requisitions, setRequisitions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 20;

  const readerRef = useRef(null);

  const emptyForm = {
    requisition_no: "",
    issue_date: "",
    required_date: "",
    status: "Pending",
    requested_by: { name: "", department: "", phone: "", email: "", address: "" },
    purpose: "",
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

  const generateRequisitionNo = () => {
    const nums = requisitions
      .map((r) => parseInt(r.requisition_no?.match(/(\d+)$/)?.[0] || 0))
      .filter(Boolean)
      .sort((a, b) => b - a);
    const next = (nums[0] || 0) + 1;
    return `REQ-${String(next).padStart(4, "0")}`;
  };

  // Fixed: removed the extra { here
  const fetchRequisitions = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3000/api/requisition", {
        headers: { Authorization: `Bearer ${localStorage.getItem("pos-token")}` },
      });
      setRequisitions(res.data.requisitions || []);
      setFiltered(res.data.requisitions || []);
    } catch (err) {
      alert("Failed to load requisitions");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequisitions();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase().trim();
    const filteredData = term
      ? requisitions.filter((r) =>
          [
            r.requisition_no,
            r.requested_by?.name,
            r.requested_by?.department,
            r.purpose,
          ].some((f) => f?.toLowerCase().includes(term))
        )
      : requisitions;
    setFiltered(filteredData);
    setPage(1);
  }, [searchTerm, requisitions]);

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
      requisition_no: generateRequisitionNo(),
      issue_date: todayISO(),
    }));
    setModalOpen(true);
  };

  const openEditModal = (req) => {
    const itemsWithId = (req.items || []).map((it) => ({ ...it, id: it.id || uid() }));
    setForm({
      ...emptyForm,
      ...req,
      items: itemsWithId.length > 0 ? itemsWithId : [{ id: uid(), item: "", description: "", qty: 1, unit: "pcs" }],
      issue_date: req.issue_date ? new Date(req.issue_date).toISOString().split("T")[0] : "",
      required_date: req.required_date ? new Date(req.required_date).toISOString().split("T")[0] : "",
      logo: req.logo || null,
    });
    setEditId(req._id);
    setEditMode(req.status === "Pending");
    setModalOpen(true);
  };

  const previewSaved = (req) => {
    const itemsWithId = (req.items || []).map((it) => ({ ...it, id: it.id || uid() }));
    setForm({
      ...emptyForm,
      ...req,
      items: itemsWithId.length > 0 ? itemsWithId : [{ id: uid(), item: "", description: "", qty: 1, unit: "pcs" }],
      issue_date: req.issue_date ? new Date(req.issue_date).toISOString().split("T")[0] : "",
      required_date: req.required_date ? new Date(req.required_date).toISOString().split("T")[0] : "",
      logo: req.logo || null,
    });
    setEditId(req._id);
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
      issue_date: form.issue_date ? new Date(form.issue_date).toISOString() : null,
      required_date: form.required_date ? new Date(form.required_date).toISOString() : null,
    };

    try {
      if (editId) {
        await axios.put(`http://localhost:3000/api/requisition/${editId}`, payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem("pos-token")}` },
        });
      } else {
        await axios.post("http://localhost:3000/api/requisition/add", payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem("pos-token")}` },
        });
      }
      alert("Requisition saved!");
      setModalOpen(false);
      await fetchRequisitions();
      resetForm();
    } catch (err) {
      alert("Save failed: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete permanently?")) return;
    try {
      await axios.delete(`http://localhost:3000/api/requisition/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("pos-token")}` },
      });
      fetchRequisitions();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const handlePrint = () => {
    const content = document.getElementById("printable-requisition");
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`
      <!DOCTYPE html>
      <html><head><meta charset="utf-8"><title>${form.requisition_no}</title>
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
    doc.text(`Requisition #: ${form.requisition_no}`, right, y, { align: "right" });
    doc.text(`Issue Date: ${formatDate(form.issue_date)}`, right, y + 20, { align: "right" });
    doc.text(`Required By: ${formatDate(form.required_date)}`, right, y + 40, { align: "right" });
    doc.text(`Status: ${form.status}`, right, y + 60, { align: "right" });

    y += 120;
    doc.setFontSize(12).setFont("helvetica", "bold");
    doc.text("Requested By", margin, y);
    doc.setFont("helvetica", "normal");
    y += 20;

    [form.requested_by.name, form.requested_by.department, form.requested_by.phone, form.requested_by.email, form.requested_by.address]
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
    if (form.purpose) {
      doc.setFont("helvetica", "bold").text("Purpose:", margin, y);
      doc.setFont("helvetica", "normal");
      doc.splitTextToSize(form.purpose, pageWidth - margin * 2).forEach((line) => {
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

    doc.save(`${form.requisition_no || "requisition"}.pdf`);
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Requisitions</h1>

      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <input
          type="text"
          placeholder="Search by Req No, Name, Department..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full md:w-96 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button onClick={openAddModal} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
          + New Requisition
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
                  {["No", "Req No", "Requested By", "Department", "Date", "Required By", "Status", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((r, i) => (
                  <tr key={r._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3">{(page - 1) * PAGE_SIZE + i + 1}</td>
                    <td className="px-4 py-3 font-medium">{r.requisition_no}</td>
                    <td className="px-4 py-3">{r.requested_by?.name || "-"}</td>
                    <td className="px-4 py-3">{r.requested_by?.department || "-"}</td>
                    <td className="px-4 py-3">{formatDate(r.issue_date)}</td>
                    <td className="px-4 py-3">{formatDate(r.required_date)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        r.status === "Pending" ? "bg-orange-100 text-orange-800" :
                        r.status === "Approved" ? "bg-green-100 text-green-800" :
                        r.status === "Rejected" ? "bg-red-100 text-red-800" :
                        "bg-purple-100 text-purple-800"
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 space-x-2">
                      <button
                        onClick={() => openEditModal(r)}
                        disabled={r.status !== "Pending"}
                        className={`px-3 py-1 rounded text-white text-xs ${
                          r.status === "Pending" ? "bg-yellow-600 hover:bg-yellow-700" : "bg-gray-400 cursor-not-allowed"
                        }`}
                      >
                        Edit
                      </button>
                      <button onClick={() => handleDelete(r._id)} className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700">
                        Delete
                      </button>
                      <button onClick={() => previewSaved(r)} className="px-3 py-1 bg-indigo-600 text-white rounded text-xs hover:bg-indigo-700">
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
              <div id="printable-requisition" className="p-12 text-sm">
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
                    <h1 className="text-4xl font-bold mb-3 text-gray-800">REQUISITION</h1>
                    <p className="text-lg text-gray-600">Internal Material Request</p>
                    <div className="space-y-2 mt-4">
                      <div><strong>Requisition #:</strong> <span className="font-bold text-lg">{form.requisition_no}</span></div>
                            {/* Requisition past date disable l-1170 & l-1173 */}
                      {/* <div><strong>Issue Date:</strong> {editMode ? <input type="date" name="issue_date" value={form.issue_date} onChange={handleFormChange} className="border-b-2 border-gray-400 ml-2 focus:border-blue-600 outline-none" /> : formatDate(form.issue_date)}</div> */}
                      <div><strong>Issue Date:</strong> {editMode ? <input type="date" name="issue_date" value={form.issue_date} onChange={handleFormChange} min={new Date().toISOString().split("T")[0]} className="border-b-2 border-gray-400 ml-2 focus:border-blue-600 outline-none" /> : formatDate(form.issue_date)}</div>
                      <div><strong>Required By:</strong> {editMode ? <input type="date" name="required_date" value={form.required_date} onChange={handleFormChange} min={new Date().toISOString().split("T")[0]} className="border-b-2 border-gray-400 ml-2 focus:border-blue-600 outline-none" /> : formatDate(form.required_date)}</div>
                      {/* <div><strong>Required By:</strong> {editMode ? <input type="date" name="required_date" value={form.required_date} onChange={handleFormChange} className="border-b-2 border-gray-400 ml-2 focus:border-blue-600 outline-none" /> : formatDate(form.required_date)}</div> */}
                      <div><strong>Status:</strong> {editMode ? (
                        <select name="status" value={form.status} onChange={handleFormChange} className="ml-2 border rounded px-3 py-1">
                          <option>Pending</option>
                          <option>Approved</option>
                          <option>Rejected</option>
                          <option>Ordered</option>
                        </select>
                      ) : <span className="font-medium ml-2">{form.status}</span>}</div>
                    </div>
                  </div>
                </div>

                {/* Requested By */}
                <div className="grid grid-cols-1 print:grid-cols-2 gap-12 mb-12 print:gap-48">
                  <div>
                    <h3 className="font-bold text-lg mb-4">Requested By</h3>
                    {["name", "department", "phone", "email", "address"].map((field) => (
                      <div key={field} className="flex items-start gap-3 mb-2">
                        {field === "name" && <FaUser className="mt-1 text-gray-600" />}
                        {field === "department" && <FaBuilding className="mt-1 text-gray-600" />}
                        {field === "phone" && <FaPhone className="mt-1 text-gray-600" />}
                        {field === "email" && <FaEnvelope className="mt-1 text-gray-600" />}
                        {field === "address" && <FaMapMarkerAlt className="mt-1 text-gray-600" />}
                        {editMode ? (
                          <input
                            name={`requested_by.${field}`}
                            value={form.requested_by[field] || ""}
                            onChange={handleFormChange}
                            className="flex-1 border-b-2 border-gray-300 focus:border-blue-600 outline-none py-1"
                            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                          />
                        ) : (
                          <span className="flex-1">{form.requested_by[field] || "-"}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Purpose */}
                <div className="mb-8">
                  <strong className="text-lg block mb-3">Purpose of Requisition</strong>
                  {editMode ? (
                    <textarea
                      name="purpose"
                      value={form.purpose}
                      onChange={handleFormChange}
                      rows={3}
                      className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="e.g., Office supplies for new branch setup"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg text-gray-700">{form.purpose || "No purpose specified."}</div>
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
                        <td className="  px-4 py-3">
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
                        <td className=" px-4 py-3">
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
                        <td className=" px-4 py-3 text-center">
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
                        <td className=" px-4 py-3 text-center">
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
                          <td className=" px-4 py-3 text-center print:hidden">
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
                <div className="mt-12">
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
                </div>
              </div>

              {/* Buttons */}
              <div className="p-4 border-t bg-gray-50 flex justify-center gap-6 print:hidden">
                <button type="button" onClick={handlePrint} className="px-8 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 text-lg">
                  Print
                </button>

                {editMode && (
                  <button type="submit" className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 text-lg font-medium">
                    {editId ? "Update" : "Save"} Requisition
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

export default Requisitions;