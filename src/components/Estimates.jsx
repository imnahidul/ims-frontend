// import React from "react";

// const Estimates = () => {
// return (
//     <div>
//        <h2>Estimates Data</h2>
//     </div>
// )
// };
// export default Estimates;


// =========================Below one is more good 20-11-2025 ==================================

///////////test 22,23,24-11-2025  multi page ok//////////////////////////////////////////////

// import React, { useEffect, useState, useMemo, useRef } from "react";
// import axios from "axios";
// import {
//   FaBuilding,
//   FaUser,
//   FaEnvelope,
//   FaPhone,
//   FaMapMarkerAlt,
// } from "react-icons/fa";
// import jsPDF from "jspdf";
// import "jspdf-autotable";

// // Small unique id generator (no extra deps)
// const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;

// const Estimates = () => {
//   const [modalOpen, setModalOpen] = useState(false);
//   const [editId, setEditId] = useState(null);
//   const [estimates, setEstimates] = useState([]);
//   const [filtered, setFiltered] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [editMode, setEditMode] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [page, setPage] = useState(1);
//   const PAGE_SIZE = 20;

//   const readerRef = useRef(null);

//   const emptyForm = {
//     estimate_no: "",
//     issue_date: "",
//     expire_date: "",
//     status: "Draft",
//     logo: null, // base64 data URL
//     estimate_to: { company_name: "", client_name: "", email: "", phone: "", address: "" },
//     pay_to: { company_name: "", client_name: "", email: "", phone: "", address: "" },
//     items: [{ id: uid(), item: "", description: "", qty: 1, price: 0, total: 0 }],
//     discountPercent: 0,
//     taxPercent: 0,
//     notes: "",
//     reference_name_for_note: "",
//     reference_mobile_for_note: "",
//     reference_address_for_note: "",
//     subtotal: 0,
//     discountAmt: 0,
//     taxAmt: 0,
//     total: 0,
//   };

//   const [form, setForm] = useState(emptyForm);

//   const formatDate = (d) => (d ? new Date(d).toLocaleDateString("en-GB") : "");

//   const resetForm = () => {
//     setForm({ ...emptyForm });
//     setEditId(null);
//     setEditMode(true);
//   };

//   const generateEstimateNo = () => {
//     const nums = estimates
//       .map((e) => {
//         const m = e.estimate_no?.match(/(\d+)$/);
//         return m ? parseInt(m[0]) : 0;
//       })
//       .sort((a, b) => b - a);
//     const next = (nums[0] || 0) + 1;
//     return `EST-${String(next).padStart(4, "0")}`;
//   };

//   // Recalculate totals - memoized for performance
//   const totals = useMemo(() => {
//     const items = form.items.map((it) => {
//       const qty = Number(it.qty || 0);
//       const price = Number(it.price || 0);
//       const total = +(qty * price).toFixed(2);
//       return { ...it, qty, price, total };
//     });
//     const subtotal = +items.reduce((a, b) => a + b.total, 0).toFixed(2);
//     const discountAmt = +(subtotal * (Number(form.discountPercent || 0) / 100)).toFixed(2);
//     const taxable = subtotal - discountAmt;
//     const taxAmt = +(taxable * (Number(form.taxPercent || 0) / 100)).toFixed(2);
//     const total = +(taxable + taxAmt).toFixed(2);
//     return { items, subtotal, discountAmt, taxAmt, total };
//   }, [form.items, form.discountPercent, form.taxPercent]);

//   const fetchEstimates = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get("http://localhost:5000/api/estimate", {
//         headers: { Authorization: `Bearer ${localStorage.getItem("pos-token")}` },
//       });
//       setEstimates(res.data.estimates || []);
//       setFiltered(res.data.estimates || []);
//     } catch (err) {
//       console.error("Fetch error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchEstimates();
//   }, []);

//   useEffect(() => {
//     const term = searchTerm.toLowerCase().trim();
//     const filteredData = term
//       ? estimates.filter(
//           (e) =>
//             e.estimate_no?.toLowerCase().includes(term) ||
//             e.estimate_to?.company_name?.toLowerCase().includes(term) ||
//             e.estimate_to?.client_name?.toLowerCase().includes(term)
//         )
//       : estimates;
//     setFiltered(filteredData);
//     setPage(1);
//   }, [searchTerm, estimates]);

//   // ensure at least 1 page (prevents 'Page 1 of 0')
//   const pagesCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
//   const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

//   const handleFormChange = (e) => {
//     const { name, value } = e.target;
//     // dotted names for nested objects (estimate_to.company_name)
//     if (name.includes(".")) {
//       const [parent, key] = name.split(".");
//       setForm((p) => ({ ...p, [parent]: { ...p[parent], [key]: value } }));
//     } else {
//       // normalize numeric inputs
//       if (name === "discountPercent" || name === "taxPercent") {
//         setForm((p) => ({ ...p, [name]: Number(value) }));
//       } else {
//         setForm((p) => ({ ...p, [name]: value }));
//       }
//     }
//   };

//   const handleItemChange = (idx, field, rawValue) => {
//     setForm((p) => {
//       const items = [...p.items];
//       const val = field === "qty" || field === "price" ? Number(rawValue) : rawValue;
//       items[idx] = { ...items[idx], [field]: val };
//       return { ...p, items };
//     });
//   };

//   const addItem = () =>
//     setForm((p) => ({
//       ...p,
//       items: [...p.items, { id: uid(), item: "", description: "", qty: 1, price: 0, total: 0 }],
//     }));
//   const removeItem = (i) => setForm((p) => ({ ...p, items: p.items.filter((_, idx) => idx !== i) }));

//   // Logo upload - saves as base64
//   const handleLogoUpload = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     // abort previous reader if exists
//     if (readerRef.current) {
//       try {
//         readerRef.current.abort();
//       } catch (err) {
//         // ignore
//       }
//     }
//     const reader = new FileReader();
//     readerRef.current = reader;
//     reader.onload = (ev) => {
//       setForm((p) => ({ ...p, logo: ev.target.result }));
//       readerRef.current = null;
//     };
//     reader.onerror = () => {
//       console.error("Logo read error");
//       readerRef.current = null;
//     };
//     reader.readAsDataURL(file);
//   };

//   useEffect(() => {
//     return () => {
//       // cleanup any active FileReader
//       if (readerRef.current && typeof readerRef.current.abort === "function") {
//         try {
//           readerRef.current.abort();
//         } catch (err) {
//           // ignore
//         }
//       }
//     };
//   }, []);

//   const openAddModal = () => {
//     resetForm();
//     setForm((f) => ({ ...f, estimate_no: generateEstimateNo() }));
//     setModalOpen(true);
//   };

//   const openEditModal = (est) => {
//     const itemsWithId = (est.items || []).map((it) => ({ ...it, id: it.id || uid() }));

//     setForm({
//       ...emptyForm,
//       ...est,
//       items: itemsWithId.length ? itemsWithId : [{ id: uid(), item: "", description: "", qty: 1, price: 0, total: 0 }],
//       issue_date: est.issue_date?.split("T")[0] || "",
//       expire_date: est.expire_date?.split("T")[0] || "",
//     });
//     setEditId(est._id);
//     setEditMode(est.status === "Draft");
//     setModalOpen(true);
//   };

//   const previewSaved = (est) => {
//     const itemsWithId = (est.items || []).map((it) => ({ ...it, id: it.id || uid() }));
//     setForm({
//       ...emptyForm,
//       ...est,
//       items: itemsWithId.length ? itemsWithId : [{ id: uid(), item: "", description: "", qty: 1, price: 0, total: 0 }],
//       issue_date: est.issue_date?.split("T")[0] || "",
//       expire_date: est.expire_date?.split("T")[0] || "",
//     });
//     setEditId(est._id);
//     setEditMode(false);
//     setModalOpen(true);
//   };

//   const handleSave = async (e) => {
//     e.preventDefault();

//     const payload = {
//       ...form,
//       items: totals.items.map((it) => ({ id: it.id, item: it.item, description: it.description, qty: it.qty, price: it.price, total: it.total })),
//       subtotal: totals.subtotal,
//       discountAmt: totals.discountAmt,
//       taxAmt: totals.taxAmt,
//       total: totals.total,
//       issue_date: form.issue_date ? new Date(form.issue_date).toISOString() : null,
//       expire_date: form.expire_date ? new Date(form.expire_date).toISOString() : null,
//     };

//     try {
//       if (editId) {
//         await axios.put(`http://localhost:5000/api/estimate/${editId}`, payload, {
//           headers: { Authorization: `Bearer ${localStorage.getItem("pos-token")}` },
//         });
//       } else {
//         await axios.post("http://localhost:5000/api/estimate/add", payload, {
//           headers: { Authorization: `Bearer ${localStorage.getItem("pos-token")}` },
//         });
//       }
//       alert("Estimate saved successfully!");
//       setModalOpen(false);
//       // await refresh before resetting form to avoid flicker
//       await fetchEstimates();
//       // slightly delay clearing to avoid visible input flicker while modal animates
//       setTimeout(resetForm, 150);
//     } catch (err) {
//       alert("Save failed: " + (err.response?.data?.message || err.message));
//       console.error(err);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window?.confirm || !window.confirm("Delete this estimate permanently?")) return;
//     try {
//       await axios.delete(`http://localhost:5000/api/estimate/${id}`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem("pos-token")}` },
//       });
//       await fetchEstimates();
//     } catch (err) {
//       alert("Delete failed");
//     }
//   };

//   // Print Function
//   const handlePrint = () => {
//     const content = document.getElementById("printable-estimate");
//     const win = window.open("", "_blank");
//     if (!win) return;
//     win.document.write(`
//       <!DOCTYPE html>
//       <html>
//         <head>
//           <meta charset="utf-8" />
//             <title>${form.estimate_no}</title>
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
//     // some browsers don't fire onload reliably for windows created this way; use a small timeout
//     setTimeout(() => {
//       try {
//         win.print();
//         setTimeout(() => win.close(), 500);
//       } catch (err) {
//         console.error("Print error", err);
//       }
//     }, 250);
//   };

//   // PDF Generation
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
//     doc.text(`Estimate #: ${form.estimate_no}`, right, y, { align: "right" });
//     doc.text(`Issue Date: ${formatDate(form.issue_date)}`, right, y + 20, { align: "right" });
//     doc.text(`Expiry Date: ${formatDate(form.expire_date)}`, right, y + 40, { align: "right" });
//     doc.text(`Status: ${form.status}`, right, y + 60, { align: "right" });

//     y += 100;

//     const colWidth = (pageWidth - margin * 2 - 60) / 2;
//     doc.setFontSize(12).setFont("helvetica", "bold");
//     doc.text("Estimate To", margin, y);
//     doc.text("Pay To", margin + colWidth + 60, y);
//     doc.setFont("helvetica", "normal");
//     y += 20;

//     const drawCol = (data, x) => {
//       let cy = y;
//       [data.company_name, data.client_name, data.email, data.phone, data.address]
//         .filter(Boolean)
//         .forEach((line) => {
//           doc.text(line || "", x, cy);
//           cy += 18;
//         });
//     };
//     drawCol(form.estimate_to, margin);
//     drawCol(form.pay_to, margin + colWidth + 60);

//     y += 120;

//     doc.autoTable({
//       startY: y,
//       head: [["Item", "Description", "Qty", "Price", "Total"]],
//       body: form.items.map((i, idx) => [
//         i.item || "",
//         i.description || "",
//         i.qty || 0,
//         Number(i.price || 0).toFixed(2),
//         Number(totals.items[idx]?.total || 0).toFixed(2),
//       ]),
//       theme: "grid",
//       styles: { fontSize: 10 },
//       headStyles: { fillColor: [240, 240, 240] },
//     });

//     y = doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY + 50 : y + 200;
//     const tx = pageWidth - margin - 120;

//     doc.setFontSize(11);
//     doc.text("Subtotal:", tx, y);
//     doc.text(totals.subtotal.toFixed(2), pageWidth - margin, y, { align: "right" });

