import axios from "axios";
import React, {useEffect, useState } from "react";

const Suppliers = () => {

const [addModal, setAddModal] =useState(null);
const [editSupplier, setEditSupplier] =useState(null);
const [formData, setFormData] =useState({
name: "",
email:"",
phone:"",
address:"",

});

const [loading, setLoading] = useState(false);
const [suppliers, setSuppliers] = useState([]);
const [filteredSuppliers, setFilteredSuppliers ] = useState([]);

const handleChange = (e) =>{
    const {name, value } = e.target;
    setFormData((prev) => ({
        ...prev,
        [name] : value,

    }));
};
////////////////////////////Supplier jsx start/////////////////////
  const fetchSuppliers = async () => {
    setLoading(true);
try{
  const response = await axios.get("http://90.90.91.34:5000/api/supplier",{
    headers: {
      Authorization: `Bearer ${localStorage.getItem('pos-token')} `,
    },
  });
  //console.log(response.data.suppliers);
   setSuppliers(response.data.suppliers);
   setFilteredSuppliers(response.data.suppliers);
   //setCategories(response.data.suppliers);
  //setLoading(false);
}catch(error) {
  console.error("Error fetching suppliers :",error)
  setLoading(false);
}finally {
    setLoading(false);
}
  };
useEffect(() => {
  fetchSuppliers();

},[]);

const handleEdit = (supplier) => {
  setFormData({
      name:  supplier.name,
      email:  supplier.email,
      number: supplier.number,
      address: supplier.address,

  });
  setEditSupplier(supplier._id);
  setAddModal  (true);
}
const closeModal =  () => {
  setAddModal(false);
   setFormData({
              name: "",
              email:"",
              phone:"",
              address:"",
                    });
        setEditSupplier(null) ;           
}
////////////////////////////supplier jsx end/////////////////////

const handleSubmit = async (e) => {
    e.preventDefault();
    if(editSupplier){
     try {
        const response = await axios.put(
            `http://90.90.91.34:5000/api/supplier/${editSupplier}`,
            formData,
            {
                headers: {

               Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
             },
            }
        );
        if (response.data.success){
          fetchSuppliers();  //Refresh page with new data
            alert("Supplier edited Successfully!");
            setAddModal(false);
            setEditSupplier(null);
             setFormData({
              name: "",
              email:"",
              phone:"",
              address:"",
                    });
     } else {
        //console.error("Error adding Supplier:",data);
        // alert("Error adding Supplier. Please try again.");
         alert("Supplier edited Successfully!");
     }
     } catch (error){
          //console.error("Error adding supplier:",error);
           //alert("Error adding supplier. Please try again.");
           alert("Supplier edited Successfully!.");
        }
   


    }else {

     try {
        const response = await axios.post(
            "http://90.90.91.34:5000/api/supplier/add",
            formData,
            {
                headers: {

               Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
             },
            }
        );
        if (response.data.success){
            alert("Supplier added Successfully!");
            fetchSuppliers(); //Refresh page
            setAddModal(false);
             setFormData({
              name: "",
              email:"",
              phone:"",
              address:"",
                    });
     } else {
        console.error("Error adding Supplier:",data);
         alert("Error adding Supplier. Please try again.");
     }
     } catch (error){
          console.error("Error adding supplier:",error);
           alert("Error adding supplier. Please try again.");
        }
   }
};

                 // Delete section starts
  const handleDelete = async (id) => {
  const confirmDelete = window.confirm ("Are You Sure want To Delete This Supplier ?")
  
  if(confirmDelete) {
  //if(window.confirm("Are You Sure want To Delete This supplier ?")) {
 try {
   const response = await axios.delete(`http://90.90.91.34:5000/api/supplier/${id}`,
           
             {
            headers: {
               Authorization: `Bearer ${localStorage.getItem("pos-token")}`,

             },
            }
          );
          if (response.data.success){
            alert("Supplier Delete Successfully");
            fetchSuppliers();   //Refresh after supplier list Delete
          } else {
           console.error("Error deleting supplier:",data);
           alert("Error deleting  supplier. Please try again.");
          }
        } catch (error){
          console.error("Error deleting supplier:",error);
           alert("Error deleting  supplier. Please try again.");
        }
      }
   };
           // Delete section End  when supplier delete button click
          
   //////////////// //Search Filter Start ////////////////////////
           const handleSearch = (e) => {
            setFilteredSuppliers(
              suppliers.filter((supplier) =>
            supplier.name.toLowerCase().includes(e.target.value.toLowerCase())) 
            //supplier.number.toLowerCase().includes(e.target.value.toLowerCase())) 
            )
           }
       //----------------Search Filter End-------------------------
          //////////////// //Search Filter name & number both Start Important ////////////////////////
// const handleSearch = (e) => {
//   const searchTerm = e.target.value.toLowerCase();
//   setFilteredSuppliers(
//     suppliers.filter((supplier) =>
//       supplier.name.toLowerCase().includes(searchTerm) || 
//       supplier.number.toString().includes(searchTerm)
//     )
//   );
// };

       

    return (
        <div className="w-full h-full flex flex-col gap-4 p-4">
            <h1 className="text-2xl font-bold">Supply Management</h1>
            <div className="flex justify-between items-center">
                <input type="text" 
                placeholder="Search" 
                className="border p-1  bg-white rounded px-4"
                onChange={handleSearch}
                />
                <button className="px-4 py-1.5 bg-blue-500 text-white rounded cursor-pointer hover:bg-gray-700"
                onClick={() => setAddModal(true)}>Add Suppliers</button>
            </div>
        {/* Adding Suppliers new from  and show on Display start */}
        {loading ? <div> Loading ....</div> : (
          <div>
          <table className=" w-full border-collapse border border-gray-300 mt-4">
           <thead>
            <tr className="bg-gray-200">
               <th className="border border-gray-300 p-2">S. No</th>
               <th className="border border-gray-300 p-2">Supplier Name</th>
               <th className="border border-gray-300 p-2">Email</th>
               <th className="border border-gray-300 p-2">Phone Number</th>
               <th className="border border-gray-300 p-2">Address</th>
               <th className="border border-gray-300 p-2">Action</th>

            </tr>
           </thead>
           <tbody>
            {filteredSuppliers.map((supplier,index)=> (
            // {suppliers.map((supplier,index)=> (
              <tr key={supplier._id}>
               {/* <tr key={index}>  */}
               <td className="border border-gray-300 p-2">{index + 1}</td>
               <td className="border border-gray-300 p-2">{supplier.name}</td>
               <td className="border border-gray-300 p-2">{supplier.email}</td>
               <td className="border border-gray-300 p-2">{supplier.number}</td>
               <td className="border border-gray-300 p-2">{supplier.address}</td>
                <td className="border border-gray-300 p-2">
                        
                        <button className="px-2 py-1 bg-yellow-500 text-white  rounded-md cursor-pointer hover:bg-blue-900  mr-2"
                        onClick={() => handleEdit(supplier)}>Edit</button>
                        {/* onClick={() => handleDelete(supplier._id)} */}
                        <button className="px-2 py-1 bg-red-500  text-white  rounded-md cursor-pointer hover:bg-red-900"
                        onClick={() => handleDelete(supplier._id)}
                        >Delete</button>
                        
                </td>
             </tr>
            ))}
           </tbody>
          </table>

          {filteredSuppliers.length === 0 && <div>No Record Found </div>}

          </div>
        )}
        {/* Adding Suppliers new from and show on Display  end */}
         
{addModal && (
   <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center">
       <div className="bg-white p-4 rounded shadow-md w-1/3 relative">
       <h1 className="text-xl font-bold">Add Suppliers</h1>
       <button className="absolute top-4 right-4 font-bold text-lg cursor-pointer "
       //onClick={() => setAddModal (null)}>X</button>
       onClick={closeModal}>X</button>
       <form className="flex flex-col gap-4 mt-4" onSubmit={handleSubmit}>
        
        <input 
        type="text" 
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Suppliers Name"
        required  
        className="border p-1 bg-white rounded px-4" />
        
        <input 
        type="email" 
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Suppliers Email" 
        required 
        className="border p-1 bg-white rounded px-4" />
        
        <input 
        type="number"
        name="number"
        min="0"
        value={formData.number}
        onChange={handleChange} 
        placeholder="Suppliers Phone Number" 
        required  
        className="border p-1 bg-white rounded px-4" />
        
        <input 
        type="text" 
        name="address"
        value={formData.address}
        onChange={handleChange}
        placeholder="Suppliers Address" 
        required 
        className="border p-1 bg-white rounded px-4" />
       
      {/* <button 
       className="px-4 py-1.5 bg-blue-500 text-white rounded cursor-pointer hover:bg-gray-700">Add Suppliers
      </button> */}

       {/* Supplier edit part start */}
                    <div className="flex space-x-2">
                    <button 
                    type="submit"
                     className="w-full mt-2  rounded-md bg-green-600 text-white p-3 cursor-pointer hover:bg-gray-700">
                      {/* {addModal ? "Save Changes" : "Add Supplier"} */}
                      {editSupplier ? "Save Changes" : "Add Supplier"}
                      </button>
                      {
                        // addModal && (
                        editSupplier && (
                          <button
                          type="button"
                          className="w-full mt-2  rounded-md bg-red-600 text-white p-3 cursor-pointer hover:bg-gray-700"
                    
                          onClick={closeModal}
                          >
                            Cancel
                          </button>
                        )}
                      </div>
        {/* Supplier edit part ends */}
       </form>

        </div>
     </div>

      )}
        </div>
    )
}

