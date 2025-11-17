import React, { useContext } from 'react';
import { Clock, Bell,  LogOut, Search, File, ChevronDown,  } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useState } from 'react';

import { EmployeeDashboardContext } from '../../contexts/EmployeeDashboardContext';
import { EmployeeProfileMenu } from './EmployeeProfileMenu';

function EmployeeNavbar() {
    const [showProfileMenu,setShowProfileMenu] = useState(false)
    const {activeEmpNavLinks} = useContext(EmployeeDashboardContext)
    const user = JSON.parse(localStorage.getItem("currentUser"));


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
          {activeEmpNavLinks.map((link)=> (
            <Link 
              key={link.name} 
              to={link.href} 
              
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
        
        
        {/* Vertical Separator between Actions and Profile */}
        <div className="nav-separator"></div>

        {/* Profile */}
        <div className="nav-profile-section"
         onClick={()=>{
            setShowProfileMenu(prev=>!prev)
        }}
      
        >
        {showProfileMenu?<EmployeeProfileMenu showProfileMenu={showProfileMenu} setShowProfileMenu={setShowProfileMenu}/>
        : <div className="profile-avatar">
            <img
              src={`https://placehold.co/100x100/4f46e5/ffffff?text=${user?.userName?.charAt(0).toUpperCase()}`}
              alt="Admin Avatar"
            />
          </div>
      }
        </div>
      </div>
    </nav>
  );
}

export default EmployeeNavbar;