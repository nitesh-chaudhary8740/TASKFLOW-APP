import React, { useContext, useEffect, useState } from 'react';
import { X, Search, User, Briefcase, Info, Loader } from 'lucide-react';
import { AdminDashBoardContext } from '../../../contexts/AdminDashBoardContext'; 
import { AntDContext } from '../../../contexts/AntDContext'; // Assuming you have AntD context for messages
import axios from 'axios';
import './AssignEmployee.css'; // New CSS file for this modal


export const AssignEmployee = () => {
    // Assuming context provides modal control and the selected Task ID
    const values = useContext(AdminDashBoardContext); 
    const { showSuccess, showError } = useContext(AntDContext); // For AntD messages

    const [allEmployees, setAllEmployees] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const task = values.selectedTask?.current; // Get the ID of the Task being assigned

    // 1. Fetch Employees
    useEffect(() => {
        const fetchEmployees = async () => {
            setIsLoading(true);
            try {
                // Adjust API endpoint to fetch Employees
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/employees`); 
                const fetchedEmployees = response.data;
                
                setAllEmployees(fetchedEmployees);
                setFilteredEmployees(fetchedEmployees);
                setError(null);
            } catch (err) {
                console.error("Error fetching employees:", err);
                showError("Failed to load employee list.", 3);
                setError("Failed to load employees.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchEmployees();
    }, [showError]);


    // 2. Filter Employees based on search term (by name or email)
    useEffect(() => {
        if (!searchTerm) {
            setFilteredEmployees(allEmployees);
            return;
        }
        const lowerCaseSearch = searchTerm.toLowerCase();
        const results = allEmployees.filter(employee =>
            employee.fullName.toLowerCase().includes(lowerCaseSearch) ||
            employee.email.toLowerCase().includes(lowerCaseSearch) ||
            employee.designation.toLowerCase().includes(lowerCaseSearch)
        );
        setFilteredEmployees(results);
    }, [searchTerm, allEmployees]);


    // 3. Handle Assignment Action
    const handleAssign = async (employee) => {
        if (!task) {
            console.log(task,"is")
            showError("No task selected for assignment.", 3);
            return;
        }
        const employeeId = employee._id; // Assuming employee ID is '_id'
        const apiUrl = `${import.meta.env.VITE_API_URL}/assign-task/${employeeId}/${task._id}`;
        try {
            // API call to assign the selected employee to the selected task
            const response = await axios.post(apiUrl);
            console.log(response.data)
            showSuccess(`Successfully assigned Task ${task} to ${employee.name}.`, 3);
            handleClose(); 
        } catch (error) {
            console.error("Assignment failed:", error);
            showError(`Failed to assign task: ${error.response?.data?.message || 'Network error.'}`, 5);
        }
    };
    
    // 4. Handle Modal Close
    const handleClose = () => {
        // Assume the context state variable is named 'setIsAssignEmployeeFormOpen'
        values.setIsAssignEmployeeFormOpen(false); 
    }


    return (
        <div className="modal-overlay"> 
            <div className="assign-employee-container modal-content"> 
                
                {/* Close Button */}
                <button 
                    className="modal-close-btn" 
                    onClick={handleClose} 
                    title="Close Employee Selector"
                >
                    <X size={24} />
                </button>

                <h2 className="form-title">
                    <User size={24} style={{ marginRight: '10px' }} />
                    {/* Select Employee for Task ID: {task || 'N/A'} */}
                </h2>
                
                {error && <div className="form-message error">{error}</div>}

                {/* Search Bar */}
                <div className="search-bar-group">
                    <Search size={20} className="assign-search-icon" />
                    <input
                        type="text"
                        placeholder="Search employees by name or role..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="assign-search-input"
                    />
                </div>

                {isLoading ? (
                    <div className="employee-list-state loading-state">
                        <Loader size={32} className="spinner" />
                        <p>Loading employee directory...</p>
                    </div>
                ) : (
                    <div className="employee-list">
                        {filteredEmployees.length === 0 && (
                             <div className="employee-list-state no-results">
                                <Info size={24} />
                                <p>No employees match your search term.</p>
                            </div>
                        )}
                        
                        {filteredEmployees.map(employee => (
                            <div key={employee._id} className="employee-item">
                                <div className="employee-info">
                                    <h4 className="employee-name">{employee.fullName}</h4>
                                    <p className="employee-role">
                                        <Briefcase size={14} style={{ marginRight: '5px' }} />
                                        {employee.designation}
                                    </p>
                                    <span className="employee-email">{employee.email}</span>
                                </div>
                                <button 
                                    className="assign-action-btn"
                                    onClick={() => handleAssign(employee)}
                                >
                                    <User size={18} />
                                    Assign
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}