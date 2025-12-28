//import React from "react";
 import axios from "axios";
 import React, {useEffect} from "react";

const Orders = () => {
  const [orders, setOrders] = React.useState([]);

   const fetchOrders = async () =>{
    
    try{
  const response = await axios.get("http://localhost:3000/api/orders",{
    headers: {
      Authorization: `Bearer ${localStorage.getItem('pos-token')} `,
    },
  });
  if(response.data.success){
  //console.log(response.data.suppliers);
   setOrders(response.data.orders);
  } else {
     console.error("Error fetching Orders :",response.data.message);
     alert("Error fetching product. Please try again.");
  }

}catch(error) {
  console.error("Error fetching orders :",error);
}

 };
  useEffect(() => {
    fetchOrders();
  
  },[]);
  return (
    <div className="w-full h-full flex flex-col gap-4 p-4">
    <h1 className="text-2xl font-bold ">Orders</h1>

           {/* 43.52 part started from data Start */}
            <div> 
          <table className=" w-full border-collapse border border-gray-300 mt-4">
           <thead>
            <tr className="bg-gray-200">
               <th className="border border-gray-300 p-2 ">S.No</th>               
              <th className="border border-gray-300 p-2">User Name</th>
               <th className="border border-gray-300 p-2">Product Name</th>
               <th className="border border-gray-300 p-2">Category Name</th>
               <th className="border border-gray-300 p-2">Quantity</th>
               <th className="border border-gray-300 p-2">Total Price</th>
               <th className="border border-gray-300 p-2">Date</th>

            </tr>
           </thead>
           <tbody>
              {orders && orders.map((order,index)=> (
              
              <tr key={order._id}>
               <td className="border border-gray-300 p-2">{index + 1}</td>
                           {/* 2. ADD THE DATA CELL HERE */}
               <td className="border border-gray-300 p-2"> {order.customer ? order.customer.name : 'N/A'}</td> 
               <td className="border border-gray-300 p-2">{order.product.name}</td>
               <td className="border border-gray-300 p-2">{order.product.categoryId.categoryName}</td>
               {/* <td className="border border-gray-300 p-2">{order.categoryId._id.categoryName}</td> */}
               <td className="border border-gray-300 p-2">{order.quantity}</td>
               <td className="border border-gray-300 p-2">{order.totalPrice}</td>
              {/* <td className="border border-gray-300 p-2">{order.orderDate}</td> */}
              {/* <td className="border border-gray-300 p-2">{new Date(order.orderDate).toLocaleDateString()}</td> */}
              <td className="border border-gray-300 p-2">{new Date(order.orderDate).toLocaleString()}</td>
             </tr>
            ))}
           </tbody>
          </table>

          {orders.length === 0 && <div>No Record Found </div>}
           
          </div>
       {/* 43.52 part started from data End*/}
    </div>
  )

}


export default Orders;

