/////old code with out pagination////////////
// import React, {useEffect, useState } from "react";
// import axios from "axios";
// //import { useEffect } from "react";

// const Categories = () =>  {
// const [categoryName,setCategoryName ] = useState("");
// const [categoryDescription,setCategoryDescription ] = useState("");
// const [categories ,setCategories] = useState([]);
// const [loading, setLoading] = useState(true);
// //const [editCategory,setEditCategory, setCategory] =useState(null);
// const [editCategory,setEditCategory] = useState(null);


// //useEffect(() => {
//   const fetchCategories = async () => {
//     setLoading(true);
// try{
//   const response = await axios.get("http://90.90.91.34:5000/api/category",{
//     headers: {
//       Authorization: `Bearer ${localStorage.getItem('pos-token')} `,
//     },
//   });
//   console.log(response.data.categories);
//   setCategories(response.data.categories);
//   setLoading(false);
// }catch(error) {
//   console.error("Error fetching categories :",error)
// }
//   };
// useEffect(() => {
//   fetchCategories();

// },[]);

// const handleSubmit = async (e) =>{
//         e.preventDefault();
//         if(editCategory){

       
        

//             // const response = await axios.post("http://90.90.91.34:5000/api/category/add",
//             const response = await axios.put(`http://90.90.91.34:5000/api/category/${editCategory}`,
//            {categoryName,categoryDescription},
//             {
//             headers: {
//               //not match 
//                Authorization: `Bearer ${localStorage.getItem("pos-token")}`,

//              },
//             }

//             );
//             if (response.data.success){
//              setEditCategory(null);
//              setCategoryName("");
//              setCategoryDescription("");
//             alert("Category Update Successfully");
              
//                fetchCategories();   //refresh after Edit 
//             } else {
//                    console.error("Error editing category:",data);
//                      alert("Error editing adding category. Please try again.");
//                    }

//                     }else{
//                        const response = await axios.post("http://90.90.91.34:5000/api/category/add",
//            {categoryName,categoryDescription},
//             {
//             headers: {
//               //not match 
//                Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
//              },
//             }

//             );
//              //const response = await responser.json();

          

//             if (response.data.success){
//                //alert("Category added Successfully");
//               setCategoryName("");
//                setCategoryDescription("");
//                alert("Category added Successfully");
//                fetchCategories();   //Refresh after adding New category
//                    console.error("Error adding category:",data);
//                    //console.error("Error adding category:",response.data);
//                      alert("Error adding category. Please try again.");
//                    }

//                     }
//                  };
//                  // Delete section starts
//   const handleDelete = async (id) => {
//   const confirmDelete = window.confirm ("Are You Sure want To Delete This category ?")
  
//   if(confirmDelete) {
//   //if(window.confirm("Are You Sure want To Delete This category ?")) {
//  try {
//    const response = await axios.delete(`http://90.90.91.34:5000/api/category/${id}`,
           
//              {
//             headers: {
//                Authorization: `Bearer ${localStorage.getItem("pos-token")}`,

//              },
//             }
//           );
//           if (response.data.success){
//             alert("Category Delete Successfully");
//             fetchCategories();   //Refresh after category list Delete
//           } else {
//            console.error("Error deleting category:",data);
//            alert("Error deleting  category. Please try again.");
//           }
//         } catch (error){
//           if(error.response) {
//             alert(error.response.data.message);
//           } else {
//              alert("Error deleting  category. Please try again.");
//           }
//           //console.error("Error deleting category:",error);
//           //alert("Error deleting  category. Please try again.");
//         }
//       }
//    };
//            // Delete section End  when category delete button click
// const handleEdit = async (category) => {
//   setEditCategory(category._id);
//   setCategoryName(category.categoryName);
//   setCategoryDescription(category.categoryDescription);
// };
// const handelCancel = async () =>{
//   setEditCategory(null);
//   setCategoryName("");
//   setCategoryDescription("");
// };

// if(loading) return <div> Loading  ...</div>

