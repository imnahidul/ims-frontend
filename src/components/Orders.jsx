//import React from "react";
//  import axios from "axios";
//  import React, {useEffect} from "react";

// const Orders = () => {
//   const [orders, setOrders] = React.useState([]);

//    const fetchOrders = async () =>{
    
//     try{
//   const response = await axios.get("http://90.90.91.34:5000/api/orders",{
//     headers: {
//       Authorization: `Bearer ${localStorage.getItem('pos-token')} `,
//     },
//   });
//   if(response.data.success){
//   //console.log(response.data.suppliers);
//    setOrders(response.data.orders);
//   } else {
//      console.error("Error fetching Orders :",response.data.message);
//      alert("Error fetching product. Please try again.");
//   }

// }catch(error) {
//   console.error("Error fetching orders :",error);
// }

//  };
//   useEffect(() => {
//     fetchOrders();
  
//   },[]);
//   return (
//     <div className="w-full h-full flex flex-col gap-4 p-4">
//     <h1 className="text-2xl font-bold ">Orders</h1>

//            {/* 43.52 part started from data Start */}
//             <div> 
//           <table className=" w-full border-collapse border border-gray-300 mt-4">
//            <thead>
//             <tr className="bg-gray-200">
//                <th className="border border-gray-300 p-2 ">S.No</th>               
//               <th className="border border-gray-300 p-2">User Name</th>
//                <th className="border border-gray-300 p-2">Product Name</th>
//                <th className="border border-gray-300 p-2">Category Name</th>
//                <th className="border border-gray-300 p-2">Quantity</th>
//                <th className="border border-gray-300 p-2">Total Price</th>
//                <th className="border border-gray-300 p-2">Date</th>

//             </tr>
//            </thead>
//            <tbody>
//               {orders && orders.map((order,index)=> (
              
//               <tr key={order._id}>
//                <td className="border border-gray-300 p-2">{index + 1}</td>
//                            {/* 2. ADD THE DATA CELL HERE */}
//                <td className="border border-gray-300 p-2"> {order.customer ? order.customer.name : 'N/A'}</td> 
//                <td className="border border-gray-300 p-2">{order.product.name}</td>
//                <td className="border border-gray-300 p-2">{order.product.categoryId.categoryName}</td>
//                {/* <td className="border border-gray-300 p-2">{order.categoryId._id.categoryName}</td> */}
//                <td className="border border-gray-300 p-2">{order.quantity}</td>
//                <td className="border border-gray-300 p-2">{order.totalPrice}</td>
//               {/* <td className="border border-gray-300 p-2">{order.orderDate}</td> */}
//               {/* <td className="border border-gray-300 p-2">{new Date(order.orderDate).toLocaleDateString()}</td> */}
//               <td className="border border-gray-300 p-2">{new Date(order.orderDate).toLocaleString()}</td>
//              </tr>
//             ))}
//            </tbody>
//           </table>

//           {orders.length === 0 && <div>No Record Found </div>}
           
//           </div>
//        {/* 43.52 part started from data End*/}
//     </div>
//   )

// }


// export default Orders;

//////paginations added///////20/22-1-2026/////////////
import axios from "axios";
import React, { useEffect, useState } from "react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true); // added for better UX

  // Pagination state — same as Invoices
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://90.90.91.34:5000/api/orders", {
        
        headers: {
          Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
        },
      });

      if (response.data.success) {
        setOrders(response.data.orders || []);
      } else {
        console.error("Error fetching Orders :", response.data.message);
        alert("Error fetching orders. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching orders :", error);
      alert("Network error while loading orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Pagination calculations — same pattern as Invoices
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = orders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(orders.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="w-full h-full flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">Orders</h1>

      {loading ? (
        <div className="text-center py-8">Loading orders...</div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 mt-4">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 p-2">S.No</th>
                  <th className="border border-gray-300 p-2">User Name</th>
                  <th className="border border-gray-300 p-2">Product Name</th>
                  <th className="border border-gray-300 p-2">Category Name</th>
                  <th className="border border-gray-300 p-2">Quantity</th>
                  <th className="border border-gray-300 p-2">Total Price</th>
                  <th className="border border-gray-300 p-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((order, index) => (
                  <tr key={order._id}>
                    <td className="border border-gray-300 p-2">
                      {indexOfFirstItem + index + 1}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {order.customer ? order.customer.name : "N/A"}
                    </td>
                    <td className="border border-gray-300 p-2">{order.product.name}</td>
                    <td className="border border-gray-300 p-2">
                      {order.product.categoryId?.categoryName || "—"}
                    </td>
                    <td className="border border-gray-300 p-2">{order.quantity}</td>
                    <td className="border border-gray-300 p-2">{order.totalPrice}</td>
                    <td className="border border-gray-300 p-2">
                      {new Date(order.orderDate).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination — same style as Invoices */}
          {orders.length > 0 && (
            <div className="flex justify-center items-center mt-6 space-x-2 flex-wrap gap-y-2">
              <button
                className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-100"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Prev
              </button>

              {/* {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-4 py-2 border rounded min-w-[40px] ${
                      currentPage === pageNum
                        ? "bg-blue-600 text-white"
                        : "bg-white hover:bg-gray-100"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })} */}

         {/* add pagination  22-01-26 start */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
  .filter((page) => {
    // Keeps first page, last page, and 1 page on each side of current
    return page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1;
  })
  .map((page, index, array) => (
    <React.Fragment key={page}>
      {/* Show dots if there is a gap between this page and the previous one in our filtered list */}
      {index > 0 && page - array[index - 1] > 1 && (
        <span className="px-2 text-gray-500 font-bold">...</span>
      )}
      <button
        onClick={() => handlePageChange(page)}
        className={`px-4 py-2 border rounded min-w-[40px] ${
          currentPage === page
            ? "bg-blue-600 text-white"
            : "bg-white hover:bg-gray-100"
        }`}
      >
        {page}
      </button>
    </React.Fragment>
  ))}
       {/* add pagination  22-01-26 End */}
              <button
                className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-100"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}

          {orders.length === 0 && !loading && (
            <div className="text-center mt-8 text-gray-600 font-medium">
              No Record Found
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Orders;