//     if (totals.discountAmt > 0) {
//       y += 20;
//       doc.text(`Discount (${form.discountPercent}%):`, tx, y);
//       doc.text(`-${totals.discountAmt.toFixed(2)}`, pageWidth - margin, y, { align: "right" });
//     }
//     if (totals.taxAmt > 0) {
//       y += 20;
//       doc.text(`Tax (${form.taxPercent}%):`, tx, y);
//       doc.text(totals.taxAmt.toFixed(2), pageWidth - margin, y, { align: "right" });
//     }

//     y += 30;
//     doc.setFontSize(14).setFont("helvetica", "bold");
//     doc.text("Total:", tx, y);
//     doc.text(totals.total.toFixed(2), pageWidth - margin, y, { align: "right" });

//     if (form.notes) {
//       y += 50;
//       doc.setFont("helvetica", "bold").text("Notes:", margin, y);
//       doc.setFont("helvetica", "normal");
//       const splitNotes = doc.splitTextToSize(form.notes, pageWidth - margin * 2);
//       y += 20;
//       splitNotes.forEach((line) => {
//         doc.text(line, margin, y);
//         y += 18;
//       });
//     }

//     doc.save(`${form.estimate_no || "estimate"}.pdf`);
//   };

//   return (
//     <div className="p-6 min-h-screen bg-gray-50">
//       <h1 className="text-3xl font-bold mb-6">Estimates</h1>

//       <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
//         <input
//           type="text"
//           placeholder="Search by Estimate No, Company or Client..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="border rounded-lg px-4 py-2 w-full md:w-96 focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//         <button onClick={openAddModal} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
//           + Add Estimate
//         </button>
//       </div>

//       {loading ? (
//         <div className="text-center py-10">Loading estimates...</div>
//       ) : (
//         <>
//           <div className="overflow-x-auto bg-white rounded-lg shadow">
//             <table className="w-full text-sm">
//               <thead className="bg-gray-100">
//                 <tr>
//                   {[
//                     "No",
//                     "Estimate No",
//                     "Company",
//                     "Client",
//                     "Issue",
//                     "Expiry",
//                     "Total",
//                     "Status",
//                     "Actions",
//                   ].map((h) => (
//                     <th key={h} className="px-4 py-3 text-left font-medium">
//                       {h}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {paginated.map((est, i) => (
//                   <tr key={est._id} className="border-t hover:bg-gray-50 transition">
//                     <td className="px-4 py-3">{(page - 1) * PAGE_SIZE + i + 1}</td>
//                     <td className="px-4 py-3 font-medium">{est.estimate_no}</td>
//                     <td className="px-4 py-3">{est.estimate_to?.company_name || "-"}</td>
//                     <td className="px-4 py-3">{est.estimate_to?.client_name || "-"}</td>
//                     <td className="px-4 py-3">{formatDate(est.issue_date)}</td>
//                     <td className="px-4 py-3">{formatDate(est.expire_date)}</td>
//                     <td className="px-4 py-3 font-medium b">(BDT):{Number(est.total || 0).toFixed(2)}</td>
//                     <td className="px-4 py-3">
//                       <span
//                         className={`px-2 py-1 rounded text-xs font-medium ${
//                           est.status === "Draft"
//                             ? "bg-yellow-100 text-yellow-800"
//                             : est.status === "Sent"
//                             ? "bg-blue-100 text-blue-800"
//                             : est.status === "Approved"
//                             ? "bg-green-100 text-green-800"
//                             : "bg-purple-100 text-purple-800"
//                         }`}
//                       >
//                         {est.status}
//                       </span>
//                     </td>
//                     <td className="px-4 py-3 space-x-2">
//                       <button
//                         onClick={() => openEditModal(est)}
//                         disabled={est.status !== "Draft"}
//                         className={`px-3 py-1 rounded text-white text-xs ${
//                           est.status === "Draft" ? "bg-yellow-600 hover:bg-yellow-700" : "bg-gray-400 cursor-not-allowed"
//                         }`}
//                       >
//                         Edit
//                       </button>
//                       <button onClick={() => handleDelete(est._id)} className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700">
//                         Delete
//                       </button>
//                       <button onClick={() => previewSaved(est)} className="px-3 py-1 bg-indigo-600 text-white rounded text-xs hover:bg-indigo-700">
//                         View / PDF
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
//               <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-100">
//                 Previous
//               </button>
//               <button disabled={page >= pagesCount} onClick={() => setPage((p) => Math.min(p + 1, pagesCount))} className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-100">
//                 Next
//               </button>
//             </div>
//           </div>
//         </>
//       )}

//       {/* MODAL */}
//       {modalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-60 flex items-start justify-center z-50 overflow-y-auto p-4 pt-20">
//           <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full relative">
//             <button
//               onClick={() => { setModalOpen(false); setTimeout(resetForm, 150); }}
//               className="absolute top-4 right-6 text-5xl font-light text-gray-500 hover:text-gray-800 z-10"
//             >
//               ×
//             </button>

//             <form onSubmit={handleSave}>
//               <div id="printable-estimate" className="p-12 text-sm">
//                 {/* Header */}
//                 <div className="flex justify-between items-start mb-12">
//                   <div>
//                     {form.logo ? (
//                       <img src={form.logo} alt="Company Logo" className="max-w-70 h-auto " />
//                     ) : (
//                       <div className="w-48 h-32 border-2 border-dashed border-gray-400 flex items-center justify-center text-gray-500 rounded">
//                         Your Logo Here
//                       </div>
//                     )}
//                     {editMode && (
//                       <div className="mt-4">
//                         <input type="file" accept="image/*" onChange={handleLogoUpload} className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700" />
//                       </div>
//                     )}
//                   </div>
//                   <div className="text-right">
//                     <h1 className="text-4xl font-bold mb-6 text-gray-800">QUOTATION(MMC)</h1>
//                     <div className="space-y-2">
//                       <div><strong>Estimate #:</strong> <span className="font-bold text-lg">{form.estimate_no}</span></div>
//                       <div><strong>Issue Date:</strong> {editMode ? <input type="date" name="issue_date" value={form.issue_date} onChange={handleFormChange} className="border-b-2 border-gray-400 ml-2 focus:border-blue-600 outline-none" /> : formatDate(form.issue_date)}</div>
//                       <div><strong>Expiry Date:</strong> {editMode ? <input type="date" name="expire_date" value={form.expire_date} onChange={handleFormChange} className="border-b-2 border-gray-400 ml-2 focus:border-blue-600 outline-none" /> : formatDate(form.expire_date)}</div>
//                       <div><strong>Status:</strong> {editMode ? (
//                         <select name="status" value={form.status} onChange={handleFormChange} className="ml-2 border rounded px-3 py-1">
//                           <option>Draft</option>
//                           <option>Sent</option>
//                           <option>Approved</option>
//                           <option>Paid</option>
//                         </select>
//                       ) : <span className="font-medium">{form.status}</span>}</div>
//                     </div>
//                   <div className=" text-xl font-bold  mt-3">
//                     <span>Total</span>
//                     <span>(BDT): {totals.total.toFixed(2)}</span>
//                   </div>
//                   </div>

//                 </div>

//                 {/* Estimate To & Pay To */}
//                 <div className="grid grid-cols-1 print:grid-cols-2 gap-16 mb-12 print-gap-20">
//                   {["estimate_to", "pay_to"].map((section) => (
//                     <div key={section}>
//                       <h3 className="font-bold text-lg mb-4">{section === "estimate_to" ? "Estimate To" : "Pay To"}</h3>
//                       {["company_name", "client_name", "email", "phone", "address"].map((field) => (
//                         <div key={field} className="flex items-start gap-3 mb-3">
//                           {field === "company_name" && <FaBuilding className="mt-1 text-gray-600" />}
//                           {field === "client_name" && <FaUser className="mt-1 text-gray-600" />}
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

//                 {/* Items Table */}
//                 <table className="w-full border-collapse mb-8">
//                   <thead>
//                     <tr className="bg-gray-100">
//                       <th className="border border-gray-300 px-4 py-3 text-left">Item</th>
//                       <th className="border border-gray-300 px-4 py-3 text-left">Description</th>
//                       <th className="border border-gray-300 px-4 py-3 text-center w-20">Qty</th>
//                       <th className="border border-gray-300 px-4 py-3 text-right w-24">Price</th>
//                       <th className="border border-gray-300 px-4 py-3 text-right w-28">Total</th>
//                       {editMode && <th className="border border-gray-300 px-4 py-3 print:hidden w-24">Action</th>}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {form.items.map((item, i) => (
//                       <tr key={item.id}>
//                         <td className=" px-4 py-2">
//                           {editMode ? <input value={item.item} onChange={(e) => handleItemChange(i, "item", e.target.value)} className="w-full outline-none" /> : item.item}
//                         </td>
//                         <td className=" px-4 py-2">
//                           {editMode ? <input value={item.description} onChange={(e) => handleItemChange(i, "description", e.target.value)} className="w-full outline-none" /> : item.description}
//                         </td>
//                         <td className=" px-4 py-2 text-center">
//                           {editMode ? <input type="number" value={item.qty} onChange={(e) => handleItemChange(i, "qty", e.target.value)} className="w-16 text-center outline-none" /> : item.qty}
//                         </td>
//                         <td className=" px-4 py-2 text-right">
//                           {editMode ? <input type="number" step="0.01" value={item.price} onChange={(e) => handleItemChange(i, "price", e.target.value)} className="w-20 text-right outline-none" /> : Number(item.price).toFixed(2)}
//                         </td>
//                         <td className=" px-4 py-2 text-right font-medium">
//                         {Number(totals.items[i]?.total || 0).toFixed(2)}
//                         </td>
//                         {editMode && (
//                           <td className=" px-4 py-2 text-center print:hidden">
//                             <button type="button" onClick={() => removeItem(i)} className="text-red-600 hover:underline text-sm">Remove</button>
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

//                 {/* Discount & Tax */}
//                 <div className="flex gap-8 mb-8 justify-end print:hidden">
//                   <div className="flex items-center gap-3 text-lg">
//                     <span>Discount (%)</span>
//                     <input type="number" name="discountPercent" value={form.discountPercent} onChange={handleFormChange} className="w-24 border-2 rounded px-3 py-1 text-right" min="0" max="100" />
//                     <span>Tax (%)</span>
//                     <input type="number" name="taxPercent" value={form.taxPercent} onChange={handleFormChange} className="w-24 border-2 rounded px-3 py-1 text-right" min="0" />
//                   </div>
//                 </div>

//                 {/* Totals */}
//                 <div className="w-96 ml-auto border-t-4 border-double border-gray-800 pt-6">
//                   <div className="flex justify-between text-lg"><span>Subtotal</span><span>BDT{totals.subtotal.toFixed(2)}</span></div>
//                   {totals.discountAmt > 0 && (
//                     <div className="flex justify-between"><span>Discount ({form.discountPercent}%)</span><span>-BDT{totals.discountAmt.toFixed(2)}</span></div>
//                   )}
//                   {totals.taxAmt > 0 && (
//                     <div className="flex justify-between"><span>Tax ({form.taxPercent}%)</span><span>BDT{totals.taxAmt.toFixed(2)}</span></div>
//                   )}
//                   <div className="flex justify-between text-2xl font-bold border-t-4 border-double border-gray-800 pt-4 mt-4">
//                     <span>Total</span>
//                     <span>(BDT) {totals.total.toFixed(2)}</span>
//                   </div>
//                 </div>

//                 {/* Notes */}
//                 <div className="mt-16">
//                   <strong className="text-lg block mb-3">Notes</strong>
//                   {editMode ? (
//                     <textarea name="notes" value={form.notes} onChange={handleFormChange} rows={4} className="w-full  rounded-lg p-4 focus:ring-2 focus:ring-blue-500 outline-none"  />
//                   ) : (
//                     <div className="whitespace-pre-wrap text-gray-700">{form.notes || "No notes added."}</div>
//                   )}
//                 </div>

