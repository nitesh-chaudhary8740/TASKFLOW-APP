import "../../assets/css/AdminAllTasksMenu.css"
import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { ListChecks, User, Calendar, Edit, Trash2, Loader, AlertCircle, UserPlus, Users } from 'lucide-react';
import { AdminDashBoardContext } from "../../contexts/AdminDashBoardContext";

// Placeholder functions for actions
const handleAssignEmployee = (taskId) => {
    console.log(`Assigning employee to task with ID: ${taskId}`);
    alert(`Ready to Assign Employee to Task ID: ${taskId}`);
};

const handleManageTask = (taskId) => {
    console.log(`Managing task with ID: ${taskId}`);
    alert(`Ready to Manage/Edit Task ID: ${taskId}`);
};

const handleDeleteTask = (taskId) => {
    console.log(`Deleting task with ID: ${taskId}`);
    const confirmation = window.confirm(`Are you sure you want to delete task ID ${taskId}?`);
    if (confirmation) {
        // Implement API call to delete the task
        alert(`Task ID ${taskId} deleted (simulated).`);
    }
};

const handleViewAssignedList = (taskId, assignedTo) => {
    console.log(`Viewing assigned employees for task ID: ${taskId}`);
    // In a real app, this would open a modal with a list of employees.
    alert(`Current employee assigned to Task ${taskId}: ${assignedTo}. (Simulated: Viewing full list)`);
};

function AdminAllTasksMenu() {
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const adminContextValues=useContext(AdminDashBoardContext)

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                // Ensure environment variable is defined
                const apiUrl = import.meta.env.VITE_API_URL;
                if (!apiUrl) {
                    throw new Error("VITE_API_URL is not defined in environment variables.");
                }

                const response = await axios.get(`${apiUrl}/tasks`);
                setTasks(response.data);
                setError(null);
            } catch (err) {
                console.error("Error fetching tasks:", err);
                const errMsg = err.response ? err.response.data : err.message;
                setError(errMsg);
                setTasks(getMockTasks());
            } finally {
                setIsLoading(false);
            }
        };
        adminContextValues.handleChangeActiveLink(2)
        fetchTasks();
    }, []);

    const getMockTasks = () => ([
        { id: 101, name: "Implement User Authentication", assignedTo: "Alice Johnson", status: "In Progress", priority: "High", dueDate: "2025-11-20" },
        { id: 102, name: "Design Landing Page Mockup", assignedTo: "Charlie Brown", status: "Pending", priority: "Medium", dueDate: "2025-11-15" },
        { id: 103, name: "Bug Fix: Shopping Cart", assignedTo: "Bob Williams", status: "Completed", priority: "Low", dueDate: "2025-11-05" },
        { id: 104, name: "Review Q4 Budget", assignedTo: "David Lee", status: "In Progress", priority: "High", dueDate: "2025-11-30" },
    ]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    if (isLoading) {
        return (
            <div className="task-menu-container loading-state">
                <Loader size={32} className="spinner" />
                <p>Loading task data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="task-menu-container error-state">
                <AlertCircle size={32} color="#ef4444" />
                <h2>Error Loading Data</h2>
                <p>Could not fetch task list. Details: {error}</p>
                <p className='mock-warning'>Displaying mock data for development.</p>
            </div>
        );
    }

    return (
        <div className="task-menu-container">
            <h1 className="task-list-title">
                <ListChecks size={32} style={{ marginRight: '10px' }} />
                All Project Tasks ({tasks.length})
            </h1>

            <div className="task-table-wrapper">
                {tasks.length === 0 ? (
                    <div className="no-data">
                        No tasks found. Time to create a new one!
                    </div>
                ) : (
                    <table className="task-table">
                        <thead>
                            <tr>
                                <th style={{ width: '30%' }}>Task Name</th>
                                <th style={{ width: '20%' }} className="hide-on-mobile">Assigned To</th>
                                <th style={{ width: '15%' }}>Status</th>
                                <th style={{ width: '10%' }} className="hide-on-mobile">Priority</th>
                                <th style={{ width: '15%' }} className="hide-on-mobile">Due Date</th>
                                <th style={{ width: '10%' }} className="actions-column">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tasks.map((task) => (
                                <tr key={task._id}>
                                    <td data-label="Task Name" className="task-name-cell">
                                        {task.name}
                                    </td>
                                    {/* Updated Assigned To Cell */}
                                    <td data-label="Assigned To" className="assigned-to-cell hide-on-mobile">
                                        <button 
                                            className="assigned-list-btn" 
                                            onClick={() => handleViewAssignedList(task.id, task.assignedTo)}
                                            title="View Assigned Employees List"
                                        >
                                            <Users size={16} className="icon-user" />
                                            <span className='assigned-name'>{task.assignedTo}</span>
                                        </button>
                                    </td>
                                    <td data-label="Status" className="status-cell">
                                        <span className={`status-tag ${task.status.toLowerCase().replace(/\s/g, '-')}`}>
                                            {task.status}
                                        </span>
                                    </td>
                                    <td data-label="Priority" className="priority-cell hide-on-mobile">
                                        <span className={`priority-tag ${task.priority.toLowerCase()}`}>
                                            {task.priority}
                                        </span>
                                    </td>
                                    <td data-label="Due Date" className="date-cell hide-on-mobile">
                                        <Calendar size={16} className="icon-calendar" />
                                        {formatDate(task.dueDate)}
                                    </td>
                                    {/* Actions Cell with three buttons */}
                                    <td data-label="Actions" className="actions-cell">
                                        <button 
                                            className="action-btn assign-btn" 
                                            onClick={() => handleAssignEmployee(task.id)}
                                            title="Assign Employee to Task"
                                        >
                                            <UserPlus size={16} />
                                        </button>
                                        <button 
                                            className="action-btn manage-btn" 
                                            onClick={() => handleManageTask(task.id)}
                                            title="Manage/Edit Task"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button 
                                            className="action-btn delete-btn" 
                                            onClick={() => handleDeleteTask(task.id)}
                                            title="Delete Task"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default AdminAllTasksMenu;