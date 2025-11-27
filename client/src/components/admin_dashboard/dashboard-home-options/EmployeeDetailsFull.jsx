import React, { useContext, useMemo, useState } from 'react';
import { AdminDashBoardContext } from '../../../contexts/AdminDashBoardContext';
import { useNavigate } from 'react-router-dom';
import './EmployeeDetailsFull.css'; 

// Define the object again for clarity within this file
const TASK_STATUS_OBJECT = {
    UN_ASSIGNED: "Un-Assigned",
    PENDING: "Pending",
    IN_PROGRESS: "In-Progress",
    COMPLETED: "Completed",
    UNDER_REVIEW: "Under-Review",
    BLOCKED: "Blocked",
    OVERDUE: "Overdue",
};

function EmployeeDetailsFull() {
    const { 
        selectedEmployee, 
        tasks, 
        handleDeleteEmployee, 
        setIsEmployeeDetailsFormOpen, 
        setIsTaskDetailsFormOpen, 
        selectedTask // Need this to pass to the task details modal
    } = useContext(AdminDashBoardContext);
    
    const navigate = useNavigate();
    const employee = selectedEmployee.current; 

    // Local State for Table Filtering
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [priorityFilter, setPriorityFilter] = useState('ALL');

    if (!employee) {
        navigate('/admin-dashboard/employees'); 
        return null;
    }

    // --- Data Calculation & Filtering (Memoized for Performance) ---
    const hasNoReports = [TASK_STATUS_OBJECT.PENDING,TASK_STATUS_OBJECT.IN_PROGRESS,TASK_STATUS_OBJECT.OVERDUE]
    const { assignedTasks, summary, filteredTasks } = useMemo(() => {
        const employeeTasks = tasks.filter(task => 
            // Corrected to handle potential nested assignedTo if it's a populated object
            task.assignedTo && String(task.assignedTo._id || task.assignedTo) === String(employee._id)
        );

        // 1. Calculate Summary
        const taskSummary = employeeTasks.reduce((acc, task) => {
            const statusKey = Object.keys(TASK_STATUS_OBJECT).find(key => 
                TASK_STATUS_OBJECT[key] === task.status
            );
            if (statusKey) {
                acc[statusKey] = (acc[statusKey] || 0) + 1;
            }
            acc.TOTAL = acc.TOTAL + 1;
            return acc;
        }, { TOTAL: 0 });
        // 2. Apply Filters and Search
        const filtered = employeeTasks.filter(task => {
            // Search filter (Task Name)
            const searchMatch = task.name.toLowerCase().includes(searchTerm.toLowerCase());

            // Status filter
            const statusMatch = statusFilter === 'ALL' || task.status === statusFilter;

            // Priority filter
            const priorityMatch = priorityFilter === 'ALL' || task.priority === priorityFilter;
            
            return searchMatch && statusMatch && priorityMatch;
        });

        return { assignedTasks: employeeTasks, summary: taskSummary, filteredTasks: filtered };
    }, [tasks, employee._id, searchTerm, statusFilter, priorityFilter]);
    
    // Helper function to determine status card class (with new colors)
    const getStatusClass = (statusKey) => {
        switch (statusKey) {
            case 'COMPLETED': return 'status-card status-completed';
            case 'PENDING': return 'status-card status-pending';
            case 'IN_PROGRESS': return 'status-card status-in-progress';
            case 'UNDER_REVIEW': return 'status-card status-under-review';
            case 'BLOCKED': return 'status-card status-blocked';
            case 'OVERDUE': return 'status-card status-overdue';
            case 'TOTAL': return 'status-card status-total';
            default: return 'status-card status-default';
        }
    };
    
    // Placeholder for Priority Options (adjust as per your system's priorities)
    const PRIORITY_OPTIONS = ['Low', 'Medium', 'High', 'Critical'];

    return (
        <div className="employee-details-page">
            
            {/* Breadcrumb / Navigation */}
            <div className="details-breadcrumb">
                <button 
                    className="breadcrumb-link"
                    onClick={() => navigate("/admin-dashboard/employees")}
                >
                    Employees
                </button>
                <span className="breadcrumb-separator">{'>>'}</span>
                <span className="breadcrumb-current-name">{employee.fullName}</span>
            </div>

            <div className="details-header">
                <div>
<h1 className="employee-name">{employee.fullName}</h1>
                <span>Username: <strong>{employee.userName}</strong></span>
                </div>
                
                <div className="header-actions">
                    <button 
                        className="edit-button"
                        onClick={() => setIsEmployeeDetailsFormOpen(true)} // Assuming this opens an edit modal
                    >
                        Edit Details
                    </button>
                    <button 
                        className="delete-button"
                        onClick={() => handleDeleteEmployee(employee._id)}
                    >
                        Delete Employee
                    </button>
                </div>
            </div>

            {/* --- Employee Details Section --- */}
            <div className="employee-info-section">
                <h2 className="info-heading">Employee Information</h2>
                <div className="info-grid">
                    <p><strong>Designation:</strong> {employee.designation}</p>
                    <p><strong>Email:</strong> {employee.email}</p>
                    <p><strong>Phone:</strong> {employee.phone || 'N/A'}</p>
                    <p><strong>Address:</strong> {employee.address || 'N/A'}</p>
                </div>
            </div>

            {/* --- Task Summary Section --- */}
            <div className="task-summary-section">
                <h2 className="summary-heading">Task Summary</h2>
                <div className="summary-grid">
                    
                    {/* Render all status cards, including TOTAL */}
                    {Object.keys(TASK_STATUS_OBJECT)
                        .filter(key => key !== 'UN_ASSIGNED')
                        .concat('TOTAL') // Add total back in for dedicated card
                        .map(key => (
                            <div key={key} className={getStatusClass(key)}>
                                <p className="card-label">{key === 'TOTAL' ? 'Total Assigned' : TASK_STATUS_OBJECT[key]}</p>
                                <p className="card-value">{summary[key] || 0}</p>
                            </div>
                        ))}
                </div>
            </div>

            {/* --- Assigned Tasks Table --- */}
            <div className="assigned-tasks-section">
                <h2 className="tasks-heading">All Assigned Tasks ({assignedTasks.length})</h2>
                
                {/* Search and Filter Bar */}
                <div className="tasks-toolbar">
                    <input
                        type="text"
                        placeholder="Search tasks by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="toolbar-search-input"
                    />
                    
                    <select 
                        value={statusFilter} 
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="toolbar-select"
                    >
                        <option value="ALL">All Statuses</option>
                        {Object.values(TASK_STATUS_OBJECT)
                            .filter(status => status !== TASK_STATUS_OBJECT.UN_ASSIGNED)
                            .map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                    </select>

                    <select 
                        value={priorityFilter} 
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        className="toolbar-select"
                    >
                        <option value="ALL">All Priorities</option>
                        {PRIORITY_OPTIONS.map(priority => (
                            <option key={priority} value={priority}>{priority}</option>
                        ))}
                    </select>
                </div>

                {filteredTasks.length > 0 ? (
                    <table className="tasks-table">
                        <thead className="tasks-table-header">
                            <tr>
                                <th>S/N</th>
                                <th>Task Name</th>
                                <th>Due Date</th>
                                <th>Status</th>
                                <th>Priority</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                      <tbody>
                            {filteredTasks.map((task, index) => (
                                <tr key={task._id} className="tasks-table-row">
                                    <td>{index + 1}</td> {/* Serial Number */}
                                    <td>{task.name}</td>
                                    <td>{new Date(task.dueDate).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`status-badge status-${task.status.toLowerCase().replace('-', '_')}`}>
                                            {task.status}
                                        </span>
                                    </td>
                                    <td>{task.priority}</td>
                                    <td className="task-actions-cell"> {/* Added class for action buttons container */}
                                        
                                        {/* View Details Button (New Primary Blue Style) */}
                                        <button 
                                            className="view-details-button" // <-- RENAMED CLASS
                                            onClick={() => {
                                                selectedTask.current = task;
                                                setIsTaskDetailsFormOpen(true);
                                            }}
                                        >
                                            View Details
                                        </button>

                                        {/* New View Report Button (Matching Style) */}
                                        <button 
                                            className="view-report-button"
                                            disabled={hasNoReports.includes(task.status)}
                                            // You'll need to define the action for this button (e.g., open a report modal)
                                            onClick={() => { console.log(`Viewing report for Task: ${task.name}`); }} 
                                        >
                                            View Report
                                        </button>

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="no-tasks-message">
                        {assignedTasks.length === 0 
                            ? "This employee currently has no assigned tasks."
                            : "No tasks match the current search/filter criteria."
                        }
                    </p>
                )}
            </div>
        </div>
    );
}

export default EmployeeDetailsFull;