//import React from "react";
// import React, {useEffect, useState } from "react";
// import axios from "axios";

// const Invoices = () => {

//   const [addModal, setAddModal] = useState(null);
//   const [editInvoice, setEditInvoice] =useState(null);
//   const [formData, setFormData] = useState({
//   inv: "",
//   name:"",
//   due_date:"",
//   amount:"",
//   paid:"",
//   amount_due:"",
//   descriptions:"",
//   status:"",


//   });
//   const [loading, setLoading] = useState(false);
//   const [invoices, setInvoices] = useState([]);
//   const [filteredInvoices, setFilteredInvoices ] = useState([]);

// //   const handleChange = (e) =>{
// //     const {name, value } = e.target;
// //     setFormData((prev) => ({
// //         ...prev,
// //         [name] : value,

// //     }));
// // };
// ////////////////////////////Invoice calculations amount-paid = due amount__Start/////////////////
// const handleChange = (e) => {
//     const { name, value } = e.target;
    
//     // Convert numerical inputs to floating-point numbers for calculation
//     const newAmount = name === 'amount' ? parseFloat(value) || 0 : parseFloat(formData.amount) || 0;
//     const newPaid = name === 'paid' ? parseFloat(value) || 0 : parseFloat(formData.paid) || 0;
    
//     let calculatedAmountDue = formData.amount_due;

//     // Check if the changing field is 'amount' or 'paid'
//     if (name === 'amount' || name === 'paid') {
//         // Calculate the difference: Total Amount - Paid Amount
//         const due = newAmount - newPaid;
//         // Ensure due amount is not negative (unless that is a business rule you allow)
//         calculatedAmountDue = Math.max(0, due).toFixed(2); // Format to 2 decimal places
//     }

//     setFormData((prev) => ({
//         ...prev,
//         [name]: value, // Set the current input field's value
//         amount_due: calculatedAmountDue, // Set the automatically calculated due amount
//     }));
// };
// ////////////////////////////Invoice calculations amount-paid =due amount_______End/////////
//   const fetchInvoices = async () => {
//     setLoading(true);
// try{
//   const response = await axios.get("http://localhost:5000/api/invoice",{
//     headers: {
//       Authorization: `Bearer ${localStorage.getItem('pos-token')} `,
//     },
//   });
//    //console.log(response.data.invoices);
//    //setInvoices(response.data.invoices);
//    setFilteredInvoices(response.data.invoices);
//    setInvoices(response.data.invoices);
//    setLoading(false);
// }catch(error) {
//   console.error("Error fetching invoices :",error);
//   setLoading(false);
// }finally {
//     setLoading(false);
// }
//   };
// useEffect(() => {
//   fetchInvoices();

// },[]);

// const handleEdit = (invoice) => {
//   setFormData({
//    inv:        invoice.inv ,
//   name:        invoice.name,
//   due_date:    invoice.due_date,
//   //due_date: formatToInputDate(invoice.due_date),
//   amount:      invoice.amount,
//   paid:        invoice.paid,
//   amount_due:  invoice.amount_due,
//   descriptions:invoice.descriptions,
//   status:      invoice.status,

//   });
//   setEditInvoice(invoice._id);
//   setAddModal  (true);
//  // setAddModal  (invoice._id);
// }
// const closeModal =  () => {
//    setAddModal(false);
//    //setAddModal(null);
//     setFormData({
//                 inv: "",
//                 name:"",
//                 due_date:"",
//                 amount:"",
//                 paid:"",
//                 amount_due:"",
//                 descriptions:"",
//                 status:"",
//                     });
//         setEditInvoice(null) ;           
// }

// const handleSubmit = async (e) => {
// e.preventDefault();
// if(editInvoice){
//      try {
//         const response = await axios.put(
//             `http://localhost:5000/api/invoice/${editInvoice}`,
//             formData,
//             {
//                 headers: {

