//import React from "react"
//import {FaBox, FaCog, FaHome, FaShoppingCart, FaSignOutAlt, FaTable, FaTruck,  FaUsers } from "react-icons/fa"
import { FaHome, FaTable, FaBox, FaTruck,FaFileInvoice,FaBriefcase, FaShoppingCart, FaUsers, FaCog,FaSignOutAlt, FaClipboard } from "react-icons/fa"
import { NavLink } from "react-router"
import { useAuth } from "../context/AuthContext";
import React, {useEffect, useState } from "react";


const Sidebar = () => {
const menuItems = [
    // {name:"Dashboard", path:"/admin-dashboard", icon: <FaHome />},
    {name: "Dashboard", path:"/admin/dashboard", icon: <FaHome />, isParent:true},
    {name: "Categories", path:"/admin/dashboard/categories", icon: <FaTable />, isParent:false},
    {name: "Products", path:"/admin/dashboard/products", icon: <FaBox />, isParent:false},
    {name: "Suppliers", path:"/admin/dashboard/suppliers", icon: <FaTruck />, isParent:false},
    {name: "Invoices", path:"/admin/dashboard/invoices", icon: <FaFileInvoice />, isParent:false},
    {name: "Estimates", path:"/admin/dashboard/estimates", icon: <FaBriefcase />, isParent:false},
    {name: "Requisitions", path:"/admin/dashboard/requisitions", icon: <FaClipboard />, isParent:false},
    {name: "Orders", path:"/admin/dashboard/orders", icon: <FaShoppingCart />, isParent:false},
    {name: "Users", path:"/admin/dashboard/users", icon: <FaUsers />, isParent:false},
    {name: "Profile", path:"/admin/dashboard/profile", icon: <FaCog />, isParent:false},
    {name: "Logout", path:"/admin/dashboard/logout", icon: <FaSignOutAlt />, isParent:false},
];
/////////////// Customer dashboard Starts////////////////////////

 const customerItems = [
    //{name: "Dashboard", path:"/customer/dashboard", icon: <FaHome />, isParent:true},
    {name: "Products", path:"/customer/dashboard/products", icon: <FaBox />, isParent:false},
    // {name: "Categories", path:"/customer/dashboard/categories", icon: <FaTable />, isParent:false},
    {name: "Orders", path:"/customer/dashboard/orders", icon: <FaShoppingCart />, isParent:false},
    {name: "Profile", path:"/customer/dashboard/profile", icon: <FaCog />, isParent:false},
    {name: "Logout", path:"/customer/dashboard/logout", icon: <FaSignOutAlt />, isParent:false},
];

const {user} = useAuth();
const [menuLinks, setMenuLinks] = useState(customerItems);
useEffect(() => {
 if (user && user.role === "admin") {
    setMenuLinks(menuItems);
 }

},[]);

/////////////// Customer dashboard End////////////////////
    return (
       // <div>Sidebar</div>
       <div className="flex flex-col h-screen bg-black text-white w-16 md:w-64 fixed">
        <div className="h-16 flex flex-items justify-center ">
            <span className="hidden md:block text-xl font-bold">Inventory MS</span>
            <span className="md:hidden text-xl font-bold">IMS</span>
        </div>
        <div>
            <ul className="space-y-2 p-2"> 
                 {/* {menuItems.map((item) => (   */}
               
                 {/* {menuItems.map((item) => ( */}
                  {menuLinks.map((item) => (
                 <li key={item.name} >
                    {/* className="flex items-center p-2 text-gray-900 rounded-lg hover:bg-gray-100" */}
                    <NavLink
                    end={item.isParent}
                    className={({isActive}) => (isActive ? "bg-gray-700 " :"") + "flex items-center p-2 rounded-md hover:bg-gray-700 transition duration-200 "}
                    //////////////use below line for fix the sidebar issue//////////////
                    // className={({isActive}) => 
                    //     `flex items-center p-2 rounded-md hover:bg-gray-700 transition duration-200 focus:outline-none ${isActive ? "bg-gray-700" : ""}`}
                   
                    to={item.path}
                    >

                        <span className="text-xl">{item.icon}</span>
                        <span className="ml-4 hidden md:block">{item.name}</span>
                    </NavLink>

                 </li>
                ))}

            </ul>

        </div>


       </div>
    )
}

export default Sidebar