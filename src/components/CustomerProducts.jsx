//import React from "react";
import axios from "axios";
import React, {useEffect, useState } from "react";
import { data } from "react-router";

const CustomerProducts = () => {
  const [categories, setCategories] = useState([]);
  //const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts ] = useState([]);
  const [openModal, setOpenModal] = useState (false);
  const [orderData, setOrderData] = useState({
                productId: "",
                quantity:1,
                total: 0,
                stock: 0,
                price: 0,
  
  });

  const fetchProducts = async () => {
    
    try{
  const response = await axios.get("http://localhost:5000/api/products",{
    headers: {
      Authorization: `Bearer ${localStorage.getItem('pos-token')} `,
    },
  });
  if(response.data.success){
   //setSuppliers(response.data.suppliers);
   setCategories(response.data.categories);
   setProducts(response.data.products);
   setFilteredProducts(response.data.products);
  } else {
     console.error("Error fetching products :",response.data.message);
     alert("Error fetching product. Please try again.");
  }

}catch(error) {
  console.error("Error fetching products :",error);
}

 };
 
 useEffect(() => {
   fetchProducts();
 
 },[]);
   //////////////// //Search Filter only Name Start /////////////////////
           const handleSearch = (e) => {
            setFilteredProducts(
              products.filter((product) =>
            product.name.toLowerCase().includes(e.target.value.toLowerCase()))  
            )
           }
       //----------------Search Filter End------------------------
       const handleChangeCategory = (e) => {
            setFilteredProducts(
              products.filter((product) => product.categoryId._id === e.target.value)  
            )
           }
  const handleOrderChange =(product)  => {
        setOrderData({
          productId: product._id,
          quantity:1,
          total: product.price,
          stock: product.stock,
          price: product.price
        })
     //const setOpenModel(true);
      setOpenModal(true);
   }

  const closeModal =  () => {
    setOpenModal(false);
  }
  const handleSubmit = async (e) => {
      e.preventDefault();
      try{
        const response = await axios.post("http://localhost:5000/api/orders/add",orderData,{
    headers: {
      Authorization: `Bearer ${localStorage.getItem('pos-token')} `,
    },
  });
  if(response.data.success){
   setOpenModal(false);
   setOrderData({ productId:"", quantity:1,  total:0, stock:0, price:0
    });
    alert("Order added Successfully");
       }
      } catch (error){
         console.error("Error adding product:",error);
         alert("Error",error.message);
         //console.log(error);
         //alert("Error" + error.response?.data?.message || error.message || "unknown error" );
       }
  }

//////////////calculate stock * with unit price start////////////////
  const increaseQuantity = (e) => {
    if(e.target.value > orderData.stock) {
      alert("Not Enough  Stock  ");
    } else {
       setOrderData((prev) => ({
        ...prev,
       quantity : parseInt(e.target.value),
       total: parseInt(e.target.value) * parseInt(orderData.price)
       }));
    }
  }
//////////////calculate stock * with unit price end////////////////
  return (
    <div className="bg-orange-200">
        
        <div className="py-4 px-6">
            <h2 className="font-bold text-xl ">Products</h2>
        </div>
         <div className="py-4 px-6 flex justify-between items-center">
            <div className="">
                <select name="category" id="" className="bg-white border p-1 rounded"
                   onChange={handleChangeCategory}>
                  <option value="" >Select category</option>
                   {categories.map((cat , index) =>(
                    ///// //////gemini solution Add the unique 'key' prop here key={cat._id}//////////////////
                   <option key={cat._id} value={cat._id}>{cat.categoryName}</option>
                   //err/// <option  value={cat._id}>{cat.categoryName}</option>
                   ))}
                </select>
            </div>
            <div>
                {/* <input type="text" placeholder="search" className="p-2 border rounded" /> */}
                   <input type="text" 
                placeholder="Search P.N" 
                className="border p-1  bg-white rounded px-4"
                onChange={handleSearch}
                />
            </div>
         </div>
                {/* 43.52 part started from data Start */}
            <div> 
          <table className=" w-full border-collapse border border-gray-300 mt-4">
           <thead>
            <tr className="bg-gray-200">
               <th className="border border-gray-300 p-2 ">S. No</th>
               <th className="border border-gray-300 p-2">Product Name</th>
               <th className="border border-gray-300 p-2">Category Name</th>
               {/* <th className="border border-gray-300 p-2">Supplier Name</th> */}
               <th className="border border-gray-300 p-2">Price</th>
               <th className="border border-gray-300 p-2">Stock</th>
               <th className="border border-gray-300 p-2">Action</th>

            </tr>
           </thead>
           <tbody>
              {filteredProducts && filteredProducts.map((product,index)=> (
            // {products.map((product,index)=> (
           
              <tr key={product._id}>
               {/* <tr key={index}>  */}
               <td className="border border-gray-300 p-2">{index + 1}</td>
               <td className="border border-gray-300 p-2">{product.name}</td>
               {/* <td className="border border-gray-300 p-2">{product.categoryId.categoryName}</td> */}
               <td className="border border-gray-300 p-2">{product.categoryId.categoryName}</td>
               {/* <td className="border border-gray-300 p-2">{product.supplierId.name}</td> */}
               <td className="border border-gray-300 p-2">{product.price}</td>
               <td className="border border-gray-300 p-2">
                <span className=" rounded-full font-semibold">
                    {product.stock == 0 ?(
                     <span className="bg-red-100  text-red-500 px-2 py-1 rounded-full ">{product.stock}</span>
                    ): product.stock < 5 ?(
                      <span className="bg-yellow-100 text-green-500 px-2 py-1 rounded-full">{product.stock}</span>
                    ): (<span className="bg-green-100 text-green-500 px-2 py-1 rounded-full">{product.stock}</span>)}
                </span>
               </td>
                <td className="border border-gray-300 p-2">
                        
                        <button 
                         onClick={() => handleOrderChange(product)}
                        //onChange={() => handleOrderChange(product)}
                        className="px-2 py-1 bg-green-500 text-white  rounded-md cursor-pointer hover:bg-blue-900  mr-2"
                        // onClick={() => handleEdit(product)}
                        >Order</button>
                        {/* onClick={() => handleDelete(supplier._id)} */}
                        {/* <button className="px-2 py-1 bg-red-500  text-white  rounded-md cursor-pointer hover:bg-red-900"
                        onClick={() => handleDelete(product._id)}
                        >Delete</button> */}
                        
                </td>
             </tr>
            ))}
           </tbody>
          </table>

          {filteredProducts.length === 0 && <div>No Record Found </div>}

          </div>
       {/* 43.52 part started from data End*/}
              {openModal && (
                  // <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center z-20">
                  <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center">
       <div className="bg-white p-4 rounded shadow-md w-1/3 relative">
       <h1 className="text-xl font-bold">place Order</h1>
       <button className="absolute top-4 right-4 font-bold text-lg cursor-pointer "
       onClick={closeModal}>X</button>
   
       <form className="flex flex-col gap-4 mt-4"  onSubmit={handleSubmit}>
            {/* onSubmit={handleSubmit} */}
        <input 
        type="number" 
        name="quantity"
         value={orderData.quantity}
          //onChange={handleChange}
          onChange={increaseQuantity}
           min="1"
        placeholder="Increase Quantity" 
        className="border p-1 bg-white rounded px-4" />
        {/* quantity * price */}
         <p>{orderData.quantity * orderData.price}</p>
        
                    <div className="flex space-x-2">
                    <button 
                    type="submit"
                     className="w-full mt-2  rounded-md bg-green-600 text-white p-3 cursor-pointer hover:bg-gray-700">
                      
                      Save Changes
                     
                      {/* Add Product */}
                      </button>
            
                     
                       
                          <button
                          type="button"
                          className="w-full mt-2  rounded-md bg-red-600 text-white p-3 cursor-pointer hover:bg-gray-700"
                    
                          //onClick={() => setOpenModal(false)}
                          onClick={closeModal}
                          >
                            Cancel
                          </button>
                       
                      </div>
        {/* product from new button part ends */}
       </form>

        </div>
     </div>
            )}

    </div>
  )


}

export default CustomerProducts;

///////////add ppaginations after 10 products/////////////////

