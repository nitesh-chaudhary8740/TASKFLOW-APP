import React, { useContext, useState } from 'react'
import "./TaskDetails.css"
import { AdminDashBoardContext } from '../../../contexts/AdminDashBoardContext';
import { AlertTriangle, Calendar, Clock, Trash2, User, UserMinus, UserPlus, X, Edit2 } from 'lucide-react'; // 👈 Import Edit2
import TaskEditForm from './TaskEditForm';

function TaskDetails() {
    const values = useContext(AdminDashBoardContext);
    // 🚀 NEW STATE FOR EDITING 🚀
    const [isEditing, setIsEditing] = useState(false); 

    const handleReassign =()=>{
        values.setIsAssignEmployeeFormOpen(true)
    }

    const handleClose = () => {
        values.setIsTaskDetailsFormOpen(false)
        // Reset editing state when closing the main modal
        setIsEditing(false); 
    }
    

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    }

    const getBadgeClass = (value, type) => {
        // ... (existing badge logic)
        if (type === 'priority') {
            if (value?.toLowerCase() === 'high') return 'badge-high';
            if (value?.toLowerCase() === 'medium') return 'badge-medium';
            return 'badge-low';
        }
        if (type === 'status') {
             if (value?.toLowerCase() === 'in-progress') return 'badge-in-progress';
             if (value?.toLowerCase() === 'pending') return 'badge-pending';
             if (value?.toLowerCase() === 'completed') return 'badge-completed';
             // For other statuses like 'Under-Review' or 'Blocked', you might add more classes
             return 'badge-pending';
        }
        return 'badge-low';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };
    
    // Guard clause if no task is selected or task detail is closed
    if (!values.selectedTask.current) return null;

    // 🚀 CONDITIONAL RENDERING FOR EDITING 🚀
    if (isEditing) {
        return (
            <TaskEditForm 
                task={values.selectedTask.current} 
                setIsEditing={setIsEditing} 
                // Add the context values you need for saving
                // contextValues={values} 
                onClose={handleClose}
            />
        );
    }

    // --- NON-EDITING (VIEW) MODE RENDER ---
    return (
        <div className='task-details-overlay' onClick={handleClose}>
             <div className='task-details-card' onClick={(e) => e.stopPropagation()}>
                
                {/* Header */}
                <div className='card-header'>
                    <h1 className='header-title'>Task: {values.selectedTask.current?.id || ""}</h1>
                    <div style={{display: 'flex', gap: '10px'}}>
                         {/* 🚀 EDIT BUTTON ADDED HERE 🚀 */}
                         <button 
                            onClick={handleEditToggle} 
                            className={`close-button ${values.selectedTask.current.isAssigned?"not-allowed":""}`} // Re-using close-button style for consistency
                            title={`${values.selectedTask.current.isAssigned?"Unassign task before editing":"Edit Task Details"}`}
                            disabled={values.selectedTask.current.isAssigned}
                        >
                            <Edit2 size={24} />
                        </button>

                        <button 
                            onClick={handleClose} 
                            className="close-button"
                            title="Close Task Details"
                        >
                            <X size={24} />
                        </button>
                    </div>
                </div>

                {/* Body - Details Section */}
                <div className='card-body'>
                    
                    <h2 className='task-name'>{values.selectedTask.current.name}</h2>
                    
                    <div className='task-badges'>
                            <span className={`badge ${getBadgeClass(values.selectedTask.current.status, 'status')}`}>
                                <Clock size={14} style={{marginRight: '4px'}} />
                                {values.selectedTask.current.status}
                            </span>
                            <span className={`badge ${getBadgeClass(values.selectedTask.current.priority, 'priority')}`}>
                                <AlertTriangle size={14} style={{marginRight: '4px'}} />
                                {values.selectedTask.current.priority} Priority
                            </span>
                    </div>

                    <p className='detail-section-title'>Description</p>
                    <p className='task-description'>{values.selectedTask.current.description}</p>

                    <div className='detail-grid'>
                        <div className='detail-item'>
                            <p className='detail-label'><User size={16}/> Assigned To</p>
                            <p className='detail-value'>{values.selectedTask.current?.assignedTo?.userName||"none"}</p>
                        </div>
                        <div className='detail-item'>
                            <p className='detail-label'><Calendar size={16}/> Due Date</p>
                            <p className='detail-value'>{formatDate(values.selectedTask.current.dueDate)}</p>
                        </div>
                        <div className='detail-item'>
                            <p className='detail-label'>Creation Date</p>
                            <p className='detail-value'>{formatDate(values.selectedTask.current?.createdAt?.split('T')[0])}</p>
                        </div>
                    </div>
                </div>

                {/* Footer - Actions Section */}
                <div className='card-footer'>
                    <button 
                        // onClick={handleDelete}
                        className="action-button delete-button"
                        title="Delete this task permanently"
                    >
                        <Trash2 size={20} style={{marginRight: '8px'}} />
                        Delete Task
                    </button>
                      {
                         values.selectedTask.current.isAssigned
                         ? (
                            <button 
                                onClick={()=>{
                                    values.handleUnassignTask(values.selectedTask.current._id)
                                }}
                                className="action-button unassign-button"
                                title={`Unassign ${values.selectedTask.current?.assignedTo?.userName || 'the current employee'}`}
                                disabled={!values.selectedTask.current?.assignedTo?.userName}
                            >
                                <UserMinus size={20} style={{marginRight: '8px'}} />
                                Unassign
                            </button>
                          )
                         : (
                            <button 
                                onClick={handleReassign}
                                className="action-button reassign-button"
                                title="Change the employee assigned to this task"
                            >
                                <UserPlus size={20} style={{marginRight: '8px'}} />
                                Assign
                            </button>
                          )
                      }
                </div>
            </div>
        </div>
    )
}

export default TaskDetails