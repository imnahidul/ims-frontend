
/////////////////////product stock date add  18,22-12-2026///////////////////

// import axios from "axios";
// import React, {useEffect, useState } from "react";

// const Products = () => {
//  const [openModal, setOpenModal] = useState (false);
//  const [editProduct,setEditProduct]=useState(null);
//  const [categories, setCategories] = useState([]);
//  const [suppliers, setSuppliers] = useState([]);
//  const [products, setProducts] = useState([]);
//  const [filteredProducts, setFilteredProducts ] = useState([]);
// const [formData, setFormData] =useState({
//                name: "",
//               description:"",
//               price:"",
//               stock:"",
//               stockDate: "",
//               categoryId:"",
//               supplierId:"",

// });


//  const fetchProducts = async () =>{
    
//     try{
//   const response = await axios.get("http://localhost:5000/api/products",{
//     headers: {
//       Authorization: `Bearer ${localStorage.getItem('pos-token')} `,
//     },
//   });
//   if(response.data.success){
//   //console.log(response.data.suppliers);
//    setSuppliers(response.data.suppliers);
//    setCategories(response.data.categories);
//    setProducts(response.data.products);
//    setFilteredProducts(response.data.products);
//   } else {
//      console.error("Error fetching products :",response.data.message);
//      alert("Error fetching product. Please try again.");
//   }

// }catch(error) {
//   console.error("Error fetching products :",error);
// }

//  };
 
//  useEffect(() => {
//    fetchProducts();
 
//  },[]);
 
//  const handleChange = (e) =>{
//     const {name, value } = e.target;
//     setFormData((prevData) => ({
//         ...prevData,
//         [name] : value,

//     }));
// };

// const handleEdit = (product) =>{
//     setOpenModal(true);
//     setEditProduct(product._id);
//     //setEditProduct(true);
//   setFormData({
//       name: product.name ,
//       description: product.description,
//       price: product.price,
//       stock: product.stock,
//       stockDate: product.stockDate ? new Date(product.stockDate).toISOString().split('T')[0] : '',
//       categoryId: product.categoryId._id,
//       supplierId: product.supplierId._id,
      
//   });

// };
//   const handleDelete = async (id) => {
//   const confirmDelete = window.confirm ("Are You Sure want To Delete This Product ?")
  
//   if(confirmDelete) {
//   //if(window.confirm("Are You Sure want To Delete This supplier ?")) {
//  try {
//    const response = await axios.delete(`http://localhost:5000/api/products/${id}`,
           
//              {
//             headers: {
//                Authorization: `Bearer ${localStorage.getItem("pos-token")}`,

//              },
//             }
//           );
//           if (response.data.success){
//             alert("Product Delete Successfully");
//             fetchProducts();   //Refresh after supplier list Delete
//           } else {
//            console.error("Error deleting product:",data);
//            alert("Error deleting  supplier. Please try again.");
//           }
//         } catch (error){
//           console.error("Error deleting product:",error);
//            alert("Error deleting  supplier. Please try again.");
//         }
//       }
//    };

// const closeModal =  () => {
//   setOpenModal(false);
//   setEditProduct(null);
//   //setEditProduct(false);
//    setFormData({
//               name: "",
//               description:"",
//               price:"",
//               stock:"",
//               stockDate: "",
//               categoryId:"",
//               supplierId:"",
//                     });          
// }

// //////////////handleSubmit part start product/////////////
// const handleSubmit = async (e) => {
//     e.preventDefault();
//       if(editProduct){
//      try {
//         const response = await axios.put(
//             `http://localhost:5000/api/products/${editProduct}`,
//             formData,
//             {
//                 headers: {

