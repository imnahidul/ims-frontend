import React, { useEffect, useState } from "react";
 import axios from "axios";

 const Profile = () => {
  

const [user, setUser] = React.useState({
name:"",
email:"",
address:"",
password:""

});
const [edit, setEdit] = useState(false);


const fetchUser = async () => {
     try{
  const response = await axios.get("http://localhost:3000/api/users/profile",{
    headers: {
      Authorization: `Bearer ${localStorage.getItem('pos-token')}`,
    },
  });
  if(response.data.success){

    setUser({
      name: response.data.user.name,
      email: response.data.user.email,
      address:response.data.user.address,
    })

  }
} catch (error) {
  console.error("Enter fetching user: ", error);
  alert("Error fetching User. Please try again. ");
  }
}
  useEffect(() => {
    fetchUser();
  
  },[]);

    //////////////Handle Submit Button part start////////////
    const handleSubmit = async (e) => {
      e.preventDefault();
      try{
        const response = await axios.put("http://localhost:3000/api/users/profile",user,{
    headers: {
      Authorization: `Bearer ${localStorage.getItem('pos-token')} `,
    },
  });
  if(response.data.success){
     alert("Profile Updated Successfully");
     setEdit(false);
    }else {
       alert("Failed to Update Profile");
    }
     } catch (error){
         console.error("Error Updating Profile:",error);
         alert("Error updating Profile. Please try again");
       }
  }
  //////////////Handle Submit Button part End///////////////////
return (
    <div className="p-5"> 
       
       <form className="bg-white p-6 rounded-lg shadow max-w-md" onSubmit={handleSubmit} >
            {/* onSubmit={handleSubmit} */}
        <h1 className="font-bold text-2xl">User Profiles</h1>
        <div className="mb-4 mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1" >Name</label>
            <input  
            type="text" 
            name="name"
            value={user.name}
            onChange={(e)=> setUser({...user, name:e.target.value}) }
            disabled ={!edit}
            className="w-full p-2 border rounded-md focus:outline.none focus:ring-2 focus:ring-blue-500 bg-gray-200"
            />
        </div>
    
        <div className="mb-4"> 
            <label className="block text-sm font-medium text-gray-700 mb-1" >Email</label>
            <input 
            type="email" 
            name="email"
            value={user.email}
            onChange={(e)=> setUser({...user, email:e.target.value}) }
             disabled ={!edit}
            className="w-full p-2 border rounded-md bg-gray-200"
            /> 
        </div>
            <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1" >Address</label>
            <input 
            type="text" 
            name="address"
            value={user.address}
            onChange={(e)=> setUser({...user, address:e.target.value}) }
            disabled ={!edit}
            className="w-full p-2 border rounded-md bg-gray-200"
            />
        </div>
       
        {/* <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1" >Password</label>
            <input 
            type="password" 
            // id="password" 
            name="password"
            className="w-full p-2 border rounded-md bg-gray-200"
            />
        </div> */}

         
        {edit && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
             <input 
            type="password" 
             //id="password" 
            placeholder="Enter New Password (Optional)"
            name="password"
            onChange={(e)=> setUser({...user, password:e.target.value})}
            className="w-full p-2 border rounded-md bg-gray-200"
             
            />
          </div>
        )}
     
      {/* <button 
      className="w-full mt-2  rounded-2xl bg-green-600 text-white p-3 cursor-pointer hover:bg-gray-700" 
      type= "button"
      onClick={() => setEdit(!edit)}
      >
        Edit Profile
        </button> */}

      {/* new Button style 19/10 start*/}
       {!edit ? (
        <button 
      className="w-full mt-2 rounded-2xl bg-green-600 text-white p-3 cursor-pointer hover:bg-gray-700" 
      type= "button"
      //type="submit"
      onClick={() => setEdit(!edit)}
      >
        Edit Profile
        </button> 
      
       ): (
        <div className="flex space-x-2">  
        <>
        <button
         type="submit"
         className="w-full mt-2  rounded-md bg-green-600 text-white p-3 cursor-pointer hover:bg-gray-700"
        >Save Changes</button>
        <button
        type= "button"
        onClick={() => setEdit(!edit)}
         className="w-full mt-2  rounded-md bg-red-600 text-white p-3 cursor-pointer hover:bg-gray-700"
        >
          Cancel
        </button>
          </>
        </div>
       )}
       
     
    {/* new Button style 19/10 End*/}
       </form>
    </div>
    )

   }

export default Profile;


//on the top code is ook 18/19/20-10-2025