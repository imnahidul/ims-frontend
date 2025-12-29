import axios from "axios";
import React, {useEffect, useState } from "react";


const Summary = () => {
   const [dashboardData, setDashboardData] = useState({
     totalProducts: 0,
     totalStock: 0,
     ordersToday: 0,
     revenue: 0,
     outOfStock: [],
     highestSalesProducts: 0,
     lowStock: []
     
   })
   const [loading, setLoading] = useState(false);
    const fetchDashboardData = async () => {
       try{
         setLoading(true);
         const response = await axios.get("http://localhost:5000/api/dashboard",{
        headers: {
       Authorization: `Bearer ${localStorage.getItem('pos-token')}`,
       }
       
      });
       console.log(response.data.dashboardData);
      setDashboardData(response.data.dashboardData);
     } catch (error) {
      alert (error.message);
     } finally {
      setLoading(false);
     }
  }

   useEffect(() => {
     fetchDashboardData();
   
   },[]);
   if(loading) {
    return <div>Loading...</div>
   }

  return(
    <div className="p-5">
        <h2 className="text-3xl font-bold ">Dashboard Summary</h2> 

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-6">
            <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center">
              <p className="text-lg font-semibold">Total Product</p>
              {/* <p className="text-2xl font-bold">[0]</p> */}
              <p className="text-2xl font-bold">{dashboardData.totalProducts}</p>
            </div>  

            <div className="bg-green-500 text-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center">
              <p className="text-lg font-semibold">Total Stock</p>
              {/* <p className="text-2xl font-bold">[0]</p> */}
              <p className="text-2xl font-bold">{dashboardData.totalStock}</p>
            </div> 

             <div className="bg-cyan-400 text-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center">
              <p className="text-lg font-semibold">Orders Today</p>
              {/* <p className="text-2xl font-bold">[0]</p> */}
              <p className="text-2xl font-bold">{dashboardData.ordersToday}</p>
            </div> 

             <div className="bg-violet-500 text-white p-4 rounded-lg shadow-md flex flex-col items-center justify-center">
              <p className="text-lg font-semibold">Revenue</p>
              {/* <p className="text-2xl font-bold">$[0]</p> */}
              <p className="text-2xl font-bold">Tk={dashboardData.revenue}</p>
            </div> 

        </div>
            {/* divide part start from here */}
         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 ">
         {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 "> */}
             
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
           {/* </h3> <h3 className="text-xl font-semibold text-gray-800 ab-3"> */}
              Out of stock Products</h3>

             {/* {dashboardData.outOfStock.length > 0 ? (
              <ul className="space-y-2">
                {dashboardData.outOfStock.map((product, index) => (
                  <li key={index} className="text-gray-600">
                    {product.name} {" "}
                    <span className="text-gray-400">({product.category.name})</span>

                  </li>
                ))}

              </ul>
            ) : (
              <p className="text-green-500">No Products Out of Stock</p>
            )}  */}
   {/* Out of Stock Section */}
{dashboardData.outOfStock.length > 0 ? (
  <ul className="space-y-2">
    {dashboardData.outOfStock.map((product) => (
      <li key={product._id} className="text-red-600 font-medium">
        {product.name} 
        <span className="text-gray-500 text-sm">
          ({product.categoryId?.categoryName || "No Category"})
        </span>
      </li>
    ))}
  </ul>
) : (
  <p className="text-green-600">All products in stock!</p>
)}         

          </div>

              {/*High sales products */}
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Highest Demand Products</h3>
               
            {dashboardData.highestSalesProducts?.name ? (
              <div className="text-gray-600">
                <p><strong>Name:</strong>{dashboardData.highestSalesProducts.name} </p>
                <p><strong>Category: </strong>{dashboardData.highestSalesProducts.category} </p>
                <p><strong>Total Unit Demand:</strong>{dashboardData.highestSalesProducts.totalQuantity} </p>
                
              </div>
            ) : (
              <p className="text-green-500">{dashboardData.highestSalesProducts?.message ||'Loading...'}</p>
            )}

          </div>
             {/*Low sales products */} 
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">
              Low Stock Products</h3>
             
              {dashboardData.lowStock.length > 0 ? (
              <ul className="space-y-2">
                {dashboardData.lowStock.map((product, index) => (
                  <li key={index} className="text-gray-600">
                    {/* {product.name} {" "}  */}
                    <strong>{product.name}</strong> + {product.stock} left{""}
                    <span className="text-gray-400">({product.categoryId.categoryName})</span>
                    {/* <span className="text-gray-400">({product.category.name})</span> */}

                  </li>
                ))}

              </ul>
            ) : (
              <p className="text-green-500">No Low Stock products</p>
            )} 
            
           

          </div>
             {/*List of faulty products */} 
          {/* <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 ab-3">
              Faulty Products</h3>
          </div> */}

          <div className="bg-white p-4 rounded-lg shadow-md">
            {/* <h3 className="text-xl  font-semibold  rounded-md text-red-500">Calendar :</h3>
             <h3 className="text-sm font-semibold text-purple-500 rounded-md">card</h3>
             <h3 className="text-sm font-semibold rounded-md ">Data</h3>
             <h3 className="text-sm font-bold rounded-md border-5  justify-center flex mt-5 py-2">click here</h3>
             

              */}
            <h3 className="text-sm rounded-md">Others</h3>

         


                       
          </div>
       
       
       
       
        </div>
        
    </div>
      
  )
}

export default Summary;