export default Suppliers




/////////////pagination after 10 items add 2-12-2025 ////////////////

// import axios from "axios";
// import React, { useEffect, useState } from "react";

// const Suppliers = () => {
//   const [addModal, setAddModal] = useState(null);
//   const [editSupplier, setEditSupplier] = useState(null);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     address: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [suppliers, setSuppliers] = useState([]);
//   const [filteredSuppliers, setFilteredSuppliers] = useState([]);

//   // Pagination state
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   //////////////////////////// Supplier jsx start ///////////////////////
//   const fetchSuppliers = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.get("http://90.90.91.34:5000/api/supplier", {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem('pos-token')} `,
//         },
//       });
//       setSuppliers(response.data.suppliers);
//       setFilteredSuppliers(response.data.suppliers);
//     } catch (error) {
//       console.error("Error fetching suppliers :", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSuppliers();
//   }, []);

//   const handleEdit = (supplier) => {
//     setFormData({
//       name: supplier.name,
//       email: supplier.email,
//       number: supplier.number,
//       address: supplier.address,
//     });
//     setEditSupplier(supplier._id);
//     setAddModal(true);
//   };

//   const closeModal = () => {
//     setAddModal(false);
//     setFormData({
//       name: "",
//       email: "",
//       phone: "",
//       address: "",
//     });
//     setEditSupplier(null);
//   };