//                Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
//              },
//             }
//         );
//         if (response.data.success){
//           fetchInvoices();  //Refresh page with new data
//             alert("Invoice edited Successfully!");
//             setAddModal(false);
//             setEditInvoice(null);
//               setFormData({
//                 inv: "",
//                 name:"",
//                 due_date:"",
//                 amount:"",
//                 paid:"",
//                 amount_due:"",
//                 descriptions:"",
//                 status:"",
//                     });
//      } else {
//         //console.error("Error adding Invoice:",data);
//         // alert("Error adding Invoice. Please try again.");
//          alert("Invoice edited Successfully!");
//      }
//      } catch (error){
//           //console.error("Error adding Invoice:",error);
//            //alert("Error adding Invoice. Please try again.");
//            alert("Invoice edited Successfully!.");
//         }
   
//     }else {

//      try {
//         const response = await axios.post(
//             "http://localhost:5000/api/invoice/add",
//             formData,
//             {
//                 headers: {

//                Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
//              },
//             }
//         );
//         if (response.data.success){
//             alert("Invoice added Successfully!");
//             fetchInvoices(); //Refresh page
//             //setAddModal(null);
//             setAddModal(false);
//              setFormData({
//                 inv: "",
//                 name:"",
//                 due_date:"",
//                 amount:"",
//                 paid:"",
//                 amount_due:"",
//                 descriptions:"",
//                 status:"",
//                     });
//      } else {
//         console.error("Error adding Invoice:",data);
//          alert("Error adding Invoice. Please try again.");
//      }
//      } catch (error){
//           console.error("Error adding Invoice:",error);
//            alert("Error adding invoice. Please try again.");
//         }
//    }


//  };

//                   // Delete section starts
//   const handleDelete = async (id) => {
//   const confirmDelete = window.confirm ("Are You Sure want To Delete This Invoice ?")
  
//   if(confirmDelete) {
//   //if(window.confirm("Are You Sure want To Delete This Invoice ?")) {
//  try {
//    const response = await axios.delete(`http://localhost:5000/api/invoice/${id}`,
           
//              {
//             headers: {
//                Authorization: `Bearer ${localStorage.getItem("pos-token")}`,

//              },
//             }
//           );
//           if (response.data.success){
//             alert("Invoice Delete Successfully");
//             fetchInvoices();   //Refresh after Invoice list Delete
//           } else {
//            console.error("Error deleting Invoice",data);
//            alert("Error deleting  Invoice. Please try again.");
//           }
//         } catch (error){
//           console.error("Error deleting Invoice:",error);
//            alert("Error deleting  Invoice. Please try again.");
//         }
//       }
//    };
//            // Delete section End  when invoice delete button click

//               //////////////// //Search Filter Start ////////////////////////
//           //  const handleSearch = (e) => {
//           //   setFilteredInvoices(
//           //     invoices.filter((invoice) =>
//           //   invoice.name.toLowerCase().includes(e.target.value.toLowerCase())) 
//           //   //invoice.number.toLowerCase().includes(e.target.value.toLowerCase())) 
//           //   )
//           //  }
//        //----------------Search Filter End-------------------------
//           //////////////// //Search Filter name & number both Start Important ////////////////////////
// const handleSearch = (e) => {
//   const searchTerm = e.target.value.toLowerCase();
//   setFilteredInvoices(
//     invoices.filter((invoice) =>
//       invoice.name.toLowerCase().includes(searchTerm) || 
//       invoice.inv.toString().includes(searchTerm)
//     )
//   );
// };


// // Function to format the date start from here
// const formatDate = (dateString) => {
//     if (!dateString) return "";
//     try {
//         // Create a date object, assuming dateString is in a valid format (like YYYY-MM-DD)
//         return new Date(dateString).toLocaleDateString('en-US', {
//             year: 'numeric',
//             month: 'short',
//             day: 'numeric'
//         });
//     } catch (e) {
//         return dateString; // Return as is if there's an error
//     }
// };
//     return (
//         <div className="w-full h-full flex flex-col gap-4 p-4">
//             <h1 className="text-xl font-bold">Invoices Report</h1>
//             <div className="flex justify-between items-center">
//                 <input type="text" 
//                 placeholder="search" 
//                 className="border p-1  bg-white rounded px-4"
//                  onChange={handleSearch}
//                 />
//                 <button className="px-4 py-1.5 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-gray-700"
                