//                Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
//              },
//             }
//         );
//         if (response.data.success){
//             alert("Product Updated Successfully!");
//             fetchProducts();  //Refresh page with new data
//             setOpenModal(false);
//             setEditProduct(null);
//              setFormData({
//               name: "",
//               description:"",
//               price:"",
//               stock:"",
//               stockDate: "",
//               categoryId:"",
//               supplierId:"",
//                     });
//      } else {
//         //console.error("Error adding Product:",data);
//          alert("Error Updating Product. Please try again.");
//          //alert("Product edited Successfully!");
//      }
//      } catch (error){
//           //console.error("Error adding product:",error);
//            alert("Error updating product. Please try again.");
//            //alert("Product edited Successfully!.");
//         }
   
//      return;    

//      }else {

//      try {
//         const response = await axios.post(
//             "http://localhost:5000/api/products/add",
//             formData,
//             {
//                 headers: {

//                Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
//              },
//             }
//         );
//         if (response.data.success){
//             alert("Product added Successfully!");
//             fetchProducts(); //Refresh page
//             setOpenModal(false);
//             //openModal(false);
//              setFormData({
//               name: "",
//               description:"",
//               price:"",
//               stock:"",
//               stockDate: "",
//               categoryId:"",
//               supplierId:"",
//                     });
//      } else {
//         //console.error("Error adding Product:",data);
//          alert("Error adding product. Please try again.");
//      }
//      } catch (error){
//           //console.error("Error adding product:",error);
//            alert("Error adding product. Please try again.");
//      } 
//    }
// };
// ///handleSubmit part end/////////////

//    //////////////// //Search Filter Start ////////////////////////
//            const handleSearch = (e) => {
//             setFilteredProducts(
//               products.filter((product) =>
//             product.name.toLowerCase().includes(e.target.value.toLowerCase())) 
//             //supplier.number.toLowerCase().includes(e.target.value.toLowerCase())) 
//             )
//            }
//        //----------------Search Filter End-------------------------

//     return (
// <div className="w-full h-full flex flex-col gap-4 p-4">
//     <h1 className="text-2xl font-bold ">Products Management</h1>
//             <div className="flex justify-between items-center">
//                 <input type="text" 
//                 placeholder="Search" 
//                 className="border p-1  bg-white rounded px-4"
//                 onChange={handleSearch}
//                 />
//                 <button className="px-4 py-1.5 bg-blue-500 text-white rounded cursor-pointer hover:bg-gray-700"
//                  onClick={() => setOpenModal(true)}
//                  //onClick={() => setOpenModal(false)}
//                 >Add Products</button>
//             </div>
//            {/* 43.52 part started from data Start */}
//             <div> 
//           <table className=" w-full border-collapse border border-gray-300 mt-4">
//            <thead>
//             <tr className="bg-gray-200">
//                <th className="border border-gray-300 p-2 ">S. No</th>
//                <th className="border border-gray-300 p-2">Product Name</th>
//                <th className="border border-gray-300 p-2">Category Name</th>
//                <th className="border border-gray-300 p-2">Supplier Name</th>
//                <th className="border border-gray-300 p-2">Price</th>
//                <th className="border border-gray-300 p-2">Stock</th>
//                <th className="border border-gray-300 p-2">Stock Date</th>
//                <th className="border border-gray-300 p-2">Action</th>

//             </tr>
//            </thead>
//            <tbody>
//               {filteredProducts && filteredProducts.map((product,index)=> (
//             // {products.map((product,index)=> (
           
//               <tr key={product._id}>
//                {/* <tr key={index}>  */}
//                <td className="border border-gray-300 p-2">{index + 1}</td>
//                <td className="border border-gray-300 p-2">{product.name}</td>
//                <td className="border border-gray-300 p-2">{product.categoryId.categoryName}</td>
//                <td className="border border-gray-300 p-2">{product.supplierId.name}</td>
//                <td className="border border-gray-300 p-2">{product.price}</td>
//                <td className="border border-gray-300 p-2">
//                 <span className=" rounded-full font-semibold">
//                     {product.stock == 0 ?(
//                      <span className="bg-red-100  text-red-500 px-2 py-1 rounded-full ">{product.stock}</span>
//                     ): product.stock < 5 ?(
//                       <span className="bg-yellow-100 text-green-500 px-2 py-1 rounded-full">{product.stock}</span>
//                     ): (<span className="bg-green-100 text-green-500 px-2 py-1 rounded-full">{product.stock}</span>)}
//                 </span>
//                </td>
//                {/* <td className="border border-gray-300 p-2">
//                {product.stockDate ? new Date(product.stockDate).toLocaleDateString() : 'N/A'}
//                 </td> */}
//               <td className="border border-gray-300 p-2">
//                 {product.stockDate
//                    ? new Date(product.stockDate + 'T12:00:00').toLocaleDateString('en-GB', {
//                        day: '2-digit',
//                        month: 'short',
//                        year: 'numeric'
//                        })
//                       : 'N/A'
//                           }
//                </td>

