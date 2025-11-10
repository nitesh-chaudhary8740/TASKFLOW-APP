import React, { useContext } from 'react';
import { Clock, Bell, Cog, LogOut, Search, File,  } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AdminDashBoardContext } from '../../contexts/AdminDashBoardContext';

function AdminNavBar() {
  const adminContextValues = useContext(AdminDashBoardContext) 
  console.log("it rendered")
  
  
 
  return (
    <nav className="admin-navbar">
      
      {/* 1. LEFT SECTION (Logo and Main Menu) */}
      <div className="navbar-left-section">
        
        {/* 🚀 LOGO 🚀 */}
        <div className="navbar-logo">
          TaskFlow
        </div>
        
        {/* Vertical Separator between Logo and Menu */}
        <div className="nav-separator logo-separator"></div> 

        {/* Main Navigation Menu */}
        <div className="navbar-menu">
          {adminContextValues.acticeNavLink.map((link)=> (
            <Link 
              key={link.name} 
              to={link.href} 
              // onClick={()=>{
              //   adminContextValues.handleChangeActiveLink(index)
              // }}
              className={`nav-link ${link.active ? 'active' : ''}`}
            >
              <link.icon size={18} style={{ marginRight: '6px' }} />
              {link.name}
            </Link>
          ))}
        </div>
      </div>

      {/* 2. RIGHT SECTION (Search, Actions, Profile) */}
      <div className="navbar-right-section">
        
        {/* 🔍 SEARCH BAR PLACED HERE 🔍 */}
        <div className="navbar-search">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search tasks, employees..." 
            className="search-input"
          />
        </div>

        {/* Vertical Separator between Search and Actions */}
        <div className="nav-separator"></div>

        {/* Action Buttons */}
        <button title="Notifications" className="nav-action-btn">
          <Bell size={20} />
        </button>
        <button title="Settings" className="nav-action-btn">
          <Cog size={20} />
        </button>
        
        {/* Vertical Separator between Actions and Profile */}
        <div className="nav-separator"></div>

        {/* Profile */}
        <div className="nav-profile-section">
          <div className="profile-avatar">
            <img
              src="https://placehold.co/100x100/4f46e5/ffffff?text=A"
              alt="Admin Avatar"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}

export default AdminNavBar;