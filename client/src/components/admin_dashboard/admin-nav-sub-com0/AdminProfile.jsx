import { ChevronLeft } from 'lucide-react'
import React from 'react'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { TASK_MANAGEMENT_HOME } from '../../../contexts/TaskManageMent.context'
import "./AdminProfile.css"
function AdminProfile() {
    const navigate= useNavigate()
    const {currentUser}=useContext(TASK_MANAGEMENT_HOME)
  return (
     <div className="employee-profile-wrapper">
            
            <div className="employee-profile-back-button-container">
                <button className="employee-profile-back-btn" onClick={() => navigate(-1)}> 
                    <ChevronLeft size={20} /> Go Back
                </button>
            </div>
            
            <div className="employee-profile-container">
                
                {/* 1. Identity Section */}
                <div className="employee-profile-identity">
                    <div className="employee-profile-avatar">{currentUser.name.charAt(0)}</div>
                    <h3 className="employee-profile-username">{currentUser.name || 'N/A'}</h3>
                    <p className="employee-profile-role">Role: **{currentUser.role || 'Employee'}**</p>
                    <p className="employee-profile-role">Email: **{currentUser.email || 'Employee'}**</p>
                    <p className="employee-profile-designation">Orgnization: **{currentUser.orgnization || 'N/A'}**</p>
                </div>
                
                <hr className="employee-profile-separator" />
    </div>
    </div>
  )
}

export default AdminProfile