//     return (
//         <div className="p-4"> 
//           <h1 className="text-2xl font-bold mb-8" >Categories Management </h1>  
//           <div className="flex flex-col lg:flex-row gap-4">
//             <div className="lg:w-1/3">
//             <div className="bg-white shadow-md rounded-lg p-4 ">
//                 <h2 className="text-center text-xl font-bold mb-4">{editCategory ? "Edit category": "Add Categories"}</h2>
                
//                 <form className="space-y-4" onSubmit={handleSubmit}>
//                     <div>
//                     <input 
//                     type= "text" 
//                     placeholder="category Name" 
//                     value={categoryName}
//                     required
//                     className="border w-full p-2 rounded-md"
//                     onChange={(e) => setCategoryName(e.target.value)}
//                     />
//                     </div>
//                     <div>
//                     {/* <input type= "text"  */}
//                     <textarea type= "text" 
//                     placeholder="category Description"
//                     value={categoryDescription}
//                     required
//                      className="border w-full p-2 rounded-md"
//                      onChange={(e) => setCategoryDescription(e.target.value)}
//                     />
//                     </div>
//                     <div className="flex space-x-2">
//                     <button 
//                     type="submit"
//                      className="w-full mt-2  rounded-md bg-green-600 text-white p-3 cursor-pointer hover:bg-gray-700">
//                       {editCategory ? "Save Changes" : "Add Category"}
//                       </button>
//                       {
//                         editCategory && (
//                           <button
//                           type="button"
//                           className="w-full mt-2  rounded-md bg-red-600 text-white p-3 cursor-pointer hover:bg-gray-700"
//                           onClick={handelCancel}
//                           >
//                             Cancel
//                           </button>
//                         )}
//                       </div>
//                 </form>
//                 </div>
//             </div>

//             {/* category table started */}
//              <div className="lg:w-2/3">
//              <div className="bg-white shadow-md rounded-lg p-4">
//               <table className="w-full border-collapse border border-gray-200">
//                 <thead>
//                   <tr className="bg-gray-100">
              
//                     <th className="border border-gray-200 p-2">S.No</th>
//                           <th className="border border-gray-200 p-2">Category Name</th>
//                            <th className="border border-gray-200 p-2">Description</th> 
//                     <th className="border border-gray-200 p-2">Action</th>

//                   </tr>
//                 </thead>

//                 {/* categories data  fetching on displays*/}
//                 <tbody>
//                   {categories.map((category, index) => (
//                     <tr key={index}>
//                       <td className="border border-gray-200 p-2">{index + 1}</td>
//                       <td className="border border-gray-200 p-2">{category.categoryName}</td>
//                         <td className="border border-gray-200 p-2">{category.categoryDescription}</td>   
//                       <td className="border border-gray-200 p-2">
                        
//                         <button className="bg-blue-600  text-white p-2 rounded-md cursor-pointer hover:bg-blue-900 mr-2"
//                         onClick={() => handleEdit(category)}>Edit</button>
//                         <button className="bg-red-600  text-white p-2 rounded-md cursor-pointer hover:bg-red-900"
//                         onClick={() => handleDelete(category._id)}>Delete</button>
//                         </td>

//                     </tr>
//                   ))}
//                 </tbody>
//               </table>

//              </div>
              
//           </div>
//           </div>

//         </div>
//     );
// };

// export default Categories



/////////////////2-12-25 add pagination after 10 item add///////////////
import React, { useEffect, useState } from "react";
import axios from "axios";

