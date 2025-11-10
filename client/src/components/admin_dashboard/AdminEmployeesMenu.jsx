import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Users, Mail, BriefcaseBusiness, User, Loader, AlertCircle, Edit, Trash2 } from 'lucide-react';
import "../../assets/css/AdminEmployeesMenu.css"
import { AdminDashBoardContext } from '../../contexts/AdminDashBoardContext';
// Placeholder functions for actions


const handleDeleteEmployee = (employeeId) => {
    console.log(`Deleting employee with ID: ${employeeId}`);
    const confirmation = window.confirm(`Are you sure you want to delete employee ID ${employeeId}?`);
    if (confirmation) {
        // Implement API call to delete the employee
        alert(`Employee ID ${employeeId} deleted (simulated).`);
    }
};

function AdminEmployeesMenu() {
    const [employees, setEmployees] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const adminContextValues = useContext(AdminDashBoardContext)
const handleManageEmployee = (employeeId) => {
  console.log(employeeId)
  adminContextValues.selectedEmployee.current = employeeId
  adminContextValues.setIsAssignTaskFormOpen(true)
 
};
    useEffect(()=>{
           adminContextValues.handleChangeActiveLink(1)
      },[])
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                // Ensure environment variable is defined
                const apiUrl = import.meta.env.VITE_API_URL;
                if (!apiUrl) {
                    throw new Error("VITE_API_URL is not defined in environment variables.");
                }

                const response = await axios.get(`${apiUrl}/employees`);
                setEmployees(response.data);
                setError(null);
            } catch (err) {
                console.error("Error fetching employees:", err);
                const errMsg = err.response ? err.response.data : err.message;
                setError(errMsg);
                // Set mock data if fetch fails (for development)
              
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchEmployees();
    }, []);

    // Mock data for development when API is unavailable
  

    if (isLoading) {
        return (
            <div className="employee-menu-container loading-state">
                <Loader size={32} className="spinner" />
                <p>Loading employee data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="employee-menu-container error-state">
                <AlertCircle size={32} color="#ef4444" />
                <h2>Error Loading Data</h2>
                <p>Could not fetch employee list. Details: {error}</p>
                <p className='mock-warning'>Displaying mock data for development.</p>
            </div>
        );
    }

    return (
        <div className="employee-menu-container">
            <h1 className="employee-list-title">
                <Users size={32} style={{ marginRight: '10px' }} />
                Employee Directory ({employees.length})
            </h1>

            <div className="employee-table-wrapper">
                {employees.length === 0 ? (
                    <div className="no-data">
                        No employees found. Please add a new employee.
                    </div>
                ) : (
                    <table className="employee-table">
                        <thead>
                            <tr><th>Name</th>
                                <th className="hide-on-mobile">Username</th>
                                <th>Email</th>
                                <th className="hide-on-mobile">Designation</th>
                                <th className="actions-column">Actions</th></tr>
                        </thead>
                        <tbody>
                            {employees.map((employee) => (
                                <tr key={employee._id}>
                                    <td data-label="Name" className="employee-name-cell">
                                        <User size={18} className="icon-name" />
                                        {employee.fullName}
                                    </td>
                                    <td data-label="Username" className="hide-on-mobile">
                                        {employee.userName}
                                    </td>
                                    <td data-label="Email" className="employee-email-cell">
                                        <Mail size={16} className="icon-email" />
                                        <a href={`mailto:${employee.email}`} className="email-link">{employee.email}</a>
                                    </td>
                                    <td data-label="Designation" className="employee-designation-cell hide-on-mobile">
                                        <BriefcaseBusiness size={16} className="icon-designation" />
                                        <span className={`designation-tag ${employee.designation.toLowerCase().replace(/\s/g, '-')}`}>
                                            {employee.designation}
                                        </span>
                                    </td>
                                    {/* New Actions Cell */}
                                    <td data-label="Actions" className="actions-cell">
                                        <button 
                                            className="action-btn manage-btn" 
                                            onClick={() => handleManageEmployee(employee._id)}
                                            title="Manage/Edit Employee"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button 
                                            className="action-btn delete-btn" 
                                            onClick={() => handleDeleteEmployee(employee.id)}
                                            title="Delete Employee"
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

export default AdminEmployeesMenu;