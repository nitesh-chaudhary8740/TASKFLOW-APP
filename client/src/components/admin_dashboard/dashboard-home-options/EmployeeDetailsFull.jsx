import React, { useContext, useEffect, useMemo, useState } from 'react';
import { AdminDashBoardContext } from '../../../contexts/AdminDashBoardContext';
import { useNavigate } from 'react-router-dom';
import './EmployeeDetailsFull.css'; 

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
        selectedTask,
        handleChangeActiveLink,
        // Assuming this handler exists in context for bulk action
        handleBulkUnassignTasks
    } = useContext(AdminDashBoardContext);
    
    const navigate = useNavigate();
    const employee = selectedEmployee.current; 

    // Local State for Table Functionality
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [priorityFilter, setPriorityFilter] = useState('ALL');
    
    // ⭐ NEW STATE for Selection ⭐
    const [selectedTaskIds, setSelectedTaskIds] = useState([]);

    // ⭐ LOGIC for Report Button Disabling ⭐
    // List of statuses where a report is not expected/generated yet
    const hasNoReports = [
        TASK_STATUS_OBJECT.PENDING,
        TASK_STATUS_OBJECT.IN_PROGRESS,
        TASK_STATUS_OBJECT.OVERDUE 
        // Note: BLOCKED, UN_ASSIGNED, etc., should also generally not have reports
    ];