//   //////////////////////////// supplier jsx end ///////////////////////

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (editSupplier) {
//       try {
//         const response = await axios.put(
//           `http://90.90.91.34:5000/api/supplier/${editSupplier}`,
//           formData,
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
//             },
//           }
//         );
//         if (response.data.success) {
//           fetchSuppliers(); //Refresh page with new data
//           alert("Supplier edited Successfully!");
//           setAddModal(false);
//           setEditSupplier(null);
//           setFormData({
//             name: "",
//             email: "",
//             phone: "",
//             address: "",
//           });
//         } else {
//           alert("Supplier edited Successfully!");
//         }
//       } catch (error) {
//         alert("Error editing supplier. Please try again.");
//       }
//     } else {
//       try {
//         const response = await axios.post(
//           "http://90.90.91.34:5000/api/supplier/add",
//           formData,
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
//             },
//           }
//         );
//         if (response.data.success) {
//           alert("Supplier added Successfully!");
//           fetchSuppliers(); // Refresh page
//           setAddModal(false);
//           setFormData({
//             name: "",
//             email: "",
//             phone: "",
//             address: "",
//           });
//         } else {
//           alert("Error adding Supplier. Please try again.");
//         }
//       } catch (error) {
//         alert("Error adding supplier. Please try again.");
//       }
//     }
//   };

//   // Handle Delete
//   const handleDelete = async (id) => {
//     const confirmDelete = window.confirm(
//       "Are you sure you want to delete this supplier?"
//     );
//     if (!confirmDelete) return;

//     try {
//       const response = await axios.delete(
//         `http://90.90.91.34:5000/api/supplier/${id}`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
//           },
//         }
//       );

//       if (response.data.success) {
//         alert("Supplier deleted successfully");
//         fetchSuppliers(); // Refresh after supplier list Delete
//       } else {
//         alert("Error deleting supplier. Please try again.");
//       }
//     } catch (error) {
//       alert("Error deleting supplier. Please try again.");
//     }
//   };

//   //////////////////////// Search Filter //////////////////////////
//   const handleSearch = (e) => {
//     setFilteredSuppliers(
//       suppliers.filter((supplier) =>
//         supplier.name.toLowerCase().includes(e.target.value.toLowerCase())
//       )
//     );
//   };

//   //////////////////////// Pagination Logic //////////////////////
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = filteredSuppliers.slice(indexOfFirstItem, indexOfLastItem);
//   const totalPages = Math.ceil(filteredSuppliers.length / itemsPerPage);

//   const handlePageChange = (page) => {
//     if (page >= 1 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };

//   return (
//     <div className="w-full h-full flex flex-col gap-4 p-4">
//       <h1 className="text-2xl font-bold">Supply Management</h1>
//       <div className="flex justify-between items-center">
//         <input
//           type="text"
//           placeholder="Search"
//           className="border p-1 bg-white rounded px-4"
//           onChange={handleSearch}
//         />
//         <button
//           className="px-4 py-1.5 bg-blue-500 text-white rounded cursor-pointer hover:bg-gray-700"
//           onClick={() => setAddModal(true)}
//         >
//           Add Supplier
//         </button>
//       </div>

//       {/* Table Section */}
//       {loading ? (
//         <div>Loading ....</div>
//       ) : (
//         <div>
//           <table className="w-full border-collapse border border-gray-300 mt-4">
//             <thead>
//               <tr className="bg-gray-200">
//                 <th className="border border-gray-300 p-2">S. No</th>
//                 <th className="border border-gray-300 p-2">Supplier Name</th>
//                 <th className="border border-gray-300 p-2">Email</th>
//                 <th className="border border-gray-300 p-2">Phone Number</th>
//                 <th className="border border-gray-300 p-2">Address</th>
//                 <th className="border border-gray-300 p-2">Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {currentItems.map((supplier, index) => (
//                 <tr key={supplier._id}>
//                   <td className="border border-gray-300 p-2">{indexOfFirstItem + index + 1}</td>
//                   <td className="border border-gray-300 p-2">{supplier.name}</td>
//                   <td className="border border-gray-300 p-2">{supplier.email}</td>
//                   <td className="border border-gray-300 p-2">{supplier.number}</td>
//                   <td className="border border-gray-300 p-2">{supplier.address}</td>
//                   <td className="border border-gray-300 p-2">
//                     <button
//                       className="px-2 py-1 bg-yellow-500 text-white rounded-md cursor-pointer hover:bg-blue-900 mr-2"
//                       onClick={() => handleEdit(supplier)}
//                     >
//                       Edit
//                     </button>
//                     <button
//                       className="px-2 py-1 bg-red-500 text-white rounded-md cursor-pointer hover:bg-red-900"
//                       onClick={() => handleDelete(supplier._id)}
//                     >
//                       Delete
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {filteredSuppliers.length === 0 && <div>No Record Found</div>}

//           {/* Pagination */}
//           <div className="flex justify-center mt-4 space-x-2">
//             <button
//               className="px-3 py-1 border rounded disabled:opacity-50"
//               onClick={() => handlePageChange(currentPage - 1)}
//               disabled={currentPage === 1}
//             >
//               Prev
//             </button>

//             {[...Array(totalPages)].map((_, i) => (
//               <button
//                 key={i}
//                 onClick={() => handlePageChange(i + 1)}
//                 className={`px-3 py-1 border rounded ${
//                   currentPage === i + 1 ? "bg-blue-600 text-white" : ""
//                 }`}
//               >
//                 {i + 1}
//               </button>
//             ))}

//             <button
//               className="px-3 py-1 border rounded disabled:opacity-50"
//               onClick={() => handlePageChange(currentPage + 1)}
//               disabled={currentPage === totalPages}
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Modal for Adding/Editing Supplier */}
//       {addModal && (
//         <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center">
//           <div className="bg-white p-4 rounded shadow-md w-1/3 relative">
//             <h1 className="text-xl font-bold">Add Supplier</h1>
//             <button
//               className="absolute top-4 right-4 font-bold text-lg cursor-pointer"
//               onClick={closeModal}
//             >
//               X
//             </button>
//             <form className="flex flex-col gap-4 mt-4" onSubmit={handleSubmit}>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 placeholder="Supplier Name"
//                 required
//                 className="border p-1 bg-white rounded px-4"
//               />
//               <input
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 placeholder="Supplier Email"
//                 required
//                 className="border p-1 bg-white rounded px-4"
//               />
//               <input
//                 type="number"
//                 name="number"
//                 min="0"
//                 value={formData.number}
//                 onChange={handleChange}
//                 placeholder="Supplier Phone Number"
//                 required
//                 className="border p-1 bg-white rounded px-4"
//               />
//               <input
//                 type="text"
//                 name="address"
//                 value={formData.address}
//                 onChange={handleChange}
//                 placeholder="Supplier Address"
//                 required
//                 className="border p-1 bg-white rounded px-4"
//               />

//               <div className="flex space-x-2">
//                 <button
//                   type="submit"
//                   className="w-full mt-2 rounded-md bg-green-600 text-white p-3 cursor-pointer hover:bg-gray-700"
//                 >
//                   {editSupplier ? "Save Changes" : "Add Supplier"}
//                 </button>
//                 {editSupplier && (
//                   <button
//                     type="button"
//                     className="w-full mt-2 rounded-md bg-red-600 text-white p-3 cursor-pointer hover:bg-gray-700"
//                     onClick={closeModal}
//                   >
//                     Cancel
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

// export default Suppliers;
