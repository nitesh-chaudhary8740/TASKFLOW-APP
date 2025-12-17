import React, { useContext } from 'react';
import { Clock, Bell,  LogOut, Search, File, ChevronDown,  } from 'lucide-react';
import { Link } from 'react-router-dom';

import { useState } from 'react';

import { EmployeeDashboardContext } from '../../contexts/EmployeeDashboardContext';
import { EmployeeProfileMenu } from './EmployeeProfileMenu';
import { SearchResultsOverlay } from '../admin_dashboard/admin-nav-sub-com0/SearchResultsOverlay';
import { EmpSearchResultsOverlay } from './employeeSearchOverlay';

function EmployeeNavbar() {
    const [showProfileMenu,setShowProfileMenu] = useState(false)
    const {activeEmpNavLinks} = useContext(EmployeeDashboardContext)
    const user = JSON.parse(localStorage.getItem("currentUser"));
      const [isSearchFocused, setIsSearchFocused] = useState(false);
        const [searchTerm, setSearchTerm] = useState('');


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
      {/* 🔍 SEARCH BAR SECTION */}
<div className="navbar-search" style={{ position: 'relative' }}>
    <Search size={18} className="search-icon" />
    <input
        type="text"
        placeholder="Search tasks..."
        className="search-input"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setIsSearchFocused(true)}
        // Remove the auto-hide onBlur to keep it persistent while typing/clicking
    />
    
    {/* RENDER SEARCH RESULTS OVERLAY */}
    {isSearchFocused && (
        <EmpSearchResultsOverlay 
            searchTerm={searchTerm} 
            // Pass a function to close the overlay manually
            onClose={() => {
                setIsSearchFocused(false);
                setSearchTerm(''); // Optional: clear search on close
            }} 
        />
    )}
</div>
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
              src={`https://placehold.co/100x100/4f46e5/ffffff?text=${user?.fullName?.charAt(0).toUpperCase()}`}
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