//                 {/* Reference */}
//                 <div className="mt-8">
//                   <strong className="text-lg block mb-3">Reference</strong>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
//                     {["name", "mobile", "address"].map((type) => (
//                       <div key={type}>
//                         <span className="font-medium">{type.charAt(0).toUpperCase() + type.slice(1)}:</span>
//                         {editMode ? (
//                           <input
//                             name={`reference_${type}_for_note`}
//                             value={form[`reference_${type}_for_note`] || ""}
//                             onChange={handleFormChange}
//                             className="ml-3  w-full max-w-xs pb-1  outline-none"
//                            // placeholder={`Reference ${type}`}
//                           />
//                         ) : (
//                           <span className="ml-3">{form[`reference_${type}_for_note`] || "-"}</span>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               {/* Action Buttons */}
//               <div className="p-6 border-t bg-gray-50 flex justify-center gap-6 print:hidden flex-wrap">
//                 <button type="button" onClick={handlePrint} className="px-8 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition text-lg">
//                   Print
//                 </button>
//                 {/* <button type="button" onClick={generatePDF} className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-lg">
//                   Download PDF
//                 </button> */}
//                 {editMode && (
//                   <button type="submit" className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-lg font-medium">
//                     Save Estimate
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

// export default Estimates;






////test 24,25,26,27,30-11-25////14-12-25/////client and company position swipe /////running//////////
// import React, { useEffect, useState, useMemo, useRef } from "react";
// import axios from "axios";
// import {
//   FaBuilding,
//   FaUser,
//   FaEnvelope,
//   FaPhone,
//   FaMapMarkerAlt,
// } from "react-icons/fa";
// import jsPDF from "jspdf";
// import "jspdf-autotable";

// // Small unique id generator (no extra deps)
// const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;

// const Estimates = () => {
//   const [modalOpen, setModalOpen] = useState(false);
//   const [editId, setEditId] = useState(null);
//   const [estimates, setEstimates] = useState([]);
//   const [filtered, setFiltered] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [editMode, setEditMode] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [page, setPage] = useState(1);
//   const PAGE_SIZE = 20;

//   const readerRef = useRef(null);

//   const emptyForm = {
//     estimate_no: "",
//     issue_date: "",
//     expire_date: "",
//     status: "Draft",
//     logo: null, // base64 data URL
//     estimate_to: { company_name: "", client_name: "", email: "", phone: "", address: "" },
//     pay_to: { company_name: "", client_name: "", email: "", phone: "", address: "" },
//     items: [{ id: uid(), item: "", description: "", qty: 1, price: 0, total: 0 }],
//     discountPercent: 0,
//     taxPercent: 0,
//     notes: "",
//     reference_name_for_note: "",
//     reference_mobile_for_note: "",
//     reference_address_for_note: "",
//     subtotal: 0,
//     discountAmt: 0,
//     taxAmt: 0,
//     total: 0,
//   };

//   const [form, setForm] = useState(emptyForm);

//   const formatDate = (d) => (d ? new Date(d).toLocaleDateString("en-GB") : "");
//  // const todayISO = () => new Date().toISOString().split("T")[0];

//   const resetForm = () => {
//     setForm({ ...emptyForm });
//     setEditId(null);
//     setEditMode(true);
//   };

//   const generateEstimateNo = () => {
//     const nums = estimates
//       .map((e) => {
//         const m = e.estimate_no?.match(/(\d+)$/);
//         return m ? parseInt(m[0]) : 0;
//       })
//       .sort((a, b) => b - a);
//     const next = (nums[0] || 0) + 1;
//     return `EST-${String(next).padStart(4, "0")}`;
//   };

//   // Recalculate totals - memoized for performance
//   const totals = useMemo(() => {
//     const items = form.items.map((it) => {
//       const qty = Number(it.qty || 0);
//       const price = Number(it.price || 0);
//       const total = +(qty * price).toFixed(2);
//       return { ...it, qty, price, total };
//     });
//     const subtotal = +items.reduce((a, b) => a + b.total, 0).toFixed(2);
//     const discountAmt = +(subtotal * (Number(form.discountPercent || 0) / 100)).toFixed(2);
//     const taxable = subtotal - discountAmt;
//     const taxAmt = +(taxable * (Number(form.taxPercent || 0) / 100)).toFixed(2);
//     const total = +(taxable + taxAmt).toFixed(2);
//     return { items, subtotal, discountAmt, taxAmt, total };
//   }, [form.items, form.discountPercent, form.taxPercent]);

//   const fetchEstimates = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get("http://localhost:5000/api/estimate", {
//         headers: { Authorization: `Bearer ${localStorage.getItem("pos-token")}` },
//       });
//       setEstimates(res.data.estimates || []);
//       setFiltered(res.data.estimates || []);
//     } catch (err) {
//       console.error("Fetch error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchEstimates();
//   }, []);

//   useEffect(() => {
//     const term = searchTerm.toLowerCase().trim();
//     const filteredData = term
//       ? estimates.filter(
//           (e) =>
//             e.estimate_no?.toLowerCase().includes(term) ||
//             e.estimate_to?.company_name?.toLowerCase().includes(term) ||
//             e.estimate_to?.client_name?.toLowerCase().includes(term)
//         )
//       : estimates;
//     setFiltered(filteredData);
//     setPage(1);
//   }, [searchTerm, estimates]);

//   // ensure at least 1 page (prevents 'Page 1 of 0')
//   const pagesCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
//   const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

//   const handleFormChange = (e) => {
//     const { name, value } = e.target;
//     // dotted names for nested objects (estimate_to.company_name)
//     if (name.includes(".")) {
//       const [parent, key] = name.split(".");
//       setForm((p) => ({ ...p, [parent]: { ...p[parent], [key]: value } }));
//     } else {
//       // normalize numeric inputs
//       if (name === "discountPercent" || name === "taxPercent") {
//         setForm((p) => ({ ...p, [name]: Number(value) }));
//       } else {
//         setForm((p) => ({ ...p, [name]: value }));
//       }
//     }
//   };

//   const handleItemChange = (idx, field, rawValue) => {
//     setForm((p) => {
//       const items = [...p.items];
//       const val = field === "qty" || field === "price" ? Number(rawValue) : rawValue;
//       items[idx] = { ...items[idx], [field]: val };
//       return { ...p, items };
//     });
//   };

//   const addItem = () =>
//     setForm((p) => ({
//       ...p,
//       items: [...p.items, { id: uid(), item: "", description: "", qty: 1, price: 0, total: 0 }],
//     }));
//   const removeItem = (i) => setForm((p) => ({ ...p, items: p.items.filter((_, idx) => idx !== i) }));

//   // Logo upload - saves as base64
//   const handleLogoUpload = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     // abort previous reader if exists
//     if (readerRef.current) {
//       try {
//         readerRef.current.abort();
//       } catch (err) {
//         // ignore
//       }
//     }
//     const reader = new FileReader();
//     readerRef.current = reader;
//     reader.onload = (ev) => {
//       setForm((p) => ({ ...p, logo: ev.target.result }));
//       readerRef.current = null;
//     };
//     reader.onerror = () => {
//       console.error("Logo read error");
//       readerRef.current = null;
//     };
//     reader.readAsDataURL(file);
//   };

//   useEffect(() => {
//     return () => {
//       // cleanup any active FileReader
//       if (readerRef.current && typeof readerRef.current.abort === "function") {
//         try {
//           readerRef.current.abort();
//         } catch (err) {
//           // ignore
//         }
//       }
//     };
//   }, []);

//   const openAddModal = () => {
//     resetForm();
//     const today = new Date().toISOString().split("T")[0]; // Gives today date
//     setForm((f) => ({ ...f, estimate_no: generateEstimateNo(),
//     issue_date: today,   //  This line makes today's date selected by default  
//      }));
//     setModalOpen(true);
//   };

//   const openEditModal = (est) => {
//     const itemsWithId = (est.items || []).map((it) => ({ ...it, id: it.id || uid() }));

//     setForm({
//       ...emptyForm,
//       ...est,
//       items: itemsWithId.length ? itemsWithId : [{ id: uid(), item: "", description: "", qty: 1, price: 0, total: 0 }],
//       issue_date: est.issue_date?.split("T")[0] || "",
//       expire_date: est.expire_date?.split("T")[0] || "",
//     });
//     setEditId(est._id);
//     setEditMode(est.status === "Draft");
//     setModalOpen(true);
//   };

//   const previewSaved = (est) => {
//     const itemsWithId = (est.items || []).map((it) => ({ ...it, id: it.id || uid() }));
//     setForm({
//       ...emptyForm,
//       ...est,
//       items: itemsWithId.length ? itemsWithId : [{ id: uid(), item: "", description: "", qty: 1, price: 0, total: 0 }],
//       issue_date: est.issue_date?.split("T")[0] || "",
//       expire_date: est.expire_date?.split("T")[0] || "",
//     });
//     setEditId(est._id);
//     setEditMode(false);
//     setModalOpen(true);
//   };

//   const handleSave = async (e) => {
//     e.preventDefault();

//     const payload = {
//       ...form,
//       items: totals.items.map((it) => ({ id: it.id, item: it.item, description: it.description, qty: it.qty, price: it.price, total: it.total })),
//       subtotal: totals.subtotal,
//       discountAmt: totals.discountAmt,
//       taxAmt: totals.taxAmt,
//       total: totals.total,
//       issue_date: form.issue_date ? new Date(form.issue_date).toISOString() : null,
//       expire_date: form.expire_date ? new Date(form.expire_date).toISOString() : null,
//     };

//     try {
//       if (editId) {
//         await axios.put(`http://localhost:5000/api/estimate/${editId}`, payload, {
//           headers: { Authorization: `Bearer ${localStorage.getItem("pos-token")}` },
//         });
//       } else {
//         await axios.post("http://localhost:5000/api/estimate/add", payload, {
//           headers: { Authorization: `Bearer ${localStorage.getItem("pos-token")}` },
//         });
//       }
//       alert("Estimate saved successfully!");
//       setModalOpen(false);
//       // await refresh before resetting form to avoid flicker
//       await fetchEstimates();
//       // slightly delay clearing to avoid visible input flicker while modal animates
//       setTimeout(resetForm, 150);
//     } catch (err) {
//       alert("Save failed: " + (err.response?.data?.message || err.message));
//       console.error(err);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window?.confirm || !window.confirm("Delete this estimate permanently?")) return;
//     try {
//       await axios.delete(`http://localhost:5000/api/estimate/${id}`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem("pos-token")}` },
//       });
//       await fetchEstimates();
//     } catch (err) {
//       alert("Delete failed");
//     }
//   };

//   // Print Function
//   const handlePrint = () => {
//     const content = document.getElementById("printable-estimate");
//     const win = window.open("", "_blank");
//     if (!win) return;
//     win.document.write(`
//       <!DOCTYPE html>
//       <html>
//         <head>
//           <meta charset="utf-8" />
//             <title>${form.estimate_no}</title>
//           <script src="https://cdn.tailwindcss.com"></script>
//           <style>
//             @page { margin: 0.5in; }
//             @media print {
//               .print-grid-cols-2 { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 4rem; }
//             }
//           </style>
//         </head>
//         <body class="p-3 font-sans text-sm">
//           ${content ? content.innerHTML : ""}
//         </body>
//       </html>
//     `);
//     win.document.close();
//     win.focus();
//     // some browsers don't fire onload reliably for windows created this way; use a small timeout
//     setTimeout(() => {
//       try {
//         win.print();
//         setTimeout(() => win.close(), 500);
//       } catch (err) {
//         console.error("Print error", err);
//       }
//     }, 250);
//   };

//   // PDF Generation
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
//     doc.text(`Estimate #: ${form.estimate_no}`, right, y, { align: "right" });
//     doc.text(`Issue Date: ${formatDate(form.issue_date)}`, right, y + 20, { align: "right" });
//     doc.text(`Expiry Date: ${formatDate(form.expire_date)}`, right, y + 40, { align: "right" });
//     doc.text(`Status: ${form.status}`, right, y + 60, { align: "right" });

//     y += 100;

//     const colWidth = (pageWidth - margin * 2 - 60) / 2;
//     doc.setFontSize(12).setFont("helvetica", "bold");
//     doc.text("Estimate To", margin, y);
//     doc.text("Pay To", margin + colWidth + 60, y);
//     doc.setFont("helvetica", "normal");
//     y += 20;

