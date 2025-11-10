import React, { useContext, useState } from 'react'
// ⚠️ Ensure this path is correct based on where you saved the universal CSS
import "../../assets/css/auth.css" 
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Home } from 'lucide-react' // Import the Home icon (Lucide or equivalent)
import Roles from './Roles'
import { TASK_MANAGEMENT_HOME } from '../../contexts/TaskManageMent.context' // Context kept as per your original file structure
import { inputOnChange } from '../../utils/utility.functions'
import axios from 'axios'
import { USER_ROLES } from '../../enums/roles'
import { AntDContext } from '../../contexts/AntDContext.js'
function SignIn() {
  const navigate = useNavigate()
  const appContextValues = useContext(TASK_MANAGEMENT_HOME)
  const AntDContextValues = useContext(AntDContext)
  const [formdata,setFormData]= useState({
    userNameOrEmail:"",
    password:"",
    role:appContextValues.selectedAuthRole.current
  })
  const handleOnSubmit = async(e)=>{
    e.preventDefault()
    try {
      if(!formdata.userNameOrEmail ||!formdata.password){
        alert("fill all the fields")
        return
      }
      if(appContextValues.selectedAuthRole.current!==USER_ROLES.ADMIN) {
        alert(appContextValues.selectedAuthRole.current)
        return;
      }
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`,formdata)
      console.log(response.data)
      appContextValues.setCurrentUser(response.data)
      localStorage.setItem("currentUser",JSON.stringify(response.data))
      AntDContextValues.showSuccess("login successful",2)
      navigate('/admin-dashboard')

    } catch (error) {
      alert(error)
    }
  }
  return (
    // The 'auth' class provides the full-page background and relative positioning for the icon
    <div className='auth' >
      
      {/* 🚀 Home Link: Positioned absolutely via the .home-link CSS class */}
      <Link to="/" className="home-link">
        <Home size={20} />
        {/* The span text is hidden on mobile devices via CSS, showing only the icon */}
        <span>Back to Home</span> 
      </Link>
      
      <div className="login-container">
        <h2>Welcome Back!</h2>
        <p>Choose your role to log in to your dashboard.</p>
        
        {/* Roles Component handles role selection logic */}
        <Roles/>
        
        <form className="login-form" onSubmit={handleOnSubmit}>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="userNameOrEmail"
               onChange={inputOnChange(setFormData)}
              placeholder="Enter your username or email"
              required=""
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={inputOnChange(setFormData)}
              placeholder="Enter your password"
              required=""
            />
          </div>
          <div className="forgot-password">
            <Link to="#">Forgot Password?</Link>
          </div>
          <button type="submit" className="login-button">
            Log In
          </button>
        </form>
      
      </div>
    </div>
  )
}

export default SignIn