//                 onClick={() => setAddModal(true)}>Add Invoice</button>
//             </div>
  
//     {/* Adding Invoices new from  and show on Display start */}
//         {loading ? <div> Loading ....</div> : (
//           <div>
//           <table className=" w-full border-collapse border border-gray-300 mt-4">
//            <thead>
//             <tr className="bg-gray-200">
//                <th className="border border-gray-300 p-2">S. No</th>
//                <th className="border border-gray-300 p-2">Invoice NO</th>
//                <th className="border border-gray-300 p-2">Invoice Name</th>
//                <th className="border border-gray-300 p-2">Due Date</th>
//                <th className="border border-gray-300 p-2">Amount</th>
//                <th className="border border-gray-300 p-2">Paid</th>
//                <th className="border border-gray-300 p-2">Amount Due</th>
//                <th className="border border-gray-300 p-2">Descriptions</th>
//                <th className="border border-gray-300 p-2">Status</th>
//                <th className="border border-gray-300 p-2">Action</th>

//             </tr>
//            </thead>
//            <tbody>
//             {/* {filteredInvoices.map((invoice,index)=> ( */}
//             {/* {invoices.map((invoice,index)=> ( */}
//             {filteredInvoices.map((invoice,index)=> ( 
             
//               <tr key={invoice._id}>
//                {/* <tr key={index}>  */}
//                <td className="border border-gray-300 p-2">{index + 1}</td>
//                <td className="border border-gray-300 p-2">{invoice.inv}</td>
//                <td className="border border-gray-300 p-2">{invoice.name}</td>
//                {/* <td className="border border-gray-300 p-2">{invoice.due_date}</td> */}
//                <td className="border border-gray-300 p-2">{formatDate(invoice.due_date)}</td>
//                <td className="border border-gray-300 p-2">{invoice.amount}</td>
//                <td className="border border-gray-300 p-2">{invoice.paid}</td>
//                <td className="border border-gray-300 p-2">{invoice.amount_due}</td>
//                <td className="border border-gray-300 p-2">{invoice.descriptions}</td>
//                <td className="border border-gray-300 p-2">{invoice.status}</td>
//                 <td className="border border-gray-300 p-2">
                        
//                         <button className="px-2 py-1 bg-yellow-500 text-white  rounded-md cursor-pointer hover:bg-blue-900  mr-2"
//                           onClick={() => handleEdit(invoice)}
//                         >Edit</button>
                       
//                         <button className="px-2 py-1 bg-red-500  text-white  rounded-md cursor-pointer hover:bg-red-900"
//                          onClick={() => handleDelete(invoice._id)}
//                         >Delete</button>
                        
//                 </td>
//              </tr>
//             ))}
//            </tbody>
//           </table>

//            {filteredInvoices.length === 0 && <div>No Record Found </div>} 
//           {/* {filteredInvoices.length === 0 && <div>No Record Found </div>} */}

//           </div>
//         )}
//         {/* Adding Invoices new from and show on Display  end */}

  
//             {/* adding invoice part from here */}
//             {addModal && (
//                   <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center">
//                     <div className="bg-white p-4 rounded shadow-md w-1/3 relative">
//                        <h1 className="text-xl font-bold">Add Invoices</h1>
//                               <button className="absolute top-4 right-4 font-bold text-lg cursor-pointer "
//                             //onClick={() => setAddModal (null)}>X</button>
//                             //onClick={() => setAddModal (null)}>X</button>
//                            onClick={closeModal}>X</button> 
//                        <form className="flex flex-col gap-4 mt-4" onSubmit={handleSubmit}>
//                             <input 
//                                 type="text" 
//                                 name="inv"
//                                 value={formData.inv}
//                                 onChange={handleChange}
//                                 placeholder="Invoice Number"
//                                 required  
//                                 className="border p-1 bg-white rounded px-4" />
//                             <input 
//                                 type="text" 
//                                 name="name"
//                                 value={formData.name}
//                                 onChange={handleChange}
//                                 placeholder="Customer Name"
//                                 required  
//                                 className="border p-1 bg-white rounded px-4" />
//                             {/* <input 
//                                 type="text" 
//                                 name="due_date"
//                                 value={formData.due_date}
//                                 onChange={handleChange}
//                                 placeholder="Due Date"
//                                 required  
//                                 className="border p-1 bg-white rounded px-4" /> */}
// {/* <input 
//     type="**date**" //  This is the key change!
//     name="due_date"
//     value={formData.due_date}
//     onChange={handleChange}
//     placeholder="Due Date"
//     required 
//     className="border p-1 bg-white rounded px-4" 
// /> */}

