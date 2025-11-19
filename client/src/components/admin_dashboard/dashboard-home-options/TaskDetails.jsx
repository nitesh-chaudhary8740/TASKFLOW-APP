import React, { useContext } from 'react'
import "./TaskDetails.css"
import { AdminDashBoardContext } from '../../../contexts/AdminDashBoardContext';
import { AlertTriangle, Calendar, Clock, Repeat, Trash2, User, UserMinus, UserMinus2, UserPlus, X } from 'lucide-react';
function TaskDetails() {
    const values = useContext(AdminDashBoardContext)
   const handleReassign =()=>{
        values.setIsAssignEmployeeFormOpen(true)
   }
   
    const handleClose = () => {
        // Assume the context state variable is named 'setIsAssignEmployeeFormOpen'
        values.setIsTaskDetailsFormOpen(false)
    }
       const getBadgeClass = (value, type) => {
        if (type === 'priority') {
            if (value.toLowerCase() === 'high') return 'badge-high';
            if (value.toLowerCase() === 'medium') return 'badge-medium';
            return 'badge-low';
        }
        if (type === 'status') {
             if (value.toLowerCase() === 'in progress') return 'badge-in-progress';
             if (value.toLowerCase() === 'pending') return 'badge-pending';
             return 'badge-completed'; // Or similar completed state
        }
        return 'badge-low';
    };
    const formatDate = (dateString) => {
    // This is excellent. It yields a standard, localized format (e.g., "25 Nov 2025").
    return new Date(dateString).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};
  return (
    <div className='task-details-overlay' onClick={handleClose}>
            {/* The actual modal content card */}
            <div className='task-details-card' onClick={(e) => e.stopPropagation()}>
                
                {/* Header */}
                <div className='card-header'>
                    <h1 className='header-title'>Task: {values.selectedTask.current?.id||""}</h1>
                    <button 
                        onClick={handleClose} 
                        className="close-button"
                        title="Close Task Details"
                    >
                        <X size={24} />
                    </button>
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
                            <p className='detail-value'>{values.selectedTask.current?.assignedTo?.empName||"none"}</p>
                        </div>
                        <div className='detail-item'>
                            <p className='detail-label'><Calendar size={16}/> Due Date</p>
                            <p className='detail-value'>{formatDate(values.selectedTask.current.dueDate)}</p>
                        </div>
                        <div className='detail-item'>
                            <p className='detail-label'>Creation Date</p>
                            <p className='detail-value'>{formatDate(values.selectedTask.current.createdAt.split('T')[0])}</p>
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
                        values.selectedTask.current.isAssigned?<button 
                        // onClick={handleUnassign}
                        className="action-button unassign-button"
                        title={`Unassign ${values.selectedTask.current?.assignedTo?.empName || 'the current employee'}`}
                        disabled={!values.selectedTask.current?.assignedTo?.empName}
                    >
                        <UserMinus size={20} style={{marginRight: '8px'}} />
                        Unassign
                    </button>:
                    <button 
                        onClick={handleReassign}
                        className="action-button reassign-button"
                        title="Change the employee assigned to this task"
                    >
                        <UserPlus size={20} style={{marginRight: '8px'}} />
                        Assign
                    </button>
                     }
                </div>

            </div>
        </div>
  )
}

export default TaskDetails
