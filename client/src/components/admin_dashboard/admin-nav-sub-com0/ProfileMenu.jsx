import React from 'react';
import { User, HelpCircle, LogOut, X } from 'lucide-react';
// Don't forget to import your CSS file at the top of your main JS/React file:
import './ProfileMenu.css'; 
import { useContext } from 'react';
import { TASK_MANAGEMENT_HOME } from '../../../contexts/TaskManageMent.context';

import axios from 'axios';
import { AntDContext } from '../../../contexts/AntDContext';
import { Link } from 'react-router-dom';
export function ProfileMenu() {
   
const  {selectedAuthRole,currentUser,setCurrentUser} = useContext(TASK_MANAGEMENT_HOME)
const  {showError,showSuccess} = useContext(AntDContext)

const handleAction = (name) => {
    console.log(`Action: ${name}`);
  };
  const handleLogOut = async()=>{
    try {
       const response = await axios.post(`${import.meta.env.VITE_API_URL}/logout`,{},{withCredentials:true})
        console.log(response?.data)
        localStorage.removeItem("currentUser")
        setCurrentUser(null)
        selectedAuthRole.current=null
        showSuccess("logout successful",3)
    
    } catch (error) {
      console.log("error is",error)
      if(error?.response?.data){
        showError(error.response?.data.msg)
      }
      
    }
        
  }
  
  const menuItems = [
    { name: "Help", icon: HelpCircle, action: () => handleAction("Help") },
    { name: "Logout", icon: LogOut, action: () => handleLogOut(), isDanger: true },
  ];

  return (
    <div className="profile-menu-container">
      
      {/* User Info Header */}
      <div className="menu-header">
          <div className="avatar">
              {currentUser.name.charAt(0).toUpperCase()}
          </div>
          <div>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>{currentUser.name}</p>
                <Link className='view-profile-link' to={"/admin-profile"}>View profile</Link>
          </div>

          {/* Close Button (X) */}
          <button aria-label="Close menu" className="close-btn"> <X size={18} /> </button>
      </div>

      {/* Menu Options */}
      <div className="menu-options">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isDanger = item.isDanger ? ' danger' : '';
          
          return (
            <button
              key={item.name}
              onClick={item.action}
              className={`menu-item${isDanger}`}
            >
              <Icon size={20} className="menu-item-icon" />
              {item.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}