import React, {useEffect, useState } from "react";
import axios from "axios";
//import { useEffect } from "react";

const Users = () =>  {
    const [formData, setFormData] = useState({
      name:"",
      email:"",
      password:"",
      address:"",
      role:"",
    })

const [users ,setUsers] = useState([]);
const [filteredUsers, setFilteredUsers] = useState([]);
const [loading, setLoading] = useState(false);


//useEffect(() => {
  const fetchUsers = async () => {
    setLoading(true);
try{
  const response = await axios.get("http://localhost:3000/api/users",{
    headers: {
      Authorization: `Bearer ${localStorage.getItem('pos-token')} `,
    },
  });
  setUsers(response.data.users);
  setFilteredUsers(response.data.users);
  setLoading(false);
}catch(error) {
  console.error("Error fetching users :",error)
}
  };
useEffect(() => {
  fetchUsers(); //refresh

},[]);

  //////////////// //Search Filter Start ////////////////////////
           const handleSearch = (e) => {
            setFilteredUsers(
              users.filter((user) =>
            user.name.toLowerCase().includes(e.target.value.toLowerCase())) 
            //supplier.number.toLowerCase().includes(e.target.value.toLowerCase())) 
            )
           }
       //----------------Search Filter End-------------------------

const handleSubmit = async (e) =>{
        e.preventDefault();
        // if(editCategory){

       
        

        //     // const response = await axios.post("http://localhost:3000/api/category/add",
        //     const response = await axios.put(`http://localhost:3000/api/category/${editCategory}`,
        //    {categoryName,categoryDescription},
        //     {
        //     headers: {
        //       //not match 
        //        Authorization: `Bearer ${localStorage.getItem("pos-token")}`,

        //      },
        //     }

        //     );
        //     if (response.data.success){
        //      setEditCategory(null);
        //      setCategoryName("");
        //      setCategoryDescription("");
        //     alert("Category Update Successfully");
              
        //        fetchCategories();   //refresh after Edit 
        //     } else {
                //    console.error("Error editing category:",data);
                //      alert("Error editing adding category. Please try again.");
                //    }

                //     }else{
          const response = await axios.post("http://localhost:3000/api/users/add",
           formData,
            {
            headers: {
              //not match 
               Authorization: `Bearer ${localStorage.getItem("pos-token")}`,
             },
            }

            );
            
            if (response.data.success){
               alert("Users added Successfully");
               setFormData({
                 name:"",
                 email:"",
                 password:"",
                 address:"",
                 role:"",

               });

                  fetchUsers();   //Refresh after adding New Users
                  // check adding  } else {
                  } else {
                   console.error("Error adding users");
                     alert("Error adding users. Please try again.");
                   }

                   // }
                 };
                 // Delete section starts
  const handleDelete = async (id) => {
  const confirmDelete = window.confirm ("Are You Sure want To Delete This user ?")
  
  if(confirmDelete) {
 try {
   const response = await axios.delete(`http://localhost:3000/api/users/${id}`,
           
             {
            headers: {
               Authorization: `Bearer ${localStorage.getItem("pos-token")}`,

             },
            }
          );
          if (response.data.success){
            alert("User Delete Successfully");
            //fetchUsers();   //Refresh after users list Delete
          } else {
           console.error("Error deleting User");
           alert("Error deleting  User. Please try again.");
          }
        } catch (error){
          console.error("Error deleting user:",error);
           alert("Error deleting  User. Please try again.");
        }
      }
   };

   const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData((prevData) => ({
        ...prevData,
        [name] :value,
    }));

   };
          

if(loading) return <div> Loading  ...</div>

    return (
        <div className="p-4"> 
          <h1 className="text-2xl font-bold mb-8" >Users Management </h1>  
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="lg:w-1/3">
            <div className="bg-white shadow-md rounded-lg p-4 ">
                <h2 className="text-center text-xl font-bold mb-4">
                    {/* {editCategory ? "Edit category": "Add Categories"}
                     */}
                     Add User
                    </h2>
                
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                    <input 
                    type= "text" 
                    placeholder="Enter Name" 
                    name="name"
                    className="border w-full p-2 rounded-md"
                    onChange={handleChange}
                      required 
                    //onChange={(e) => setCategoryName(e.target.value)}
                    />
                    </div>
                    <div>
                    <input type= "email" 
                    placeholder="Enter Email"
                    name ="email"
                     className="border w-full p-2 rounded-md"
                     onChange={handleChange}
                       required 
                    />
                    </div>
                    <div>
                    <input type= "password" 
                    placeholder="Enter Password"
                    name ="password"
                     className="border w-full p-2 rounded-md"
                     onChange={handleChange}
                       required 
                    />
                    </div>
                    <div>
                    <input type= "address" 
                    placeholder="Enter Address"
                    name ="address"
                     className="border w-full p-2 rounded-md "
                     onChange={handleChange}
                       required 
                    />
                    </div>
                  
                    <div>
                     <select name ="role" className="border w-full p-2  rounded-md"  onChange={handleChange}>
                       <option value= "">Select Role</option>
                       <option value= "admin">Admin</option>
                       <option value= "customer">Customer</option>
                       {/* <option value= "employee">Employee</option> */}
                     </select>
                    </div>
                    <div className="flex space-x-2">
                    <button 
                    type="submit"
                     className="w-full mt-2  rounded-md bg-green-600 text-white p-3 cursor-pointer hover:bg-gray-700">
                      {/* {editCategory ? "Save Changes" : "Add Category"} */}
                      Add User
                      </button>

                      </div>
                </form>
                </div>
            </div>

            {/* users data  table started */}
             <div className="lg:w-2/3">
             <input type="text" placeholder="Search" className="p-2 bg-white w-full mb-4 rounded"  onChange={handleSearch}></input>
             <div className="bg-white shadow-md rounded-lg p-4">
              <table className="w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-100">
              
                    <th className="border border-gray-200 p-2">S.No</th>
                          <th className="border border-gray-200 p-2">User Name</th>
                          <th className="border border-gray-200 p-2">Email</th>
                          <th className="border border-gray-200 p-2">Address</th>
                          <th className="border border-gray-200 p-2">Role</th>
                           {/* <th className="border border-gray-200 p-2">Description</th>  */}
                           <th className="border border-gray-200 p-2">Action</th>

                  </tr>
                </thead>

                {/* user data fetching Display*/}
                <tbody>
                {filteredUsers && filteredUsers.map((user,index)=> (
                //   {users && users.map((user, index) => (
                    <tr key={index}>
                      <td className="border border-gray-200 p-2">{index + 1}</td>
                      <td className="border border-gray-200 p-2">{user.name}</td>
                      <td className="border border-gray-200 p-2">{user.email}</td>
                      <td className="border border-gray-200 p-2">{user.address}</td>
                      <td className="border border-gray-200 p-2">{user.role}</td>
                        {/* <td className="border border-gray-200 p-2">{category.categoryDescription}</td>    */}
                      <td className="border border-gray-200 p-2">
                        
                        {/* <button className="bg-blue-600  text-white p-2 rounded-md cursor-pointer hover:bg-blue-900 mr-2"
                        onClick={() => handleEdit(user)}>Edit</button> */}
                        <button className="bg-red-600  text-white p-2 rounded-md cursor-pointer hover:bg-red-900"
                        onClick={() => handleDelete(user._id)}>Delete</button>
                        </td>

                    </tr>
                  ))}
                </tbody>
              </table>
                 {filteredUsers.length === 0 && <div>No Record Found </div>}
             </div>
              
          </div>
          </div>

        </div>
    );
};

export default Users;