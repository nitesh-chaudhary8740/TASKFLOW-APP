import React from 'react';
import { User, HelpCircle, LogOut, X } from 'lucide-react';
// Don't forget to import your CSS file at the top of your main JS/React file:
import './ProfileMenu.css'; 
import { useContext } from 'react';
import { TASK_MANAGEMENT_HOME } from '../../../contexts/TaskManageMent.context';
import { useNavigate } from 'react-router-dom';


export function ProfileMenu() {
    const user = JSON.parse(localStorage.getItem("currentUser"));;
 const  {selectedAuthRole} = useContext(TASK_MANAGEMENT_HOME)
const navigate = useNavigate()
  const handleAction = (name) => {
    console.log(`Action: ${name}`);
  };
  const handleLogOut = ()=>{
    console.log("logout")
        selectedAuthRole.current = null;
     
        localStorage.removeItem("currentUser")
        navigate("/")
  }
  
  const menuItems = [
    { name: "Account", icon: User, action: () => handleAction("Account") },
    { name: "Help", icon: HelpCircle, action: () => handleAction("Help") },
    { name: "Logout", icon: LogOut, action: () => handleLogOut(), isDanger: true },
  ];

  return (
    <div className="profile-menu-container">
      
      {/* User Info Header */}
      <div className="menu-header">
          <div className="avatar">
              {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>{user.name}</p>
              <p style={{ fontSize: '12px', color: '#6b7280' }}>View profile</p>
          </div>

          {/* Close Button (X) */}
          <button 
            //   onClick={(e)=>{
            //     e.stopPropagation()
            //     console.log(showProfileMenu)
            //             setShowProfileMenu(prev=>!prev)
            //   }}
              aria-label="Close menu"
              className="close-btn"
          >
              <X size={18} />
          </button>
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