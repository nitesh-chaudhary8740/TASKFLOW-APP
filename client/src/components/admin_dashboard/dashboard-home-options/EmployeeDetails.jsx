import React, { useContext, useState } from 'react';
import "./EmployeeDetails.css"; // We'll create this CSS next

import { Mail, BriefcaseBusiness, User, Phone, X, Edit2, MapPin, Trash2 } from 'lucide-react';
import EmployeeEditForm from './EmployeeEditForm'; // Import the new edit form
import { AdminDashBoardContext } from '../../../contexts/AdminDashBoardContext';

function EmployeeDetails() {
    const adminContextValues = useContext(AdminDashBoardContext);
    // State to toggle between View and Edit mode
    const [isEditing, setIsEditing] = useState(false); 
    
    // Get the employee data from the ref
    const employee = adminContextValues.selectedEmployee.current;
    const assignedTasks = adminContextValues.tasks?.filter(task=>task.assignedTo?._id===employee._id)
    const handleClose = () => {
        adminContextValues.setIsEmployeeDetailsFormOpen(false);
        setIsEditing(false); // Reset edit state on close
    };
    
    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    // Helper to format date if necessary (e.g., for hireDate)
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        // If the date string contains a time component, split it
        const datePart = dateString.split('T')[0]; 
        return new Date(datePart).toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };
    
    // Guard clause: If no employee is selected, render nothing
    if (!employee) return null;

    // Render the Edit Form if isEditing is true
    if (isEditing) {
        return (
            <EmployeeEditForm
                employee={employee}
                setIsEditing={setIsEditing}
                // Pass context function to ensure employee list is refreshed after save
                // adminContextValues={adminContextValues} 
            />
        );
    }

    // Render the Details View Mode
    return (
        <div className='employee-details-overlay' onClick={handleClose}>
            <div className='employee-details-card' onClick={(e) => e.stopPropagation()}>
                
                {/* Header */}
                <div className='employee-card-header'>
                    <h1 className='employee-header-title'>Employee Details</h1>
                    <div style={{display: 'flex', gap: '10px'}}>
                         <button 
                            onClick={handleEditToggle} 
                            className="employee-close-button" 
                            title="Edit Employee Details"
                        >
                            <Edit2 size={24} />
                        </button>
                        <button 
                            onClick={handleClose} 
                            className="employee-close-button"
                            title="Close Details"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Body - Details Section */}
                <div className='employee-card-body'>
                    
                    <h2 className='employee-full-name'>{employee.fullName}</h2>
                    <p className='employee-username'>@{employee.userName}</p>

                    <div className='employee-detail-grid'>
                        {/* Row 1 */}
                        <div className='employee-detail-item'>
                            <p className='employee-detail-label'><Mail size={16}/> Email</p>
                            <p className='employee-detail-value'>
                                <a href={`mailto:${employee.email}`}>{employee.email}</a>
                            </p>
                        </div>
                        <div className='employee-detail-item'>
                            <p className='employee-detail-label'><BriefcaseBusiness size={16}/> Designation</p>
                            <p className='employee-detail-value'>{employee.designation}</p>
                        </div>
                        
                        {/* Row 2 */}
                         <div className='employee-detail-item'>
                            <p className='employee-detail-label'><Phone size={16}/> Phone</p>
                            <p className='employee-detail-value'>{employee.phone || 'N/A'}</p>
                        </div>
                         <div className='employee-detail-item'>
                            <p className='employee-detail-label'><MapPin size={16}/> Location/Address</p>
                            <p className='employee-detail-value'>{employee.address || 'N/A'}</p>
                        </div>
                        
                        {/* Row 3 - Optional fields */}
                         <div className='employee-detail-item'>
                            <p className='employee-detail-label'><User size={16}/> Date Joined</p>
                            <p className='employee-detail-value'>{formatDate(employee.createdAt)}</p>
                        </div>
                        <div className='employee-detail-item'>
                            <p className='employee-detail-label'>Employee ID</p>
                            <p className='employee-detail-value'>{employee._id}</p>
                        </div>
                    </div>
                </div>

                {/* Footer - Actions Section */}
                <div className='employee-card-footer'>
                    <button 
                        // You will likely need to fetch and display the number of tasks
                        className="employee-action-button employee-view-tasks-button"
                        title="View tasks assigned to this employee"
                        onClick={()=>{
                            adminContextValues.setIsEmployeeTasksFormOpen(true)
                        }}
                    >
                      View Assigned Tasks  ({assignedTasks.length || 0})
                    </button>
                    <button 
                        // Implement actual delete logic (with confirmation)
                        className="employee-action-button employee-delete-button"
                        title="Delete this employee"
                        onClick={()=>{
                           adminContextValues.handleDeleteEmployee(employee._id)
                    
                        }}
                    >
                        <Trash2 size={20} style={{marginRight: '8px'}} />
                        Delete Employee
                    </button>
                </div>

            </div>
        </div>
    );
}

export default EmployeeDetails;