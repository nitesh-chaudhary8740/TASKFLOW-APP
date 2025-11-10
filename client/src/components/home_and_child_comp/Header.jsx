import React from 'react'
import "../../assets/css/Header.css"
import { Link, Navigate } from 'react-router-dom'
// import { TASK_MANAGEMENT_HOME } from '../../contexts/TaskManageMent.context'
function Header() {
    // const values = useContext(TASK_MANAGEMENT_HOME)
  return (
    <header className="header">
      <div className="container header-content">
        {/* Logo/Brand Name */}
        <a href="#" className="logo">
          TaskFlow
        </a>
        {/* Login Button (For existing users, leading to Admin/Employee selector) */}
        <nav>
          <Link
            to="/login"
            className="login-btn"
          >
            Log In
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Header