useEffect(()=>{
    handleChangeActiveLink(1)
},[])
    if (!employee) {
    
        return <div>
        <span>
            <h1 className="employee-name">Not any employee is selected</h1>
        </span> 
        <span>
            <button className="edit-button" onClick={()=> navigate('/admin-dashboard/employees')}> {"<<"} Get back to Employees List</button>
            </span> 
            </div> 
    }

    // --- Data Calculation & Filtering (Memoized for Performance) ---
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { assignedTasks, summary, filteredTasks } = useMemo(() => {
        const employeeTasks = tasks.filter(task => 
            // Ensure correct employee ID match
            task.assignedTo && String(task.assignedTo._id || task.assignedTo) === String(employee._id)
        );

        // 1. Calculate Summary (Logic remains the same)
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

        // 2. Apply Filters and Search (Logic remains the same)
        const filtered = employeeTasks.filter(task => {
            const searchMatch = task.name.toLowerCase().includes(searchTerm.toLowerCase());
            const statusMatch = statusFilter === 'ALL' || task.status === statusFilter;
            const priorityMatch = priorityFilter === 'ALL' || task.priority === priorityFilter;
            
            return searchMatch && statusMatch && priorityMatch;
        });

        return { assignedTasks: employeeTasks, summary: taskSummary, filteredTasks: filtered };
    }, [tasks, employee._id, searchTerm, statusFilter, priorityFilter]);
    
    // --- Selection Handlers ---

    // Handler for single row checkbox
    const handleSelectTask = (taskId) => {
        setSelectedTaskIds(prevIds => 
            prevIds.includes(taskId)
                ? prevIds.filter(id => id !== taskId) // Deselect
                : [...prevIds, taskId] // Select
        );
    };

    // Handler for master checkbox (select/deselect all filtered tasks)
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            // Select all task IDs currently visible in the filtered list
            const allFilteredIds = filteredTasks.map(task => task._id);
            setSelectedTaskIds(allFilteredIds);
        } 
        else if(e.target.indeterminate){
            setSelectedTaskIds([]);
        }
        else {
            // Deselect all
            setSelectedTaskIds([]);
        }
    };

    // Determine if all filtered tasks are currently selected
    const isAllSelected = filteredTasks.length > 0 && 
                         selectedTaskIds.length === filteredTasks.length;

    // Determine if some, but not all, tasks are selected (for indeterminate state)
    // const isIndeterminate = selectedTaskIds.length > 0 && 
    //                         selectedTaskIds.length < filteredTasks.length;
    
    // Helper function to determine status card class (logic remains the same)
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
    
    const PRIORITY_OPTIONS = ['Low', 'Medium', 'High', 'Critical'];

    return (
        <div className="employee-details-page">
            
            {/* --- Breadcrumb / Navigation --- */}
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

            {/* --- Header & Actions --- */}
            <div className="details-header">
                <div>
                    <h1 className="employee-name">{employee.fullName}</h1>
                    {/* Assuming employee.username is the correct property name, fixed previously */}
                    <span>Username: <strong>{employee.username || employee.userName}</strong></span> 
                </div>
                
                <div className="header-actions">
                    <button 
                        className="edit-button"
                        onClick={() => setIsEmployeeDetailsFormOpen(true)}
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

            {/* --- Employee Details Section (unchanged) --- */}
            <div className="employee-info-section">
                <h2 className="info-heading">Employee Information</h2>
                <div className="info-grid">
                    <p><strong>Designation:</strong> {employee.designation}</p>
                    <p><strong>Email:</strong> {employee.email}</p>
                    <p><strong>Phone:</strong> {employee.phone || 'N/A'}</p>
                    <p><strong>Address:</strong> {employee.address || 'N/A'}</p>
                </div>
            </div>

            {/* --- Task Summary Section (unchanged) --- */}
            <div className="task-summary-section">
                <h2 className="summary-heading">Task Summary</h2>
                <div className="summary-grid">
                    {Object.keys(TASK_STATUS_OBJECT)
                        .filter(key => key !== 'UN_ASSIGNED')
                        .concat('TOTAL')
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
                
                {/* Search and Filter Bar (unchanged) */}
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
                
                {/* ⭐ BULK ACTIONS BAR ⭐ */}
                {selectedTaskIds.length > 0 && (
                    <div className="bulk-actions-bar">
                        <span>{selectedTaskIds.length} tasks selected.</span>
                        {/* You may want to ONLY allow unassigning if selected tasks are PENDING/UNSTARTED/etc. */}
                        <button 
                            className="bulk-unassign-button"
                            onClick={() => {
                                // You should implement handleBulkTaskUnassignment in your AdminDashBoardContext
                                console.log(`Unassigning tasks: ${selectedTaskIds}`);
                                // Example Context Call: 
                                handleBulkUnassignTasks(selectedTaskIds);
                            }}
                        >
                            Bulk Unassign
                        </button>
                    </div>
                )}

                {filteredTasks.length > 0 ? (
                    <table className="tasks-table">
                        <thead className="tasks-table-header">
                            <tr>
                                {/* ⭐ MASTER CHECKBOX COLUMN ⭐ */}
                                <th>
                                    <input 
                                        type="checkbox" 
                                        checked={isAllSelected}
                                        // The indeterminate property needs to be set directly on the DOM node
                                        // ref={input => {
                                        //     if (input) {
                                        //         input.indeterminate = isIndeterminate;
                                        //     }
                                        // }}
                                        onChange={handleSelectAll} 
                                    />
                                </th>
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
                                <tr key={task._id} className={selectedTaskIds.includes(task._id) ? "tasks-table-row selected-row" : "tasks-table-row"}>
                                    
                                    {/* ⭐ SINGLE CHECKBOX COLUMN ⭐ */}
                                    <td>
                                        <input 
                                            type="checkbox" 
                                            checked={selectedTaskIds.includes(task._id)}
                                            onChange={() => handleSelectTask(task._id)}
                                        />
                                    </td>
                                    
                                    <td>{index + 1}</td> {/* Serial Number */}
                                    <td>{task.name}</td>
                                    <td>{new Date(task.dueDate).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`status-badge status-${task.status.toLowerCase().replace('-', '_')}`}>
                                            {task.status}
                                        </span>
                                    </td>
                                    <td>{task.priority}</td>
                                    <td className="task-actions-cell">
                                        
                                        {/* View Details Button (Primary Blue Style) */}
                                        <button 
                                            className="view-details-button"
                                            onClick={() => {
                                                selectedTask.current = task;
                                                setIsTaskDetailsFormOpen(true);
                                            }}
                                        >
                                            View Details
                                        </button>

                                        {/* ⭐ View Report Button (DISABLED LOGIC APPLIED) ⭐ */}
                                        <button 
                                            className="view-report-button"
                                            // Check if the current task status is in the list of statuses with no reports
                                            disabled={hasNoReports.includes(task.status)} 
                                            onClick={() => { navigate(`/admin-dashboard/view-report/${task.report}`) }} 
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