//                 <td className="border border-gray-300 p-2">
                        
//                         <button className="px-2 py-1 bg-yellow-500 text-white  rounded-md cursor-pointer hover:bg-blue-900  mr-2"
//                         onClick={() => handleEdit(product)}>Edit</button>
//                         {/* onClick={() => handleDelete(supplier._id)} */}
//                         <button className="px-2 py-1 bg-red-500  text-white  rounded-md cursor-pointer hover:bg-red-900"
//                         onClick={() => handleDelete(product._id)}
//                         >Delete</button>
                        
//                 </td>
//              </tr>
//             ))}
//            </tbody>
//           </table>

//           {filteredProducts.length === 0 && <div>No Record Found </div>}

//           </div>
//        {/* 43.52 part started from data End*/}
            
//             {openModal && (
//                   <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center">
//        <div className="bg-white p-4 rounded shadow-md w-1/3 relative">
//        <h1 className="text-xl font-bold">Add Product</h1>
//        <button className="absolute top-4 right-4 font-bold text-lg cursor-pointer "
//        //onClick={() => setAddModal (null)}>X</button>
//        //onClick={() => setOpenModal(false)}>X</button>
//        onClick={closeModal}>X</button>
   
//        <form className="flex flex-col gap-4 mt-4"  onSubmit={handleSubmit}>
//             {/* onSubmit={handleSubmit} */}
//         <input 
//         type="text" 
//         name="name"
//          value={formData.name}
//           onChange={handleChange}
//         placeholder="Product Name" 
//         className="border p-1 bg-white rounded px-4" />
        
//         <input 
//         type="text" 
//         name="description"
//          value={formData.description}
//          onChange={handleChange}
//         placeholder="Description" 
//         className="border p-1 bg-white rounded px-4" />
        
//         <input 
//         type="number"
//         min="0"
//         name="price"
//         value={formData.price}
//         onChange={handleChange} 
//         placeholder="Enter Price" 
//         className="border p-1 bg-white rounded px-4" />
        
//         <input 
//         type="number" 
//          min="0"
//         name="stock"
//          value={formData.stock}
//          onChange={handleChange}
//         placeholder="Enter Stock" 
//         className="border p-1 bg-white rounded px-4" />

//         <input 
//   type="date" 
//   name="stockDate"
//   value={formData.stockDate}
//   onChange={handleChange}
//   min={new Date().toISOString().split("T")[0]}
//   placeholder="Stock Date" 
//   className="border p-1 bg-white rounded px-4" 
// />
        
//         {/* <div className="w-full border">
//             <select name="category" className="w-full p-2">
//                 <option value="" >Select Category</option>
//                 {categories && categories.map((category) =>(
//                     <option key={category._id} value={category._id}>
//                         {category.categoryName}

//                     </option>
//                 ))}
//             </select>
//         </div>
//         <div className="w-full border">
//             <select name="supplier" className="w-full p-2">
//                 <option value="" >Select supplier</option>
//                 {suppliers && suppliers.map((supplier) =>(
//                     <option key={supplier._id} value={supplier._id}>
//                         {supplier.name}

//                     </option>
//                 ))}
//             </select>
//         </div> */}