//     const drawCol = (data, x) => {
//       let cy = y;
//       [data.company_name, data.client_name, data.email, data.phone, data.address]
//         .filter(Boolean)
//         .forEach((line) => {
//           doc.text(line || "", x, cy);
//           cy += 18;
//           //cy += 14;
          
//         });
//     };
//     drawCol(form.estimate_to, margin);
//     drawCol(form.pay_to, margin + colWidth + 60);

//     y += 120;

//     doc.autoTable({
//       startY: y,
//       head: [["Item", "Description", "Qty", "Price", "Total"]],
//       body: form.items.map((i, idx) => [
//         i.item || "",
//         i.description || "",
//         i.qty || 0,
//         Number(i.price || 0).toFixed(2),
//         Number(totals.items[idx]?.total || 0).toFixed(2),
//       ]),
//       theme: "grid",
//       styles: { fontSize: 10 },
//       headStyles: { fillColor: [240, 240, 240] },
//     });

//     y = doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY + 50 : y + 200;
//     const tx = pageWidth - margin - 120;

//     doc.setFontSize(11);
//     doc.text("Subtotal:", tx, y);
//     doc.text(totals.subtotal.toFixed(2), pageWidth - margin, y, { align: "right" });

//     if (totals.discountAmt > 0) {
//       y += 20;
//       doc.text(`Discount (${form.discountPercent}%):`, tx, y);
//       doc.text(`-${totals.discountAmt.toFixed(2)}`, pageWidth - margin, y, { align: "right" });
//     }
//     if (totals.taxAmt > 0) {
//       y += 20;
//       doc.text(`Tax (${form.taxPercent}%):`, tx, y);
//       doc.text(totals.taxAmt.toFixed(2), pageWidth - margin, y, { align: "right" });
//     }

//     y += 30;
//     doc.setFontSize(14).setFont("helvetica", "bold");
//     doc.text("Total:", tx, y);
//     doc.text(totals.total.toFixed(2), pageWidth - margin, y, { align: "right" });

//     if (form.notes) {
//       y += 50;
//       doc.setFont("helvetica", "bold").text("Notes:", margin, y);
//       doc.setFont("helvetica", "normal");
//       const splitNotes = doc.splitTextToSize(form.notes, pageWidth - margin * 2);
//       y += 20;
//       splitNotes.forEach((line) => {
//         doc.text(line, margin, y);
//         y += 18;
//       });
//     }

//     doc.save(`${form.estimate_no || "estimate"}.pdf`);
//   };

//   return (
//     <div className="p-6 min-h-screen bg-gray-50">
//       <h1 className="text-3xl font-bold mb-6">Estimates</h1>

//       <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
//         <input
//           type="text"
//           placeholder="Search by Estimate No, Company or Client..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="border rounded-lg px-4 py-2 w-full md:w-96 focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//         <button onClick={openAddModal} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
//           + Add Estimate
//         </button>
//       </div>

//       {loading ? (
//         <div className="text-center py-10">Loading estimates...</div>
//       ) : (
//         <>
//           <div className="overflow-x-auto bg-white rounded-lg shadow">
//             <table className="w-full text-sm">
//               <thead className="bg-gray-100">
//                 <tr>
//                   {[
//                     "No",
//                     "Estimate No",
//                     "Company",
//                     "Client",
//                     "Issue",
//                     "Expiry",
//                     "Total",
//                     "Status",
//                     "Actions",
//                   ].map((h) => (
//                     <th key={h} className="px-4 py-3 text-left font-medium">
//                       {h}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {paginated.map((est, i) => (
//                   <tr key={est._id} className="border-t hover:bg-gray-50 transition">
//                     <td className="px-4 py-3">{(page - 1) * PAGE_SIZE + i + 1}</td>
//                     <td className="px-4 py-3 font-medium">{est.estimate_no}</td>
//                     {/* <td className="px-4 py-3">{est.estimate_to?.company_name || "-"}</td> */}
//                     <td className="px-4 py-3">{est.estimate_to?.client_name || "-"}</td>
//                     <td className="px-4 py-3">{est.estimate_to?.company_name || "-"}</td>
//                     <td className="px-4 py-3">{formatDate(est.issue_date)}</td>
//                     <td className="px-4 py-3">{formatDate(est.expire_date)}</td>
//                     <td className="px-4 py-3 font-medium b">(BDT):{Number(est.total || 0).toFixed(2)}</td>
//                     <td className="px-4 py-3">
//                       <span
//                         className={`px-2 py-1 rounded text-xs font-medium ${
//                           est.status === "Draft"
//                             ? "bg-yellow-100 text-yellow-800"
//                             : est.status === "Sent"
//                             ? "bg-blue-100 text-blue-800"
//                             : est.status === "Approved"
//                             ? "bg-green-100 text-green-800"
//                             : "bg-purple-100 text-purple-800"
//                         }`}
//                       >
//                         {est.status}
//                       </span>
//                     </td>
//                     <td className="px-4 py-3 space-x-2">
//                       <button
//                         onClick={() => openEditModal(est)}
//                         disabled={est.status !== "Draft"}
//                         className={`px-3 py-1 rounded text-white text-xs ${
//                           est.status === "Draft" ? "bg-yellow-600 hover:bg-yellow-700" : "bg-gray-400 cursor-not-allowed"
//                         }`}
//                       >
//                         Edit
//                       </button>
//                       <button onClick={() => handleDelete(est._id)} className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700">
//                         Delete
//                       </button>
//                       <button onClick={() => previewSaved(est)} className="px-3 py-1 bg-indigo-600 text-white rounded text-xs hover:bg-indigo-700">
//                         View / PDF
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
//               <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-100">
//                 Previous
//               </button>
//               <button disabled={page >= pagesCount} onClick={() => setPage((p) => Math.min(p + 1, pagesCount))} className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-100">
//                 Next
//               </button>
//             </div>
//           </div>
//         </>
//       )}

//       {/* MODAL */}
//       {modalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-60 flex items-start justify-center z-50 overflow-y-auto p-4 pt-20">
//           <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full relative">
//             <button
//               onClick={() => { setModalOpen(false); setTimeout(resetForm, 150); }}
//               className="absolute top-1 right-2 text-4xl font-bold text-gray-500 hover:text-red-400 z-10"
//             >
//               ×
//             </button>

//             <form onSubmit={handleSave}>
//               <div id="printable-estimate" className="p-6 text-sm">
//                 {/* Header */}
//                 <div className="flex justify-between items-start mb-4">
//                   <div>
//                     {form.logo ? (
//                       <img src={form.logo} alt="Company Logo" className="max-w-70 h-auto " />
//                     ) : (
//                       <div className="w-48 h-32 border-2 border-dashed border-gray-400 flex items-center justify-center text-gray-500 rounded">
//                         Your Logo Here
//                       </div>
//                     )}
//                     {editMode && (
//                       <div className="mt-4">
//                         <input type="file" accept="image/*" onChange={handleLogoUpload} className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700" />
//                       </div>
//                     )}
//                   </div>
//                   <div className="text-right">
//                     <h1 className="text-4xl font-bold mb-3 text-gray-800">QUOTATION(MMC)</h1>
//                     <div className="space-y-2">
//                       <div><strong>Estimate #:</strong> <span className="font-bold text-lg">{form.estimate_no}</span></div>
//                       {/* <div><strong>Issue Date:</strong> {editMode ? <input type="date" name="issue_date" value={form.issue_date} onChange={handleFormChange} className="border-b-2 border-gray-400 ml-2 focus:border-blue-600 outline-none" /> : formatDate(form.issue_date)}</div> */}
//                           <div>  
//                              <strong>Issue Date:</strong>
//                                  {editMode ? (
//                                     <input
//                                     type="date"
//                                      name="issue_date"
//                                      value={form.issue_date}
//                                     onChange={handleFormChange}
//                                     min={new Date().toISOString().split("T")[0]}  //  This prevents past dates
//                                     className="border-b-2 border-gray-400 ml-2 focus:border-blue-600 outline-none rounded px-2"
//                                     required  // Optional: makes it mandatory
//                                        />
//                                      ) : (
//                                    formatDate(form.issue_date)
//                                         )}
//                           </div>

//                       {/* <div><strong>Expiry Date:</strong> {editMode ? <input type="date" name="expire_date" value={form.expire_date} onChange={handleFormChange} className="border-b-2 border-gray-400 ml-2 focus:border-blue-600 outline-none" /> : formatDate(form.expire_date)}</div> */}
//                       <div><strong>Expiry Date:</strong> {editMode ?
//                        <input 
//                        type="date" 
//                        name="expire_date" 
//                        value={form.expire_date} 
//                        onChange={handleFormChange} 
//                        min={new Date().toISOString().split("T")[0]}
//                        className="border-b-2 border-gray-400 ml-2 focus:border-blue-600 outline-none" /> : 
//                        formatDate(form.expire_date)}
//                        </div>
                      
                      
//                       <div><strong>Status:</strong> {editMode ? (
//                         <select name="status" value={form.status} onChange={handleFormChange} className="ml-2 border rounded px-3 py-1">
//                           <option>Draft</option>
//                           <option>Sent</option>
//                           <option>Approved</option>
//                           <option>Paid</option>
//                         </select>
//                       ) : <span className="font-medium">{form.status}</span>}</div>
//                     </div>
//                   <div className=" text-xl font-bold  mt-1">
//                     <span>Total</span>
//                     <span>(BDT): {totals.total.toFixed(2)}</span>
//                   </div>
//                   </div>

//                 </div>

//                 {/* Estimate To & Pay To */}
//                 {/* <div className="grid grid-cols-1 print:grid-cols-2 gap-16 mb-12 print-gap-20"> */}
//                 <div className="grid grid-cols-1 print:grid-cols-2 justify-between mb-12 gap-0 print:gap-48">
//                   {["estimate_to", "pay_to"].map((section) => (
//                     <div key={section}>
//                       <h3 className="font-bold text-lg mb-4">{section === "estimate_to" ? "Estimate To" : "Pay To"}</h3>
//                       {[ "client_name","company_name", "email", "phone", "address"].map((field) => (
//                         <div key={field} className="flex items-start gap-3 mb-1">
//                           {/* {field === "company_name" && <FaBuilding className="mt-1 text-gray-600" />} */}
//                           {field === "client_name" && <FaUser className="mt-1 text-gray-600" />}
//                           {field === "company_name" && <FaBuilding className="mt-1 text-gray-600" />} 
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

