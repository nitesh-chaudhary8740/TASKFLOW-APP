import React, { useContext, useEffect, useState } from 'react';
import { X, Search, ListTodo, Info, Loader, Clock, AlertTriangle, Calendar, CheckCircle, UserMinus } from 'lucide-react';
import { AdminDashBoardContext } from '../../../contexts/AdminDashBoardContext'; 
import { AntDContext } from '../../../contexts/AntDContext'; 

import './EmployeeAssignedTasks.css'; // New CSS file

export const EmployeeAssignedTasks = () => {
    // Assuming context has the function to close this modal and the selected employee
    const { 
        selectedEmployee, 
        setIsEmployeeTasksFormOpen, 
        setIsTaskDetailsFormOpen, 
        selectedTask,
        tasks,
        handleUnassignTask
    } = useContext(AdminDashBoardContext); 


    const employee = selectedEmployee.current;

    const [assignedTasks, setAssignedTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

useEffect(()=>{
    if(tasks){
        const tempTasksArr = tasks.filter(task=>
        task?.assignedTo?._id===employee._id
    )
    console.log(tempTasksArr,"temp")
    setAssignedTasks(tempTasksArr)
    }
},[tasks,employee])


    // --- Filtering Logic ---
    useEffect(() => {
        if (!searchTerm) {
            setFilteredTasks(assignedTasks);
            return;
        }
        const lowerCaseSearch = searchTerm.toLowerCase();
        const results = assignedTasks.filter(task =>
            task.name.toLowerCase().includes(lowerCaseSearch) ||
            task.description.toLowerCase().includes(lowerCaseSearch) ||
            task.status.toLowerCase().includes(lowerCaseSearch)
        );
        setFilteredTasks(results);
    }, [searchTerm, assignedTasks]);

    // --- Utility Functions ---

    const handleViewTaskDetails = (task) => {
        // Set the selected task context and open the TaskDetails modal
        selectedTask.current = task;
        // setIsEmployeeTasksFormOpen(false); // Close this modal
        setIsTaskDetailsFormOpen(true);    // Open the Task Details modal
    };
    
    const handleClose = () => {
        setIsEmployeeTasksFormOpen(false); 
    }
    
    const getStatusClass = (status) => {
        if (!status) return 'status-default';
        const lowerStatus = status.toLowerCase();
        if (lowerStatus.includes('completed')) return 'status-completed';
        if (lowerStatus.includes('progress')) return 'status-in-progress';
        if (lowerStatus.includes('review')) return 'status-under-review';
        if (lowerStatus.includes('blocked') || lowerStatus.includes('overdue')) return 'status-blocked';
        return 'status-pending';
    };
    
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString();
    };

console.log(assignedTasks)
    return (
        <div className="modal-overlay"> 
            <div className="employee-tasks-container modal-content"> 
                
                {/* Close Button */}
                <button 
                    className="modal-close-btn" 
                    onClick={handleClose} 
                    title="Close Assigned Tasks List"
                >
                    <X size={24} />
                </button>

                <h2 className="form-title">
                    <ListTodo size={24} style={{ marginRight: '10px' }} />
                    Tasks Assigned to {employee?.fullName || 'Employee'} ({assignedTasks.length})
                </h2>
                
           

                {/* Search Bar */}
                <div className="search-bar-group">
                    <Search size={20} className="task-search-icon" />
                    <input
                        type="text"
                        placeholder="Search tasks by title, status, or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="task-search-input"
                    />
                </div>

                {!assignedTasks ? (
                    <div className="task-list-state loading-state">
                        <Loader size={32} className="spinner" />
                        <p>Loading assigned tasks...</p>
                    </div>
                ) : (
                    <div className="task-list-wrapper">
                        {filteredTasks.length === 0 ? (
                            <div className="task-list-state no-results">
                                <Info size={24} />
                                <p>{searchTerm ? "No tasks match your search." : "This employee has no tasks assigned."}</p>
                            </div>
                        ) : (
                            <div className="task-list">
                                {filteredTasks.map(task => (
                                    <div key={task._id} className="task-item">
                                        <div className="task-info">
                                            <h4 className="task-name">{task.name}</h4>
                                            <p className={`task-status-tag ${getStatusClass(task.status)}`}>
                                                <Clock size={14} style={{ marginRight: '5px' }} />
                                                {task.status}
                                            </p>
                                            <div className="task-meta">
                                                <span><AlertTriangle size={14} /> Priority: {task.priority}</span>
                                                <span><Calendar size={14} /> Due: {formatDate(task.dueDate)}</span>
                                            </div>
                                        </div>
                                        <div className="emp-taks-action-btns-group">
  <button 
                                            className="emp-taks-action-btns view-details-btn"
                                            onClick={() => handleViewTaskDetails(task)}
                                        >
                                            <CheckCircle size={18} />
                                            View Details
                                        </button>
                                        <button 
                                            className="emp-taks-action-btns unassign-task-btn"
                                            onClick={() => handleUnassignTask(task._id)}
                                        >
                                            <UserMinus size={18} />
                                            Unassign Task
                                        </button>
                                        </div>
                                      
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};