//              {/* Gemini Correction Starts from Here*/}
//         <div className="w-full border">
//     <select 
//         name="categoryId" //  Changed to match formData key
//         value={formData.categoryId} //  Added value binding
//         onChange={handleChange} //  Added change handler
//         className="w-full p-2"
//     >
//         <option value="" >Select Category</option>
//         {categories && categories.map((category) => (
//             <option key={category._id} value={category._id}>
//                 {category.categoryName}
//             </option>
//         ))}
//     </select>
// </div>

// <div className="w-full border">
//     <select 
//         name="supplierId" //  Changed to match formData key
//         value={formData.supplierId} //  Added value binding
//         onChange={handleChange} //  Added change handler
//         className="w-full p-2"
//     >
//         <option value="" >Select supplier</option>
//         {suppliers && suppliers.map((supplier) => (
//             <option key={supplier._id} value={supplier._id}>
//                 {supplier.name}
//             </option>
//         ))}
//     </select>
//     </div>
//      {/* Gemini support Correction End */}
       
//       {/* <button 
//        className="px-4 py-1.5 bg-blue-500 text-white rounded cursor-pointer hover:bg-gray-700">Add Suppliers
//       </button> */}

//        {/* product from  new  part start */}
//                     <div className="flex space-x-2">
//                     <button 
//                     type="submit"
//                      className="w-full mt-2  rounded-md bg-green-600 text-white p-3 cursor-pointer hover:bg-gray-700">
                      
//                       {editProduct ? "Save Changes" : "Add Product"}
                     
//                       {/* Add Product */}
//                       </button>
            
                     
                       
//                           <button
//                           type="button"
//                           className="w-full mt-2  rounded-md bg-red-600 text-white p-3 cursor-pointer hover:bg-gray-700"
                    
//                           //onClick={() => setOpenModal(false)}
//                           onClick={closeModal}
//                           >
//                             Cancel
//                           </button>
                       
//                       </div>
//         {/* product from new button part ends */}
//        </form>

//         </div>
//      </div>
//             )}
            
//     </div>
//     )
// }

// export default Products










////////////////use pagination 29,23-12-25//////////////////////////////
import axios from "axios";
import React, { useEffect, useState } from "react";