// {/* Wrap input and icon in a relative container */}
// <div className="relative"> 
//     {/* 1. The Date Input Field */}
//     <input 
//         type="date" // Keeps the native calendar functionality
//         name="due_date"
//         value={formData.due_date}
//         onChange={handleChange}
//         min={new Date().toISOString().split("T")[0]}
//         //placeholder="Due Date"
//         required 
//         // Use padding on the right (pr-10) to make space for the icon
//         className="border p-1 bg-white rounded px-4 w-full pr-10" 
//     />

//     {/* 2. The Icon (Calendar Symbol) */}
//     <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
//         {/* Placeholder for a Calendar Icon */}
//         {/* If you use Font Awesome, replace this span with a tag like: <i class="fas fa-calendar-alt"></i> */}
//         {/* <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
//         </svg> */}
//     </div>
// </div>
// {/* ... rest of the form */}
//                             <input 
//                                 type="number" 
//                                 name="amount"
//                                  min="1"
//                                 value={formData.amount}
//                                 onChange={handleChange}
//                                 placeholder="Amount"
//                                 required  
//                                 className="border p-1 bg-white rounded px-4" />
//                             <input 
//                                 type="number" 
//                                 name="paid"
//                                 min="0"
//                                 value={formData.paid}
//                                 onChange={handleChange}
//                                 placeholder="Paid"
//                                 required  
//                                 className="border p-1 bg-white rounded px-4" />
//                             <input 
//                                 type="number" 
//                                 name="amount_due"
//                                 min="0"
//                                 value={formData.amount_due}
//                                 onChange={handleChange}
//                                 placeholder="Amount Due"
//                                 //required  
//                                 className="border p-1 bg-white rounded px-4" />
//                             <textarea 
//                                 //type="text" 
//                                 name="descriptions"
//                                 value={formData.descriptions}
//                                 onChange={handleChange}
//                                 placeholder="Descriptions"
//                                 required  
//                                 className="border p-1 bg-white rounded px-4" />
//                             {/* <input 
//                                 type="text" 
//                                 name="status"
//                                 value={formData.status}
//                                 onChange={handleChange}
//                                 placeholder="Status"
//                                 required  
//                                 className="border p-1 bg-white rounded px-4" /> */}
//                                 <div className="flex flex-col">
//                                    <select type="text" name="status"  value={formData.status} onChange={handleChange} placeholder="Status" required  className="border p-1 bg-white rounded px-4 text-overflow" >
//                                       <option value= "">Select Status</option>
//                                       <option className="text-red-500" value= "unpaid">Unpaid</option>
//                                       <option className="text-yellow-600" value= "partially paid">partially Paid</option>
//                                       <option className="text-green-600" value= "paid"> Paid</option>
//                                   </select>
//                                 </div>

//                         {/* <button 
//                           className="px-4 py-1.5 bg-blue-500 text-white rounded cursor-pointer hover:bg-gray-700">
//                             Add Invoices
//                        </button> */}

//                               {/* Invoice edit part start */}
//                     <div className="flex  space-x-2">
//                     <button 
//                     type="submit"
//                      className="w-full mt-2  rounded-md bg-green-600 text-white p-3 cursor-pointer hover:bg-gray-700">
//                       {/* {addModal ? "Save Changes" : "Add Invoice"} */}
//                        {editInvoice ? "Save Changes" : "Add Invoice"} 
//                       </button>
//                       {
                        
