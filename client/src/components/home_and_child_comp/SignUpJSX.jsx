import React from 'react'
import { Link } from 'react-router-dom'
import Roles from './Roles.jsx'
import { Home } from 'lucide-react'
export function SignUpJSX({setFormData,signUpHandler,inputOnChange,formData}) {
  return (
<div className='auth'>
         <Link to="/" className="home-link" >
        <Home size={20} />
        {/* The span text is hidden on mobile devices via CSS, showing only the icon */}
        <span>Back to Home</span> 
      </Link>
       <div className="login-container">
    <h2>Join TaskFlow</h2>
    <p>Set up your account and define your primary role.</p>
<Roles/>
    <form className="login-form signup-form" onSubmit={signUpHandler}>
      <div className="input-group">
        <label htmlFor="full-name">Full Name</label>
        <input
          type="text"
          value={formData.fullName}
          id="full-name"
          name="fullName"
          placeholder="Your name"
          required=""
          onChange={inputOnChange(setFormData)}
        />
      </div>
      <div className="input-group">
        <label htmlFor="email">Email Address</label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={inputOnChange(setFormData)}
          name="email"
          placeholder="Your email"
          required=""
        />
      </div>
      <div className="input-group">
        <label htmlFor="username">Choose Username</label>
        <input
          type="text"
          id="username"
          value={formData.userName}
          name="userName"
          onChange={inputOnChange(setFormData)}
          placeholder="Create your unique username"
          required=""
        />
      </div>
      {/* <div className="input-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Create your password"
          required=""
        />
      </div> */}
     
      <button type="submit" className="login-button signup-button">
        Create Account
      </button>
    </form>
    <div className="signup-link login-link">
      Already have an account? <Link to="/login">Log In</Link>
    </div>
  </div>
    </div>
  )
}

