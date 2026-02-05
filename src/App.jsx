
import './App.css'
import {BrowserRouter as Router, Routes, Route} from 'react-router'
//import Root from './assets/components/Root'
import Root from './utils/Root'
import Login from './pages/Login'
import ProtectedRoutes from './utils/ProtectedRoutes'
import Dashboard from './pages/Dashboard'
import Categories from './components/Categories'
import Suppliers from './components/Suppliers'
import Products from './components/Products'
import Logout from './components/Logout'
import Users from './components/Users'
//import Orders from './components/Orders'
import CustomerProducts from './components/CustomerProducts'
import Orders from './components/Orders'
import Profile from './components/Profile'
import Summary from './components/Summary'
import Invoices from './components/Invoices'
import Estimates from './components/Estimates'
import Requisitions from './components/Requisitions'
import Faultys from './components/Faultys'
import GatePass from './components/GatePass'
//import Faultys from './components/Faultys'



function App() {


  return (
 <Router>
    <Routes>
  <Route path="/" element={<Root />}  />
  {/* </Routes><Route path="/admin/dashboard" element={<ProtectedRoutes requireRole={["admin"]}> */}
  <Route path="/admin/dashboard" element={<ProtectedRoutes requireRole={["admin"]}>
    <Dashboard />
  </ProtectedRoutes>} >
  
 <Route
 index
 //element={<h1>Summary of amin Dashboard</h1>}
 element={<Summary />}
 />

 <Route
 path='categories'
 element={<Categories />}
 />
 <Route
 path='products'
// element={<h1>Products</h1>}
 element={<Products /> }
 />
 <Route
 path='suppliers'
 element={<Suppliers />}
 />
 <Route
 path='orders'
 element={<Orders />}
 //element={<h1>Orders</h1>}
 />
 <Route
 path='invoices'
 element={<Invoices />}
 //element={<h1>Invoices data  </h1>}
 />
   <Route
 path='faultys'
 element={<Faultys />}
 //element={<h1>Faulty data  </h1>}
 />
    <Route
 path='gatepass'
 element={<GatePass />}
//  element={<h1>GatePass data  </h1>}
 />
 <Route
 path='estimates'
  element={<Estimates />}
//  element={<h1>Estimates data  </h1>}
 />
 <Route
 path='requisitions'
  element={<Requisitions />}
  //element={<h1>Requisitions data  </h1>}
 />
 <Route
 path='users'
 element={<Users />}
 />
 <Route
 path='profile'
 //element={<h1>Profile</h1>}
element={<Profile />}
 />
 <Route
 path='logout'
 element={<Logout />}
 />

 </Route>
                {/* Customer/employee part start from here */}
  {/* <Route path="/customer/dashboard" element={<h1>customer dashboard</h1>}  /> */}
   
   <Route path="/customer/dashboard" element={<Dashboard />}> 
  {/* <Route index element={<>Product </>}></Route> */}
   
  <Route
 index
 element={<h1>Summary of User  Dashboards</h1>}
 />
   
  {/* <Route index element={<CustomerProducts />}></Route> */}
  <Route 
  path='products'
  element={<CustomerProducts />}>
  </Route>
  
 {/* <Route
 path='categories'
 element={<Categories />}
 /> */}

   <Route
 path='orders'
 //element={<h1>User Orders</h1>}
 element={<Orders />}

 />
   <Route
 path='profile'
 // element={<h1>User Profile</h1>}   
 element={<Profile />}   
 />
 



 
  <Route
 path='logout'
 element={<Logout />}
 />
  </Route>
 

  <Route path="/login" element={<Login/>}  />
  <Route path="/unauthorized" element={<p className='font-bold text-3xl mt-20 ml-20 '>Unauthorized</p>}  />
  

    </Routes>
</Router>


  )
}

export default App