//                         //addModal && (
//                         editInvoice && (
//                           <button
//                           type="button"
//                           className="w-full mt-2  rounded-md bg-red-600 text-white p-3 cursor-pointer hover:bg-gray-700"
                    
//                           onClick={closeModal}
//                           //onClick={ () => setAddModal(null)}
//                           >
//                             Cancel
//                           </button>
//                         )}
//                       </div>
//         {/* Invoice edit part ends */}

//                        </form>
//                      </div>   
//                   </div>
//             )}
      
//         </div>
//     )
// }

// export default Invoices;
 

///////////////////////use pagination + disable date   23-12-25/////////////////

import React, { useEffect, useState } from "react";
import axios from "axios";

const Invoices = () => {
  const [addModal, setAddModal] = useState(false);
  const [editInvoice, setEditInvoice] = useState(null);
  const [formData, setFormData] = useState({
    inv: "",
    name: "",
    due_date: "",
    amount: "",
    paid: "",
    amount_due: "",
    descriptions: "",
    status: "",
  });
  const [loading, setLoading] = useState(false);
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Handle form input changes + auto-calculate amount due
  const handleChange = (e) => {
    const { name, value } = e.target;

    const newAmount = name === "amount" ? parseFloat(value) || 0 : parseFloat(formData.amount) || 0;
    const newPaid = name === "paid" ? parseFloat(value) || 0 : parseFloat(formData.paid) || 0;

    let calculatedAmountDue = formData.amount_due;

    if (name === "amount" || name === "paid") {
      const due = newAmount - newPaid;
      calculatedAmountDue = Math.max(0, due).toFixed(2);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      amount_due: calculatedAmountDue,
    }));
  };

  // Fetch invoices
  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/invoice", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });
      setInvoices(response.data.invoices || []);
      setFilteredInvoices(response.data.invoices || []);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // Search filter
  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = invoices.filter(
      (invoice) =>
        invoice.name.toLowerCase().includes(searchTerm) ||
        invoice.inv.toString().includes(searchTerm)
    );
    setFilteredInvoices(filtered);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  // Handle Edit
  const handleEdit = (invoice) => {
    setFormData({
      inv: invoice.inv || "",
      name: invoice.name || "",
      due_date: invoice.due_date ? new Date(invoice.due_date).toISOString().split("T")[0] : "",
      amount: invoice.amount || "",
      paid: invoice.paid || "",
      amount_due: invoice.amount_due || "",
      descriptions: invoice.descriptions || "",
      status: invoice.status || "",
    });
    setEditInvoice(invoice._id);
    setAddModal(true);
  };

  // Close modal & reset form
  const closeModal = () => {
    setAddModal(false);
    setEditInvoice(null);
    setFormData({
      inv: "",
      name: "",
      due_date: "",
      amount: "",
      paid: "",
      amount_due: "",
      descriptions: "",
      status: "",
    });
  };

  // Submit (Add or Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editInvoice
        ? `http://localhost:5000/api/invoice/${editInvoice}`
        : "http://localhost:5000/api/invoice/add";
      const method = editInvoice ? "put" : "post";

      const response = await axios[method](url, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });

      if (response.data.success) {
        alert(editInvoice ? "Invoice updated successfully!" : "Invoice added successfully!");
        fetchInvoices();
        closeModal();
      } else {
        alert("Operation failed. Please try again.");
      }
    } catch (error) {
      console.error("Error saving invoice:", error);
      alert(error.response?.data?.message || "Something went wrong.");
    }
  };

  // Delete invoice
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this invoice?")) return;

    try {
      const response = await axios.delete(`http://localhost:5000/api/invoice/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });

      if (response.data.success) {
        alert("Invoice deleted successfully!");
        fetchInvoices();
      } else {
        alert("Error deleting invoice.");
      }
    } catch (error) {
      console.error("Error deleting invoice:", error);
      alert(error.response?.data?.message || "Error deleting invoice.");
    }
  };

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredInvoices.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredInvoices.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-4 p-4">
      <h1 className="text-xl font-bold">Invoices Report</h1>

      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search by name or invoice number..."
          className="border p-2 bg-white rounded px-4 w-64"
          onChange={handleSearch}
        />
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          onClick={() => setAddModal(true)}
        >
          Add Invoice
        </button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 mt-4">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 p-2">S.No</th>
                  <th className="border border-gray-300 p-2">Invoice No</th>
                  <th className="border border-gray-300 p-2">Customer Name</th>
                  <th className="border border-gray-300 p-2">Due Date</th>
                  <th className="border border-gray-300 p-2">Amount</th>
                  <th className="border border-gray-300 p-2">Paid</th>
                  <th className="border border-gray-300 p-2">Amount Due</th>
                  <th className="border border-gray-300 p-2">Description</th>
                  <th className="border border-gray-300 p-2">Status</th>
                  <th className="border border-gray-300 p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((invoice, index) => (
                  <tr key={invoice._id}>
                    <td className="border border-gray-300 p-2">{indexOfFirstItem + index + 1}</td>
                    <td className="border border-gray-300 p-2">{invoice.inv}</td>
                    <td className="border border-gray-300 p-2">{invoice.name}</td>
                    <td className="border border-gray-300 p-2">{formatDate(invoice.due_date)}</td>
                    <td className="border border-gray-300 p-2">{invoice.amount}</td>
                    <td className="border border-gray-300 p-2">{invoice.paid}</td>
                    <td className="border border-gray-300 p-2">{invoice.amount_due}</td>
                    <td className="border border-gray-300 p-2">{invoice.descriptions}</td>
                    <td className="border border-gray-300 p-2">{invoice.status}</td>
                    <td className="border border-gray-300 p-2 space-x-2">
                      <button
                        className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                        onClick={() => handleEdit(invoice)}
                      >
                        Edit
                      </button>
                      <button
                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                        onClick={() => handleDelete(invoice._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredInvoices.length > 0 && (
            <div className="flex justify-center items-center mt-4 space-x-2">
              <button
                className="px-3 py-1 border rounded disabled:opacity-50"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-white"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                className="px-3 py-1 border rounded disabled:opacity-50"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}

          {filteredInvoices.length === 0 && !loading && (
            <div className="text-center mt-4 text-gray-500">No records found</div>
          )}
        </>
      )}

      {/* Modal */}
      {addModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
            <button
              className="absolute top-3 right-4 text-2xl font-bold"
              onClick={closeModal}
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4">
              {editInvoice ? "Edit Invoice" : "Add Invoice"}
            </h2>

            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <input
                type="text"
                name="inv"
                value={formData.inv}
                onChange={handleChange}
                placeholder="Invoice Number"
                required
                className="border p-2 rounded"
              />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Customer Name"
                required
                className="border p-2 rounded"
              />
              <input
                type="date"
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                required
                className="border p-2 rounded"
              />
              <input
                type="number"
                name="amount"
                min="1"
                value={formData.amount}
                onChange={handleChange}
                placeholder="Amount"
                required
                className="border p-2 rounded"
              />
              <input
                type="number"
                name="paid"
                min="0"
                value={formData.paid}
                onChange={handleChange}
                placeholder="Paid"
                required
                className="border p-2 rounded"
              />
              <input
                type="number"
                name="amount_due"
                value={formData.amount_due}
                readOnly
                placeholder="Amount Due"
                className="border p-2 rounded bg-gray-100"
              />
              <textarea
                name="descriptions"
                value={formData.descriptions}
                onChange={handleChange}
                placeholder="Descriptions"
                required
                className="border p-2 rounded"
              />
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="border p-2 rounded"
              >
                <option value="">Select Status</option>
                <option value="unpaid">Unpaid</option>
                <option value="partially paid">Partially Paid</option>
                <option value="paid">Paid</option>
              </select>

              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white p-3 rounded hover:bg-green-700"
                >
                  {editInvoice ? "Save Changes" : "Add Invoice"}
                </button>
                {editInvoice && (
                  <button
                    type="button"
                    className="flex-1 bg-red-600 text-white p-3 rounded hover:bg-red-700"
                    onClick={closeModal}
                  >
                    Cancel
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

export default Invoices;