const Products = () => {
  const [openModal, setOpenModal] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    stockDate: "",
    categoryId: "",
    supplierId: "",
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/products", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });

      if (response.data.success) {
        setSuppliers(response.data.suppliers || []);
        setCategories(response.data.categories || []);
        setProducts(response.data.products || []);
        setFilteredProducts(response.data.products || []);
      } else {
        alert(response.data.message || "Failed to load products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      alert("Error fetching products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEdit = (product) => {
    setOpenModal(true);
    setEditProduct(product._id);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      stockDate: product.stockDate
        ? new Date(product.stockDate).toISOString().split("T")[0]
        : "",
      categoryId: product.categoryId?._id || "",
      supplierId: product.supplierId?._id || "",
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });

      if (response.data.success) {
        alert("Product deleted successfully!");
        fetchProducts();
      } else {
        alert(response.data.message || "Error deleting product.");
      }
    } catch (error) {
      alert("Error deleting product. Please try again.");
    }
  };

  const closeModal = () => {
    setOpenModal(false);
    setEditProduct(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      stock: "",
      stockDate: "",
      categoryId: "",
      supplierId: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editProduct) {
        const response = await axios.put(
          `http://localhost:5000/api/products/${editProduct}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
            },
          }
        );
        if (response.data.success) {
          alert("Product updated successfully!");
          fetchProducts();
          closeModal();
        } else {
          alert(response.data.message || "Error updating product.");
        }
      } else {
        const response = await axios.post(
          "http://localhost:5000/api/products/add",
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
            },
          }
        );
        if (response.data.success) {
          alert("Product added successfully!");
          fetchProducts();
          closeModal();
        } else {
          alert(response.data.message || "Error adding product.");
        }
      }
    } catch (error) {
      alert("Error saving product. Please try again.");
    }
  };

  // Search Filter
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(query)
    );
    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page on search
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">Products Management</h1>

      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search"
          className="border p-1 bg-white rounded px-4"
          onChange={handleSearch}
        />
        <button
          className="px-4 py-1.5 bg-blue-500 text-white rounded cursor-pointer hover:bg-gray-700"
          onClick={() => setOpenModal(true)}
        >
          Add Product
        </button>
      </div>

      {/* Table Section */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <table className="w-full border-collapse border border-gray-300 mt-4">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-2">S. No</th>
                <th className="border border-gray-300 p-2">Product Name</th>
                <th className="border border-gray-300 p-2">Category</th>
                <th className="border border-gray-300 p-2">Supplier</th>
                <th className="border border-gray-300 p-2">Price</th>
                <th className="border border-gray-300 p-2">Stock</th>
                <th className="border border-gray-300 p-2">Stock Date</th>
                <th className="border border-gray-300 p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((product, index) => (
                  <tr key={product._id}>
                    <td className="border border-gray-300 p-2">
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td className="border border-gray-300 p-2">{product.name}</td>
                    <td className="border border-gray-300 p-2">
                      {product.categoryId?.categoryName || "N/A"}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {product.supplierId?.name || "N/A"}
                    </td>
                    <td className="border border-gray-300 p-2">{product.price}</td>
                    <td className="border border-gray-300 p-2">
                      <span
                        className={`px-2 py-1 rounded-full font-semibold ${
                          product.stock === 0
                            ? "bg-red-100 text-red-500"
                            : product.stock < 5
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="border border-gray-300 p-2">
                      {product.stockDate
                        ? new Date(product.stockDate).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "N/A"}
                    </td>
                    <td className="border border-gray-300 p-2">
                      <button
                        className="px-2 py-1 bg-yellow-500 text-white rounded-md cursor-pointer hover:bg-yellow-700 mr-2"
                        onClick={() => handleEdit(product)}
                      >
                        Edit
                      </button>
                      <button
                        className="px-2 py-1 bg-red-500 text-white rounded-md cursor-pointer hover:bg-red-700"
                        onClick={() => handleDelete(product._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center p-4">
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination Controls */}
          {filteredProducts.length > 0 && (
            <div className="flex justify-center mt-6 space-x-2">
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
        </div>
      )}

      {/* Modal */}
      {openModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center">
          <div className="bg-white p-4 rounded shadow-md w-1/3 relative">
            <h1 className="text-xl font-bold">
              {editProduct ? "Edit Product" : "Add Product"}
            </h1>
            <button
              className="absolute top-4 right-4 font-bold text-lg cursor-pointer"
              onClick={closeModal}
            >
              X
            </button>

            <form className="flex flex-col gap-4 mt-4" onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Product Name"
                required
                className="border p-1 bg-white rounded px-4"
              />
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
                className="border p-1 bg-white rounded px-4"
              />
              <input
                type="number"
                min="0"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter Price"
                required
                className="border p-1 bg-white rounded px-4"
              />
              <input
                type="number"
                min="0"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="Enter Stock"
                required
                className="border p-1 bg-white rounded px-4"
              />
              <input
                type="date"
                name="stockDate"
                value={formData.stockDate}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                className="border p-1 bg-white rounded px-4"
              />

              <div className="w-full border">
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="w-full p-2"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.categoryName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full border">
                <select
                  name="supplierId"
                  value={formData.supplierId}
                  onChange={handleChange}
                  className="w-full p-2"
                  required
                >
                  <option value="">Select Supplier</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier._id} value={supplier._id}>
                      {supplier.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="w-full mt-2 rounded-md bg-green-600 text-white p-3 cursor-pointer hover:bg-green-700"
                >
                  {editProduct ? "Save Changes" : "Add Product"}
                </button>
                <button
                  type="button"
                  className="w-full mt-2 rounded-md bg-red-600 text-white p-3 cursor-pointer hover:bg-red-700"
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;