const Categories = () => {
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editCategory, setEditCategory] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://90.90.91.34:5000/api/category", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });
      setCategories(response.data.categories);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle Add/Edit Category
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editCategory) {
        const response = await axios.put(
          `http://90.90.91.34:5000/api/category/${editCategory}`,
          { categoryName, categoryDescription },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
            },
          }
        );

        if (response.data.success) {
          setEditCategory(null);
          setCategoryName("");
          setCategoryDescription("");
          alert("Category updated successfully");
          fetchCategories();
        } else {
          alert("Error editing category. Please try again.");
        }
      } else {
        const response = await axios.post(
          "http://90.90.91.34:5000/api/category/add",
          { categoryName, categoryDescription },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
            },
          }
        );

        if (response.data.success) {
          setCategoryName("");
          setCategoryDescription("");
          alert("Category added successfully");
          fetchCategories();
        } else {
          alert("Error adding category. Please try again.");
        }
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?"
    );
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(
        `http://90.90.91.34:5000/api/category/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
          },
        }
      );

      if (response.data.success) {
        alert("Category deleted successfully");
        fetchCategories();
      } else {
        alert("Error deleting category. Please try again.");
      }
    } catch (error) {
      if (error.response) {
        alert(error.response.data.message);
      } else {
        alert("Error deleting category. Please try again.");
      }
    }
  };

  // Handle Edit
  const handleEdit = (category) => {
    setEditCategory(category._id);
    setCategoryName(category.categoryName);
    setCategoryDescription(category.categoryDescription);
  };

  const handleCancel = () => {
    setEditCategory(null);
    setCategoryName("");
    setCategoryDescription("");
  };

  if (loading) return <div>Loading...</div>;

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = categories.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(categories.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-8">Categories Management</h1>
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Form Section */}
        <div className="lg:w-1/3">
          <div className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-center text-xl font-bold mb-4">
              {editCategory ? "Edit Category" : "Add Category"}
            </h2>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <input
                  type="text"
                  placeholder="Category Name"
                  value={categoryName}
                  required
                  className="border w-full p-2 rounded-md"
                  onChange={(e) => setCategoryName(e.target.value)}
                />
              </div>
              <div>
                <textarea
                  placeholder="Category Description"
                  value={categoryDescription}
                  required
                  className="border w-full p-2 rounded-md"
                  onChange={(e) => setCategoryDescription(e.target.value)}
                />
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="w-full mt-2 rounded-md bg-green-600 text-white p-3 cursor-pointer hover:bg-gray-700"
                >
                  {editCategory ? "Save Changes" : "Add Category"}
                </button>
                {editCategory && (
                  <button
                    type="button"
                    className="w-full mt-2 rounded-md bg-red-600 text-white p-3 cursor-pointer hover:bg-gray-700"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Table Section */}
        <div className="lg:w-2/3">
          <div className="bg-white shadow-md rounded-lg p-4">
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-200 p-2">S.No</th>
                  <th className="border border-gray-200 p-2">Category Name</th>
                  <th className="border border-gray-200 p-2">Description</th>
                  <th className="border border-gray-200 p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((category, index) => (
                  <tr key={category._id}>
                    <td className="border border-gray-200 p-2">
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td className="border border-gray-200 p-2">
                      {category.categoryName}
                    </td>
                    <td className="border border-gray-200 p-2">
                      {category.categoryDescription}
                    </td>
                    <td className="border border-gray-200 p-2">
                      <button
                        className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-900 mr-2"
                        onClick={() => handleEdit(category)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-600 text-white p-2 rounded-md hover:bg-red-900"
                        onClick={() => handleDelete(category._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-center mt-4 space-x-2">
              <button
                className="px-3 py-1 border rounded disabled:opacity-50"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Prev
              </button>

              {/* {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === i + 1 ? "bg-blue-600 text-white" : ""
                  }`}
                >
                  {i + 1}
                </button>
              ))} */}
              
 {/* add pagination  22-01-26 start */}
{Array.from({ length: totalPages }, (_, i) => i + 1)
  .filter((page) => {
    // This logic picks: First page, Last page, and 1 page around Current
    return (
      page === 1 || 
      page === totalPages || 
      Math.abs(page - currentPage) <= 1
    );
  })
  .map((page, index, array) => (
    <React.Fragment key={page}>
      {/* This adds the "..." if there is a gap between numbers */}
      {index > 0 && page - array[index - 1] > 1 && (
        <span className="px-2 font-bold text-gray-500">...</span>
      )}
      <button
        onClick={() => handlePageChange(page)}
        className={`px-3 py-1 border rounded ${
          currentPage === page ? "bg-blue-600 text-white" : "hover:bg-gray-100"
        }`}
      >
        {page}
      </button>
    </React.Fragment>
  ))}
  {/* add pagination  22-01-26 start end */}   

              <button
                className="px-3 py-1 border rounded disabled:opacity-50"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
