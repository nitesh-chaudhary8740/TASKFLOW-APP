import React, { useContext } from 'react';
import { Clock, Bell,  LogOut, Search, File, ChevronDown,  } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AdminDashBoardContext } from '../../contexts/AdminDashBoardContext';
import { useState } from 'react';
import { ProfileMenu } from './admin-nav-sub-com0/ProfileMenu';
import { TASK_MANAGEMENT_HOME } from '../../contexts/TaskManageMent.context';
import { SearchResultsOverlay } from './admin-nav-sub-com0/SearchResultsOverlay';

function AdminNavBar() {
  const [showProfileMenu,setShowProfileMenu] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
  const adminContextValues = useContext(AdminDashBoardContext)  
  const {currentUser} = useContext(TASK_MANAGEMENT_HOME)


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
          {adminContextValues.acticeNavLink.map((link,i)=> (
            <Link 
              key={link.name} 
              to={link.href} 
              onClick={()=>adminContextValues.handleChangeActiveLink(i)}
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
                
                {/* 🔍 SEARCH BAR CONTAINER 🔍 */}
                {/* Use a relative container to position the absolute search results overlay */}
                <div className="navbar-search-container"> 
                    <div className="navbar-search">
                        <Search size={18} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Search tasks, employees..."
                            className="search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onFocus={() => setIsSearchFocused(true)} // ⬅️ SET FOCUS STATE
                            onBlur={() => {
                                // Delay hide to allow click on a result item
                                setTimeout(() => setIsSearchFocused(false), 150); 
                            }}
                        />
                    </div>
                    
                    {/* ⬅️ RENDER SEARCH RESULTS OVERLAY */}
                    {isSearchFocused && (
                        <SearchResultsOverlay searchTerm={searchTerm} />
                    )}
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
        {showProfileMenu?<ProfileMenu showProfileMenu={showProfileMenu} setShowProfileMenu={setShowProfileMenu}/>
        : <div className="profile-avatar">
            <img
              src={`https://placehold.co/100x100/4f46e5/ffffff?text=${currentUser?.name?.charAt(0).toUpperCase()}`}
              alt="Admin Avatar"
            />
          </div>
      }
        </div>
      </div>
    </nav>
  );
}

export default AdminNavBar;