//                 {/* Items Table */}
//                 {/* <table className="w-full border-collapse mb-6"> */}
//                 <table className="w-auto border-collapse mb-6">
//                   <thead>
//                     <tr className="bg-gray-100">
//                       <th className="border border-gray-300 px-4 py-3 text-left">Item</th>
//                       <th className="border border-gray-300 px-4 py-3 text-left">Description</th>
//                       <th className="border border-gray-300 px-4 py-3 text-center w-20">Qty</th>
//                       <th className="border border-gray-300 px-4 py-3 text-right w-24">Price</th>
//                       <th className="border border-gray-300 px-4 py-3 text-right w-28">Total</th>
//                       {editMode && <th className="border border-gray-300 px-4 py-3 print:hidden w-24">Action</th>}
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {form.items.map((item, i) => (
//                       <tr key={item.id}>
//                         <td className=" px-2 py-2">
//                           {editMode ? <input value={item.item} onChange={(e) => handleItemChange(i, "item", e.target.value)} className="w-full outline-none" /> : item.item}
//                         </td>
//                         <td className=" px-3 py-1">
//                           {editMode ? <input value={item.description} onChange={(e) => handleItemChange(i, "description", e.target.value)} className="w-full outline-none" /> : item.description}
//                         </td>
//                         <td className=" px-3 py-2 text-center">
//                           {editMode ? <input type="number" value={item.qty} onChange={(e) => handleItemChange(i, "qty", e.target.value)} className="w-16 text-center outline-none" /> : item.qty}
//                         </td>
//                         <td className=" px-3 py-2 text-right">
//                           {editMode ? <input type="number" step="0.01" value={item.price} onChange={(e) => handleItemChange(i, "price", e.target.value)} className="w-20 text-right outline-none" /> : Number(item.price).toFixed(2)}
//                         </td>
//                         <td className=" px-3 py-2 text-right font-medium">
//                         {Number(totals.items[i]?.total || 0).toFixed(2)}
//                         </td>
//                         {editMode && (
//                           <td className=" px-3 py-2 text-center print:hidden">
//                             <button type="button" onClick={() => removeItem(i)} className="text-red-600 hover:underline text-sm">Remove</button>
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

//                 {/* Discount & Tax */}
//                 <div className="flex gap-8 mb-8 justify-end print:hidden">
//                   <div className="flex items-center gap-3 text-lg">
//                     <span>Discount (%)</span>
//                     <input type="number" name="discountPercent" value={form.discountPercent} onChange={handleFormChange} className="w-24 border-2 rounded px-3 py-1 text-right" min="0" max="100" />
//                     <span>Tax (%)</span>
//                     <input type="number" name="taxPercent" value={form.taxPercent} onChange={handleFormChange} className="w-24 border-2 rounded px-3 py-1 text-right" min="0" />
//                   </div>
//                 </div>

//                 {/* Totals */}
//                 <div className="w-96 ml-auto border-t-4 border-double border-gray-800 pt-6">
//                   <div className="flex justify-between text-lg"><span>Subtotal</span><span>BDT{totals.subtotal.toFixed(2)}</span></div>
//                   {totals.discountAmt > 0 && (
//                     <div className="flex justify-between"><span>Discount ({form.discountPercent}%)</span><span>-BDT{totals.discountAmt.toFixed(2)}</span></div>
//                   )}
//                   {totals.taxAmt > 0 && (
//                     <div className="flex justify-between"><span>Tax ({form.taxPercent}%)</span><span>BDT{totals.taxAmt.toFixed(2)}</span></div>
//                   )}
//                   <div className="flex justify-between text-2xl font-bold border-t-4 border-double border-gray-800 pt-4 mt-4">
//                     <span>Total</span>
//                     <span>(BDT) {totals.total.toFixed(2)}</span>
//                   </div>
//                 </div>

//                 {/* Notes */}
//                 <div className="mt-3">
//                   <strong className="text-lg block mb-3">Notes</strong>
//                   {editMode ? (
//                     <textarea name="notes" value={form.notes} onChange={handleFormChange} rows={4} className="w-full  rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"  />
//                   ) : (
//                     <div className="whitespace-pre-wrap text-gray-700">{form.notes || "No notes added."}</div>
//                   )}
//                 </div>

//                 {/* Reference */}
//                 <div className="mt-2">
//                   <strong className="text-lg block mb-1">Reference</strong>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
//                     {["name", "mobile", "address"].map((type) => (
//                       <div key={type}>
//                         <span className="font-medium">{type.charAt(0).toUpperCase() + type.slice(1)}:</span>
//                         {editMode ? (
//                           <input
//                             name={`reference_${type}_for_note`}
//                             value={form[`reference_${type}_for_note`] || ""}
//                             onChange={handleFormChange}
//                             className="ml-3  w-full max-w-xs pb-1  outline-none"
//                             //placeholder={`Reference ${type}`}
//                           />
//                         ) : (
//                           <span className="ml-3">{form[`reference_${type}_for_note`] || "-"}</span>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               {/* Action Buttons */}
//               <div className="p-3 border-t bg-gray-50 flex justify-center gap-6 print:hidden flex-wrap">
//                 <button type="button" onClick={handlePrint} className="px-8 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition text-lg">
//                   Print
//                 </button>
//                 {/* <button type="button" onClick={generatePDF} className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-lg">
//                   Download PDF
//                 </button> */}
//                 {editMode && (
//                   <button type="submit" className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-lg font-medium">
//                     Save Estimate
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

// export default Estimates;


///////////////////////unit box add add//////////////////////////////////////

// import React, { useEffect, useState, useMemo, useRef } from "react";
// import axios from "axios";
// import {
//   FaBuilding,
//   FaUser,
//   FaEnvelope,
//   FaPhone,
//   FaMapMarkerAlt,
// } from "react-icons/fa";
// import jsPDF from "jspdf";
// import "jspdf-autotable";

// const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;

// const Estimates = () => {
//   const [modalOpen, setModalOpen] = useState(false);
//   const [editId, setEditId] = useState(null);
//   const [estimates, setEstimates] = useState([]);
//   const [filtered, setFiltered] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [editMode, setEditMode] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [page, setPage] = useState(1);
//   const PAGE_SIZE = 20;

//   const readerRef = useRef(null);

//   const emptyForm = {
//     estimate_no: "",
//     issue_date: "",
//     expire_date: "",
//     status: "Draft",
//     logo: null,
//     estimate_to: { company_name: "", client_name: "", email: "", phone: "", address: "" },
//     pay_to: { company_name: "", client_name: "", email: "", phone: "", address: "" },
//     items: [{ id: uid(), item: "", description: "", qty: 1, unit: "pcs", price: 0, total: 0 }],
//     discountPercent: 0,
//     taxPercent: 0,
//     notes: "",
//     reference_name_for_note: "",
//     reference_mobile_for_note: "",
//     reference_address_for_note: "",
//     subtotal: 0,
//     discountAmt: 0,
//     taxAmt: 0,
//     total: 0,
//   };

//   const [form, setForm] = useState(emptyForm);

//   const formatDate = (d) => (d ? new Date(d).toLocaleDateString("en-GB") : "");

//   const resetForm = () => {
//     setForm({ ...emptyForm });
//     setEditId(null);
//     setEditMode(true);
//   };

//   const generateEstimateNo = () => {
//     const nums = estimates
//       .map((e) => {
//         const m = e.estimate_no?.match(/(\d+)$/);
//         return m ? parseInt(m[0]) : 0;
//       })
//       .sort((a, b) => b - a);
//     const next = (nums[0] || 0) + 1;
//     return `EST-${String(next).padStart(4, "0")}`;
//   };

//   const totals = useMemo(() => {
//     const items = form.items.map((it) => {
//       const qty = Number(it.qty || 0);
//       const price = Number(it.price || 0);
//       const total = +(qty * price).toFixed(2);
//       return { ...it, qty, price, total };
//     });
//     const subtotal = +items.reduce((a, b) => a + b.total, 0).toFixed(2);
//     const discountAmt = +(subtotal * (Number(form.discountPercent || 0) / 100)).toFixed(2);
//     const taxable = subtotal - discountAmt;
//     const taxAmt = +(taxable * (Number(form.taxPercent || 0) / 100)).toFixed(2);
//     const total = +(taxable + taxAmt).toFixed(2);
//     return { items, subtotal, discountAmt, taxAmt, total };
//   }, [form.items, form.discountPercent, form.taxPercent]);

//   const fetchEstimates = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get("http://localhost:5000/api/estimate", {
//         headers: { Authorization: `Bearer ${localStorage.getItem("pos-token")}` },
//       });
//       setEstimates(res.data.estimates || []);
//       setFiltered(res.data.estimates || []);
//     } catch (err) {
//       console.error("Fetch error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchEstimates();
//   }, []);

//   useEffect(() => {
//     const term = searchTerm.toLowerCase().trim();
//     const filteredData = term
//       ? estimates.filter(
//           (e) =>
//             e.estimate_no?.toLowerCase().includes(term) ||
//             e.estimate_to?.company_name?.toLowerCase().includes(term) ||
//             e.estimate_to?.client_name?.toLowerCase().includes(term)
//         )
//       : estimates;
//     setFiltered(filteredData);
//     setPage(1);
//   }, [searchTerm, estimates]);

//   const pagesCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
//   const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

//   const handleFormChange = (e) => {
//     const { name, value } = e.target;
//     if (name.includes(".")) {
//       const [parent, key] = name.split(".");
//       setForm((p) => ({ ...p, [parent]: { ...p[parent], [key]: value } }));
//     } else {
//       if (name === "discountPercent" || name === "taxPercent") {
//         setForm((p) => ({ ...p, [name]: Number(value) }));
//       } else {
//         setForm((p) => ({ ...p, [name]: value }));
//       }
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

//   const handleLogoUpload = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
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

//   const openAddModal = () => {
//     resetForm();
//     setForm((f) => ({ ...f, estimate_no: generateEstimateNo() }));
//     setModalOpen(true);
//   };

//   const openEditModal = (est) => {
//     const itemsWithId = (est.items || []).map((it) => ({ ...it, id: it.id || uid() }));
//     setForm({
//       ...emptyForm,
//       ...est,
//       items: itemsWithId.length ? itemsWithId : [{ id: uid(), item: "", description: "", qty: 1, unit: "pcs", price: 0, total: 0 }],
//       issue_date: est.issue_date?.split("T")[0] || "",
//       expire_date: est.expire_date?.split("T")[0] || "",
//     });
//     setEditId(est._id);
//     setEditMode(est.status === "Draft");
//     setModalOpen(true);
//   };

//   const previewSaved = (est) => {
//     const itemsWithId = (est.items || []).map((it) => ({ ...it, id: it.id || uid() }));
//     setForm({
//       ...emptyForm,
//       ...est,
//       items: itemsWithId.length ? itemsWithId : [{ id: uid(), item: "", description: "", qty: 1, unit: "pcs", price: 0, total: 0 }],
//       issue_date: est.issue_date?.split("T")[0] || "",
//       expire_date: est.expire_date?.split("T")[0] || "",
//     });
//     setEditId(est._id);
//     setEditMode(false);
//     setModalOpen(true);
//   };

//   const handleSave = async (e) => {
//     e.preventDefault();
//     const payload = {
//       ...form,
//       items: totals.items.map((it) => ({ id: it.id, item: it.item, description: it.description, qty: it.qty, unit: it.unit, price: it.price, total: it.total })),
//       subtotal: totals.subtotal,
//       discountAmt: totals.discountAmt,
//       taxAmt: totals.taxAmt,
//       total: totals.total,
//       issue_date: form.issue_date ? new Date(form.issue_date).toISOString() : null,
//       expire_date: form.expire_date ? new Date(form.expire_date).toISOString() : null,
//     };

//     try {
//       if (editId) {
//         await axios.put(`http://localhost:5000/api/estimate/${editId}`, payload, {
//           headers: { Authorization: `Bearer ${localStorage.getItem("pos-token")}` },
//         });
//       } else {
//         await axios.post("http://localhost:5000/api/estimate/add", payload, {
//           headers: { Authorization: `Bearer ${localStorage.getItem("pos-token")}` },
//         });
//       }
//       alert("Estimate saved successfully!");
//       setModalOpen(false);
//       await fetchEstimates();
//       setTimeout(resetForm, 150);
//     } catch (err) {
//       alert("Save failed: " + (err.response?.data?.message || err.message));
//       console.error(err);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this estimate permanently?")) return;
//     try {
//       await axios.delete(`http://localhost:5000/api/estimate/${id}`, {
//         headers: { Authorization: `Bearer ${localStorage.getItem("pos-token")}` },
//       });
//       await fetchEstimates();
//     } catch (err) {
//       alert("Delete failed");
//     }
//   };

//   const handlePrint = () => {
//     const content = document.getElementById("printable-estimate");
//     const win = window.open("", "_blank");
//     if (!win) return;
//     win.document.write(`
//       <!DOCTYPE html>
//       <html>
//         <head>
//           <meta charset="utf-8" />
//           <title>${form.estimate_no}</title>
//           <script src="https://cdn.tailwindcss.com"></script>
//           <style>
//             @page { margin: 0.5in; }
//             @media print {
//               .print-grid-cols-2 { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 4rem; }
//             }
//           </style>
//         </head>
//         <body class="p-3 font-sans text-sm">
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
//     doc.text(`Estimate #: ${form.estimate_no}`, right, y, { align: "right" });
//     doc.text(`Issue Date: ${formatDate(form.issue_date)}`, right, y + 20, { align: "right" });
//     doc.text(`Expiry Date: ${formatDate(form.expire_date)}`, right, y + 40, { align: "right" });
//     doc.text(`Status: ${form.status}`, right, y + 60, { align: "right" });

//     y += 100;

//     const colWidth = (pageWidth - margin * 2 - 60) / 2;
//     doc.setFontSize(12).setFont("helvetica", "bold");
//     doc.text("Estimate To", margin, y);
//     doc.text("Pay To", margin + colWidth + 60, y);
//     doc.setFont("helvetica", "normal");
//     y += 20;

//     const drawCol = (data, x) => {
//       let cy = y;
//       [data.company_name, data.client_name, data.email, data.phone, data.address]
//         .filter(Boolean)
//         .forEach((line) => {
//           doc.text(line || "", x, cy);
//           cy += 18;
//         });
//     };
//     drawCol(form.estimate_to, margin);
//     drawCol(form.pay_to, margin + colWidth + 60);

//     y += 120;

//     doc.autoTable({
//       startY: y,
//       head: [["Item", "Description", "Qty", "Unit", "Price", "Total"]],
//       body: totals.items.map((i) => [
//         i.item || "",
//         i.description || "",
//         i.qty || 0,
//         i.unit || "",
//         Number(i.price || 0).toFixed(2),
//         Number(i.total || 0).toFixed(2),
//       ]),
//       theme: "grid",
//       styles: { fontSize: 10 },
//       headStyles: { fillColor: [240, 240, 240] },
//     });

//     y = doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY + 50 : y + 200;
//     const tx = pageWidth - margin - 120;

//     doc.setFontSize(11);
//     doc.text("Subtotal:", tx, y);
//     doc.text(totals.subtotal.toFixed(2), pageWidth - margin, y, { align: "right" });

//     if (totals.discountAmt > 0) {
//       y += 20;
//       doc.text(`Discount (${form.discountPercent}%):`, tx, y);
//       doc.text(`-${totals.discountAmt.toFixed(2)}`, pageWidth - margin, y, { align: "right" });
//     }
//     if (totals.taxAmt > 0) {
//       y += 20;
//       doc.text(`Tax (${form.taxPercent}%):`, tx, y);
//       doc.text(totals.taxAmt.toFixed(2), pageWidth - margin, y, { align: "right" });
//     }

//     y += 30;
//     doc.setFontSize(14).setFont("helvetica", "bold");
//     doc.text("Total:", tx, y);
//     doc.text(totals.total.toFixed(2), pageWidth - margin, y, { align: "right" });

//     if (form.notes) {
//       y += 50;
//       doc.setFont("helvetica", "bold").text("Notes:", margin, y);
//       doc.setFont("helvetica", "normal");
//       const splitNotes = doc.splitTextToSize(form.notes, pageWidth - margin * 2);
//       y += 20;
//       splitNotes.forEach((line) => {
//         doc.text(line, margin, y);
//         y += 18;
//       });
//     }

//     doc.save(`${form.estimate_no || "estimate"}.pdf`);
//   };

//   return (
//     <div className="p-6 min-h-screen bg-gray-50">
//       <h1 className="text-3xl font-bold mb-6">Estimates</h1>

//       <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
//         <input
//           type="text"
//           placeholder="Search by Estimate No, Company or Client..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="border rounded-lg px-4 py-2 w-full md:w-96 focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//         <button onClick={openAddModal} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
//           + Add Estimate
//         </button>
//       </div>

//       {loading ? (
//         <div className="text-center py-10">Loading estimates...</div>
//       ) : (
//         <>
//           <div className="overflow-x-auto bg-white rounded-lg shadow">
//             <table className="w-full text-sm">
//               <thead className="bg-gray-100">
//                 <tr>
//                   {["No", "Estimate No", "Client", "Company", "Issue", "Expiry", "Total", "Status", "Actions"].map((h) => (
//                     <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {paginated.map((est, i) => (
//                   <tr key={est._id} className="border-t hover:bg-gray-50 transition">
//                     <td className="px-4 py-3">{(page - 1) * PAGE_SIZE + i + 1}</td>
//                     <td className="px-4 py-3 font-medium">{est.estimate_no}</td>
//                     <td className="px-4 py-3">{est.estimate_to?.client_name || "-"}</td>
//                     <td className="px-4 py-3">{est.estimate_to?.company_name || "-"}</td>
//                     <td className="px-4 py-3">{formatDate(est.issue_date)}</td>
//                     <td className="px-4 py-3">{formatDate(est.expire_date)}</td>
//                     <td className="px-4 py-3 font-medium">(BDT): {Number(est.total || 0).toFixed(2)}</td>
//                     <td className="px-4 py-3">
//                       <span className={`px-2 py-1 rounded text-xs font-medium ${
//                         est.status === "Draft" ? "bg-yellow-100 text-yellow-800" :
//                         est.status === "Sent" ? "bg-blue-100 text-blue-800" :
//                         est.status === "Approved" ? "bg-green-100 text-green-800" :
//                         "bg-purple-100 text-purple-800"
//                       }`}>
//                         {est.status}
//                       </span>
//                     </td>
//                     <td className="px-4 py-3 space-x-2">
//                       <button onClick={() => openEditModal(est)} disabled={est.status !== "Draft"}
//                         className={`px-3 py-1 rounded text-white text-xs ${est.status === "Draft" ? "bg-yellow-600 hover:bg-yellow-700" : "bg-gray-400 cursor-not-allowed"}`}>
//                         Edit
//                       </button>
//                       <button onClick={() => handleDelete(est._id)} className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700">
//                         Delete
//                       </button>
//                       <button onClick={() => previewSaved(est)} className="px-3 py-1 bg-indigo-600 text-white rounded text-xs hover:bg-indigo-700">
//                         View / PDF
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
//               <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-100">
//                 Previous
//               </button>
//               <button disabled={page >= pagesCount} onClick={() => setPage((p) => Math.min(p + 1, pagesCount))} className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-100">
//                 Next
//               </button>
//             </div>
//           </div>
//         </>
//       )}

//       {modalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-60 flex items-start justify-center z-50 overflow-y-auto p-4 pt-20">
//           <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full relative">
//             <button onClick={() => { setModalOpen(false); setTimeout(resetForm, 150); }}
//               className="absolute top-1 right-2 text-4xl font-bold text-gray-500 hover:text-red-400 z-10">
//               ×
//             </button>

//             <form onSubmit={handleSave}>
//               <div id="printable-estimate" className="p-6 text-sm">
//                 <div className="flex justify-between items-start mb-4">
//                   <div>
//                     {form.logo ? (
//                       <img src={form.logo} alt="Company Logo" className="max-w-70 h-auto" />
//                     ) : (
//                       <div className="w-48 h-32 border-2 border-dashed border-gray-400 flex items-center justify-center text-gray-500 rounded">
//                         Your Logo Here
//                       </div>
//                     )}
//                     {editMode && (
//                       <div className="mt-4">
//                         <input type="file" accept="image/*" onChange={handleLogoUpload}
//                           className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700" />
//                       </div>
//                     )}
//                   </div>
//                   <div className="text-right">
//                     <h1 className="text-4xl font-bold mb-3 text-gray-800">QUOTATION(MMC)</h1>
//                     <div className="space-y-2">
//                       <div><strong>Estimate #:</strong> <span className="font-bold text-lg">{form.estimate_no}</span></div>
//                       <div><strong>Issue Date:</strong> {editMode ? <input type="date" name="issue_date" value={form.issue_date} onChange={handleFormChange} className="border-b-2 border-gray-400 ml-2 focus:border-blue-600 outline-none" /> : formatDate(form.issue_date)}</div>
//                       <div><strong>Expiry Date:</strong> {editMode ? <input type="date" name="expire_date" value={form.expire_date} onChange={handleFormChange} className="border-b-2 border-gray-400 ml-2 focus:border-blue-600 outline-none" /> : formatDate(form.expire_date)}</div>
//                       <div><strong>Status:</strong> {editMode ? (
//                         <select name="status" value={form.status} onChange={handleFormChange} className="ml-2 border rounded px-3 py-1">
//                           <option>Draft</option>
//                           <option>Sent</option>
//                           <option>Approved</option>
//                           <option>Paid</option>
//                         </select>
//                       ) : <span className="font-medium">{form.status}</span>}</div>
//                     </div>
//                     <div className="text-xl font-bold mt-1">
//                       <span>Total</span>
//                       <span>(BDT): {totals.total.toFixed(2)}</span>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 print:grid-cols-2 justify-between mb-12 gap-0 print:gap-48">
//                   {["estimate_to", "pay_to"].map((section) => (
//                     <div key={section}>
//                       <h3 className="font-bold text-lg mb-4">{section === "estimate_to" ? "Estimate To" : "Pay To"}</h3>
//                       {["client_name", "company_name", "email", "phone", "address"].map((field) => (
//                         <div key={field} className="flex items-start gap-3 mb-1">
//                           {field === "client_name" && <FaUser className="mt-1 text-gray-600" />}
//                           {field === "company_name" && <FaBuilding className="mt-1 text-gray-600" />}
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
//                           {editMode ? <input value={item.item} onChange={(e) => handleItemChange(item.id, "item", e.target.value)} className="w-full outline-none" placeholder="Item" /> : <span>{item.item || "-"}</span>}
//                         </td>
//                         <td className="px-3 py-1">
//                           {editMode ? <input value={item.description} onChange={(e) => handleItemChange(item.id, "description", e.target.value)} className="w-full outline-none" placeholder="Description" /> : <span>{item.description || "-"}</span>}
//                         </td>
//                         <td className="px-3 py-2 text-center">
//                           {editMode ? <input type="number" value={item.qty} onChange={(e) => handleItemChange(item.id, "qty", e.target.value)} className="w-16 text-center outline-none" min="0" /> : <span>{item.qty || 0}</span>}
//                         </td>
//                         <td className="px-3 py-2 text-center">
//                           {editMode ? <input value={item.unit} onChange={(e) => handleItemChange(item.id, "unit", e.target.value)} className="w-16 text-center outline-none" placeholder="pcs" /> : <span>{item.unit || "-"}</span>}
//                         </td>
//                         <td className="px-3 py-2 text-right">
//                           {editMode ? <input type="number" step="0.01" value={item.price} onChange={(e) => handleItemChange(item.id, "price", e.target.value)} className="w-20 text-right outline-none" min="0" /> : <span>{Number(item.price || 0).toFixed(2)}</span>}
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

//                 <div className="flex gap-8 mb-8 justify-end print:hidden">
//                   <div className="flex items-center gap-3 text-lg">
//                     <span>Discount (%)</span>
//                     <input type="number" name="discountPercent" value={form.discountPercent} onChange={handleFormChange} className="w-24 border-2 rounded px-3 py-1 text-right" min="0" max="100" />
//                     <span>Tax (%)</span>
//                     <input type="number" name="taxPercent" value={form.taxPercent} onChange={handleFormChange} className="w-24 border-2 rounded px-3 py-1 text-right" min="0" />
//                   </div>
//                 </div>

//                 <div className="w-96 ml-auto border-t-4 border-double border-gray-800 pt-6">
//                   <div className="flex justify-between text-lg"><span>Subtotal</span><span>BDT {totals.subtotal.toFixed(2)}</span></div>
//                   {totals.discountAmt > 0 && (
//                     <div className="flex justify-between"><span>Discount ({form.discountPercent}%)</span><span>-BDT {totals.discountAmt.toFixed(2)}</span></div>
//                   )}
//                   {totals.taxAmt > 0 && (
//                     <div className="flex justify-between"><span>Tax ({form.taxPercent}%)</span><span>BDT {totals.taxAmt.toFixed(2)}</span></div>
//                   )}
//                   <div className="flex justify-between text-2xl font-bold border-t-4 border-double border-gray-800 pt-4 mt-4">
//                     <span>Total</span>
//                     <span>(BDT) {totals.total.toFixed(2)}</span>
//                   </div>
//                 </div>

//                 <div className="mt-3">
//                   <strong className="text-lg block mb-3">Notes</strong>
//                   {editMode ? (
//                     <textarea name="notes" value={form.notes} onChange={handleFormChange} rows={4} className="w-full rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
//                   ) : (
//                     <div className="whitespace-pre-wrap text-gray-700">{form.notes || "No notes added."}</div>
//                   )}
//                 </div>

//                 <div className="mt-2">
//                   <strong className="text-lg block mb-1">Reference</strong>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
//                     {["name", "mobile", "address"].map((type) => (
//                       <div key={type}>
//                         <span className="font-medium">{type.charAt(0).toUpperCase() + type.slice(1)}:</span>
//                         {editMode ? (
//                           <input
//                             name={`reference_${type}_for_note`}
//                             value={form[`reference_${type}_for_note`] || ""}
//                             onChange={handleFormChange}
//                             className="ml-3 w-full max-w-xs pb-1 outline-none"
//                           />
//                         ) : (
//                           <span className="ml-3">{form[`reference_${type}_for_note`] || "-"}</span>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               <div className="p-3 border-t bg-gray-50 flex justify-center gap-6 print:hidden flex-wrap">
//                 <button type="button" onClick={handlePrint} className="px-8 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition text-lg">
//                   Print
//                 </button>
//                 {editMode && (
//                   <button type="submit" className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-lg font-medium">
//                     Save Estimate
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

// export default Estimates;


//////////////////////////15-12-2025/////////////////////////////Adding Unit////////////////////////////////////////

import React, { useEffect, useState, useMemo, useRef } from "react";
import axios from "axios";
import {
  FaBuilding,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";

// Small unique id generator (no extra deps)
const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;

const Estimates = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [estimates, setEstimates] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 20;

  const readerRef = useRef(null);

  const emptyForm = {
    estimate_no: "",
    issue_date: "",
    expire_date: "",
    status: "Draft",
    logo: null, // base64 data URL
    estimate_to: { company_name: "", client_name: "", email: "", phone: "", address: "" },
    pay_to: { company_name: "", client_name: "", email: "", phone: "", address: "" },
    items: [{ id: uid(), item: "", description: "", qty: 1, price: 0, unit: "pcs", total: 0 }],
    discountPercent: 0,
    taxPercent: 0,
    notes: "",
    reference_name_for_note: "",
    reference_mobile_for_note: "",
    reference_address_for_note: "",
    subtotal: 0,
    discountAmt: 0,
    taxAmt: 0,
    total: 0,
  };

  const [form, setForm] = useState(emptyForm);

  const formatDate = (d) => (d ? new Date(d).toLocaleDateString("en-GB") : "");

  const resetForm = () => {
    setForm({ ...emptyForm });
    setEditId(null);
    setEditMode(true);
  };

  const generateEstimateNo = () => {
    const nums = estimates
      .map((e) => {
        const m = e.estimate_no?.match(/(\d+)$/);
        return m ? parseInt(m[0]) : 0;
      })
      .sort((a, b) => b - a);
    const next = (nums[0] || 0) + 1;
    return `EST-${String(next).padStart(4, "0")}`;
  };

  // Recalculate totals - memoized for performance
  const totals = useMemo(() => {
    const items = form.items.map((it) => {
      const qty = Number(it.qty || 0);
      const price = Number(it.price || 0);
      const total = +(qty * price).toFixed(2);
      return { ...it, qty, price, total };
    });
    const subtotal = +items.reduce((a, b) => a + b.total, 0).toFixed(2);
    const discountAmt = +(subtotal * (Number(form.discountPercent || 0) / 100)).toFixed(2);
    const taxable = subtotal - discountAmt;
    const taxAmt = +(taxable * (Number(form.taxPercent || 0) / 100)).toFixed(2);
    const total = +(taxable + taxAmt).toFixed(2);
    return { items, subtotal, discountAmt, taxAmt, total };
  }, [form.items, form.discountPercent, form.taxPercent]);

  const fetchEstimates = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/estimate", {
        headers: { Authorization: `Bearer ${localStorage.getItem("pos-token")}` },
      });
      setEstimates(res.data.estimates || []);
      setFiltered(res.data.estimates || []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEstimates();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase().trim();
    const filteredData = term
      ? estimates.filter(
          (e) =>
            e.estimate_no?.toLowerCase().includes(term) ||
            e.estimate_to?.company_name?.toLowerCase().includes(term) ||
            e.estimate_to?.client_name?.toLowerCase().includes(term)
        )
      : estimates;
    setFiltered(filteredData);
    setPage(1);
  }, [searchTerm, estimates]);

  // ensure at least 1 page (prevents 'Page 1 of 0')
  const pagesCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    // dotted names for nested objects (estimate_to.company_name)
    if (name.includes(".")) {
      const [parent, key] = name.split(".");
      setForm((p) => ({ ...p, [parent]: { ...p[parent], [key]: value } }));
    } else {
      // normalize numeric inputs
      if (name === "discountPercent" || name === "taxPercent") {
        setForm((p) => ({ ...p, [name]: Number(value) }));
      } else {
        setForm((p) => ({ ...p, [name]: value }));
      }
    }
  };

  const handleItemChange = (idx, field, rawValue) => {
    setForm((p) => {
      const items = [...p.items];
      const val = field === "qty" || field === "price" ? Number(rawValue) : rawValue;
      items[idx] = { ...items[idx], [field]: val };
      return { ...p, items };
    });
  };

  const addItem = () =>
    setForm((p) => ({
      ...p,
      items: [...p.items, { id: uid(), item: "", description: "", qty: 1, price: 0, unit: "pcs", total: 0 }],
    }));
  const removeItem = (i) => setForm((p) => ({ ...p, items: p.items.filter((_, idx) => idx !== i) }));

  // Logo upload - saves as base64
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // abort previous reader if exists
    if (readerRef.current) {
      try {
        readerRef.current.abort();
      } catch (err) {
        // ignore
      }
    }
    const reader = new FileReader();
    readerRef.current = reader;
    reader.onload = (ev) => {
      setForm((p) => ({ ...p, logo: ev.target.result }));
      readerRef.current = null;
    };
    reader.onerror = () => {
      console.error("Logo read error");
      readerRef.current = null;
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    return () => {
      // cleanup any active FileReader
      if (readerRef.current && typeof readerRef.current.abort === "function") {
        try {
          readerRef.current.abort();
        } catch (err) {
          // ignore
        }
      }
    };
  }, []);

  const openAddModal = () => {
    resetForm();
    const today = new Date().toISOString().split("T")[0]; // Gives today date
    setForm((f) => ({ ...f, estimate_no: generateEstimateNo(),
    issue_date: today,   //  This line makes today's date selected by default  
     }));
    setModalOpen(true);
  };

  const openEditModal = (est) => {
    const itemsWithId = (est.items || []).map((it) => ({ ...it, id: it.id || uid() }));

    setForm({
      ...emptyForm,
      ...est,
      items: itemsWithId.length ? itemsWithId : [{ id: uid(), item: "", description: "", qty: 1, price: 0, unit: "pcs", total: 0 }],
      issue_date: est.issue_date?.split("T")[0] || "",
      expire_date: est.expire_date?.split("T")[0] || "",
    });
    setEditId(est._id);
    setEditMode(est.status === "Draft");
    setModalOpen(true);
  };

  const previewSaved = (est) => {
    const itemsWithId = (est.items || []).map((it) => ({ ...it, id: it.id || uid() }));
    setForm({
      ...emptyForm,
      ...est,
      items: itemsWithId.length ? itemsWithId : [{ id: uid(), item: "", description: "", qty: 1, price: 0, unit: "pcs", total: 0 }],
      issue_date: est.issue_date?.split("T")[0] || "",
      expire_date: est.expire_date?.split("T")[0] || "",
    });
    setEditId(est._id);
    setEditMode(false);
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      items: totals.items.map((it) => ({ id: it.id, item: it.item, description: it.description, qty: it.qty, price: it.price, unit: it.unit, total: it.total })),
      subtotal: totals.subtotal,
      discountAmt: totals.discountAmt,
      taxAmt: totals.taxAmt,
      total: totals.total,
      issue_date: form.issue_date ? new Date(form.issue_date).toISOString() : null,
      expire_date: form.expire_date ? new Date(form.expire_date).toISOString() : null,
    };

    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/estimate/${editId}`, payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem("pos-token")}` },
        });
      } else {
        await axios.post("http://localhost:5000/api/estimate/add", payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem("pos-token")}` },
        });
      }
      alert("Estimate saved successfully!");
      setModalOpen(false);
      // await refresh before resetting form to avoid flicker
      await fetchEstimates();
      // slightly delay clearing to avoid visible input flicker while modal animates
      setTimeout(resetForm, 150);
    } catch (err) {
      alert("Save failed: " + (err.response?.data?.message || err.message));
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window?.confirm || !window.confirm("Delete this estimate permanently?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/estimate/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("pos-token")}` },
      });
      await fetchEstimates();
    } catch (err) {
      alert("Delete failed");
    }
  };

  // Print Function
  const handlePrint = () => {
    const content = document.getElementById("printable-estimate");
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
            <title>${form.estimate_no}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @page { margin: 0.5in; }
            @media print {
              .print-grid-cols-2 { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 4rem; }
            }
          </style>
        </head>
        <body class="p-3 font-sans text-sm">
          ${content ? content.innerHTML : ""}
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    // some browsers don't fire onload reliably for windows created this way; use a small timeout
    setTimeout(() => {
      try {
        win.print();
        setTimeout(() => win.close(), 500);
      } catch (err) {
        console.error("Print error", err);
      }
    }, 250);
  };

  // PDF Generation (you can uncomment button later if needed)
  const generatePDF = () => {
    const doc = new jsPDF("p", "pt", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 50;
    let y = 80;

    if (form.logo && typeof form.logo === "string" && form.logo.startsWith("data:image/")) {
      const isJpeg = form.logo.startsWith("data:image/jpeg") || form.logo.startsWith("data:image/jpg");
      const format = isJpeg ? "JPEG" : "PNG";
      try {
        doc.addImage(form.logo, format, margin, y - 50, 140, 90);
      } catch (err) {
        console.warn("Failed to add logo to PDF", err);
      }
    }

    doc.setFontSize(11);
    const right = pageWidth - margin;
    doc.text(`Estimate #: ${form.estimate_no}`, right, y, { align: "right" });
    doc.text(`Issue Date: ${formatDate(form.issue_date)}`, right, y + 20, { align: "right" });
    doc.text(`Expiry Date: ${formatDate(form.expire_date)}`, right, y + 40, { align: "right" });
    doc.text(`Status: ${form.status}`, right, y + 60, { align: "right" });

    y += 100;

    const colWidth = (pageWidth - margin * 2 - 60) / 2;
    doc.setFontSize(12).setFont("helvetica", "bold");
    doc.text("Estimate To", margin, y);
    doc.text("Pay To", margin + colWidth + 60, y);
    doc.setFont("helvetica", "normal");
    y += 20;

    const drawCol = (data, x) => {
      let cy = y;
      [data.company_name, data.client_name, data.email, data.phone, data.address]
        .filter(Boolean)
        .forEach((line) => {
          doc.text(line || "", x, cy);
          cy += 18;
        });
    };
    drawCol(form.estimate_to, margin);
    drawCol(form.pay_to, margin + colWidth + 60);

    y += 120;

    doc.autoTable({
      startY: y,
      head: [["Item", "Description", "Qty", "Unit", "Price", "Total"]],
      body: form.items.map((i, idx) => [
        i.item || "",
        i.description || "",
        i.qty || 0,
        i.unit || "pcs",
        Number(i.price || 0).toFixed(2),
        Number(totals.items[idx]?.total || 0).toFixed(2),
      ]),
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [240, 240, 240] },
    });

    y = doc.lastAutoTable?.finalY ? doc.lastAutoTable.finalY + 50 : y + 200;
    const tx = pageWidth - margin - 120;

    doc.setFontSize(11);
    doc.text("Subtotal:", tx, y);
    doc.text(totals.subtotal.toFixed(2), pageWidth - margin, y, { align: "right" });

    if (totals.discountAmt > 0) {
      y += 20;
      doc.text(`Discount (${form.discountPercent}%):`, tx, y);
      doc.text(`-${totals.discountAmt.toFixed(2)}`, pageWidth - margin, y, { align: "right" });
    }
    if (totals.taxAmt > 0) {
      y += 20;
      doc.text(`Tax (${form.taxPercent}%):`, tx, y);
      doc.text(totals.taxAmt.toFixed(2), pageWidth - margin, y, { align: "right" });
    }

    y += 30;
    doc.setFontSize(14).setFont("helvetica", "bold");
    doc.text("Total:", tx, y);
    doc.text(totals.total.toFixed(2), pageWidth - margin, y, { align: "right" });

    if (form.notes) {
      y += 50;
      doc.setFont("helvetica", "bold").text("Notes:", margin, y);
      doc.setFont("helvetica", "normal");
      const splitNotes = doc.splitTextToSize(form.notes, pageWidth - margin * 2);
      y += 20;
      splitNotes.forEach((line) => {
        doc.text(line, margin, y);
        y += 18;
      });
    }

    doc.save(`${form.estimate_no || "estimate"}.pdf`);
  };

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Estimates</h1>

      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <input
          type="text"
          placeholder="Search by Estimate No, Company or Client..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full md:w-96 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button onClick={openAddModal} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
          + Add Estimate
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading estimates...</div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  {[
                    "No",
                    "Estimate No",
                    "Company",
                    "Client",
                    "Issue",
                    "Expiry",
                    "Total",
                    "Status",
                    "Actions",
                  ].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-medium">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.map((est, i) => (
                  <tr key={est._id} className="border-t hover:bg-gray-50 transition">
                    <td className="px-4 py-3">{(page - 1) * PAGE_SIZE + i + 1}</td>
                    <td className="px-4 py-3 font-medium">{est.estimate_no}</td>
                    <td className="px-4 py-3">{est.estimate_to?.client_name || "-"}</td>
                    <td className="px-4 py-3">{est.estimate_to?.company_name || "-"}</td>
                    <td className="px-4 py-3">{formatDate(est.issue_date)}</td>
                    <td className="px-4 py-3">{formatDate(est.expire_date)}</td>
                    <td className="px-4 py-3 font-medium b">(BDT):{Number(est.total || 0).toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          est.status === "Draft"
                            ? "bg-yellow-100 text-yellow-800"
                            : est.status === "Sent"
                            ? "bg-blue-100 text-blue-800"
                            : est.status === "Approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {est.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 space-x-2">
                      <button
                        onClick={() => openEditModal(est)}
                        disabled={est.status !== "Draft"}
                        className={`px-3 py-1 rounded text-white text-xs ${
                          est.status === "Draft" ? "bg-yellow-600 hover:bg-yellow-700" : "bg-gray-400 cursor-not-allowed"
                        }`}
                      >
                        Edit
                      </button>
                      <button onClick={() => handleDelete(est._id)} className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700">
                        Delete
                      </button>
                      <button onClick={() => previewSaved(est)} className="px-3 py-1 bg-indigo-600 text-white rounded text-xs hover:bg-indigo-700">
                        View / PDF
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
              <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-100">
                Previous
              </button>
              <button disabled={page >= pagesCount} onClick={() => setPage((p) => Math.min(p + 1, pagesCount))} className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-100">
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
              <div id="printable-estimate" className="p-6 text-sm">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    {form.logo ? (
                      <img src={form.logo} alt="Company Logo" className="max-w-70 h-auto " />
                    ) : (
                      <div className="w-48 h-32 border-2 border-dashed border-gray-400 flex items-center justify-center text-gray-500 rounded">
                        Your Logo Here
                      </div>
                    )}
                    {editMode && (
                      <div className="mt-4">
                        <input type="file" accept="image/*" onChange={handleLogoUpload} className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700" />
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <h1 className="text-4xl font-bold mb-3 text-gray-800">QUOTATION(MMC)</h1>
                    <div className="space-y-2">
                      <div><strong>Estimate #:</strong> <span className="font-bold text-lg">{form.estimate_no}</span></div>
                      <div>  
                        <strong>Issue Date:</strong>
                        {editMode ? (
                          <input
                            type="date"
                            name="issue_date"
                            value={form.issue_date}
                            onChange={handleFormChange}
                            min={new Date().toISOString().split("T")[0]}
                            className="border-b-2 border-gray-400 ml-2 focus:border-blue-600 outline-none rounded px-2"
                            required
                          />
                        ) : (
                          formatDate(form.issue_date)
                        )}
                      </div>

                      <div><strong>Expiry Date:</strong> {editMode ?
                       <input 
                         type="date" 
                         name="expire_date" 
                         value={form.expire_date} 
                         onChange={handleFormChange} 
                         min={new Date().toISOString().split("T")[0]}
                         className="border-b-2 border-gray-400 ml-2 focus:border-blue-600 outline-none" /> : 
                       formatDate(form.expire_date)}
                      </div>
                      
                      <div><strong>Status:</strong> {editMode ? (
                        <select name="status" value={form.status} onChange={handleFormChange} className="ml-2 border rounded px-3 py-1">
                          <option>Draft</option>
                          <option>Sent</option>
                          <option>Approved</option>
                          <option>Paid</option>
                        </select>
                      ) : <span className="font-medium">{form.status}</span>}</div>
                    </div>
                    <div className="text-xl font-bold mt-1">
                      <span>Total</span>
                      <span>(BDT): {totals.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Estimate To & Pay To */}
                <div className="grid grid-cols-1 print:grid-cols-2 justify-between mb-12 gap-0 print:gap-48">
                  {["estimate_to", "pay_to"].map((section) => (
                    <div key={section}>
                      <h3 className="font-bold text-lg mb-4">{section === "estimate_to" ? "Estimate To" : "Pay To"}</h3>
                      {["client_name","company_name", "email", "phone", "address"].map((field) => (
                        <div key={field} className="flex items-start gap-3 mb-1">
                          {field === "client_name" && <FaUser className="mt-1 text-gray-600" />}
                          {field === "company_name" && <FaBuilding className="mt-1 text-gray-600" />} 
                          {field === "email" && <FaEnvelope className="mt-1 text-gray-600" />}
                          {field === "phone" && <FaPhone className="mt-1 text-gray-600" />}
                          {field === "address" && <FaMapMarkerAlt className="mt-1 text-gray-600" />}
                          {editMode ? (
                            <input
                              name={`${section}.${field}`}  
                              value={form[section][field] || ""}
                              onChange={handleFormChange}
                              className="flex-1 border-b-2 border-gray-300 focus:border-blue-600 outline-none py-1"
                              placeholder={field.replace(/_/g, " ").charAt(0).toUpperCase() + field.replace(/_/g, " ").slice(1)}
                            />
                          ) : (
                            <span className="flex-1">{form[section][field] || "-"}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Items Table - CORRECT ORDER: Item → Description → Qty → Unit → Price → Total */}
                <table className="w-auto border-collapse mb-6">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-4 py-3 text-left">Item</th>
                      <th className="border border-gray-300 px-4 py-3 text-left">Description</th>
                      <th className="border border-gray-300 px-4 py-3 text-center w-20">Qty</th>
                      <th className="border border-gray-300 px-4 py-3 text-center w-24">Unit</th>
                      <th className="border border-gray-300 px-4 py-3 text-right w-24">Price</th>
                      <th className="border border-gray-300 px-4 py-3 text-right w-28">Total</th>
                      {editMode && <th className="border border-gray-300 px-4 py-3 print:hidden w-24">Action</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {form.items.map((item, i) => (
                      <tr key={item.id}>
                        <td className="px-2 py-2">
                          {editMode ? <input value={item.item} onChange={(e) => handleItemChange(i, "item", e.target.value)} className="w-full outline-none" /> : item.item}
                        </td>
                        <td className="px-3 py-1">
                          {editMode ? <input value={item.description} onChange={(e) => handleItemChange(i, "description", e.target.value)} className="w-full outline-none" /> : item.description}
                        </td>
                        <td className="px-3 py-2 text-center">
                          {editMode ? <input type="number" value={item.qty} onChange={(e) => handleItemChange(i, "qty", e.target.value)} className="w-16 text-center outline-none" /> : item.qty}
                        </td>
                        <td className="px-3 py-2 text-center">
                          {editMode ? (
                            <input
                              //value={item.unit || "pcs"}
                              value={item.unit || ""}
                              onChange={(e) => handleItemChange(i, "unit", e.target.value)}
                              className="w-20 text-center outline-none border-b border-gray-300"
                              placeholder="pcs"
                            />
                          ) : (
                            item.unit || "pcs"
                          )}
                        </td>
                        <td className="px-3 py-2 text-right">
                          {editMode ? <input type="number" step="0.01" value={item.price} onChange={(e) => handleItemChange(i, "price", e.target.value)} className="w-20 text-right outline-none" /> : Number(item.price).toFixed(2)}
                        </td>
                        <td className="px-3 py-2 text-right font-medium">
                          {Number(totals.items[i]?.total || 0).toFixed(2)}
                        </td>
                        {editMode && (
                          <td className="px-3 py-2 text-center print:hidden">
                            <button type="button" onClick={() => removeItem(i)} className="text-red-600 hover:underline text-sm">Remove</button>
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

                {/* Discount & Tax */}
                <div className="flex gap-8 mb-8 justify-end print:hidden">
                  <div className="flex items-center gap-3 text-lg">
                    <span>Discount (%)</span>
                    <input type="number" name="discountPercent" value={form.discountPercent} onChange={handleFormChange} className="w-24 border-2 rounded px-3 py-1 text-right" min="0" max="100" />
                    <span>Tax (%)</span>
                    <input type="number" name="taxPercent" value={form.taxPercent} onChange={handleFormChange} className="w-24 border-2 rounded px-3 py-1 text-right" min="0" />
                  </div>
                </div>

                {/* Totals */}
                <div className="w-96 ml-auto border-t-4 border-double border-gray-800 pt-6">
                  <div className="flex justify-between text-lg"><span>Subtotal</span><span>BDT{totals.subtotal.toFixed(2)}</span></div>
                  {totals.discountAmt > 0 && (
                    <div className="flex justify-between"><span>Discount ({form.discountPercent}%)</span><span>-BDT{totals.discountAmt.toFixed(2)}</span></div>
                  )}
                  {totals.taxAmt > 0 && (
                    <div className="flex justify-between"><span>Tax ({form.taxPercent}%)</span><span>BDT{totals.taxAmt.toFixed(2)}</span></div>
                  )}
                  <div className="flex justify-between text-2xl font-bold border-t-4 border-double border-gray-800 pt-4 mt-4">
                    <span>Total</span>
                    <span>(BDT) {totals.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Notes */}
                <div className="mt-3">
                  <strong className="text-lg block mb-3">Notes</strong>
                  {editMode ? (
                    <textarea name="notes" value={form.notes} onChange={handleFormChange} rows={4} className="w-full rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none" />
                  ) : (
                    <div className="whitespace-pre-wrap text-gray-700">{form.notes || "No notes added."}</div>
                  )}
                </div>

                {/* Reference */}
                <div className="mt-2">
                  <strong className="text-lg block mb-1">Reference</strong>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
                    {["name", "mobile", "address"].map((type) => (
                      <div key={type}>
                        <span className="font-medium">{type.charAt(0).toUpperCase() + type.slice(1)}:</span>
                        {editMode ? (
                          <input
                            name={`reference_${type}_for_note`}
                            value={form[`reference_${type}_for_note`] || ""}
                            onChange={handleFormChange}
                            className="ml-3 w-full max-w-xs pb-1 outline-none"
                          />
                        ) : (
                          <span className="ml-3">{form[`reference_${type}_for_note`] || "-"}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-3 border-t bg-gray-50 flex justify-center gap-6 print:hidden flex-wrap">
                <button type="button" onClick={handlePrint} className="px-8 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition text-lg">
                  Print
                </button>
                {/* <button type="button" onClick={generatePDF} className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-lg">
                  Download PDF
                </button> */}
                {editMode && (
                  <button type="submit" className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-lg font-medium">
                    Save Estimate
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

export default Estimates;
