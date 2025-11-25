import React, { useContext, useEffect } from "react";
import {
  Users,
  Mail,
  BriefcaseBusiness,
  User,
  Loader,
  AlertCircle,
  Edit,
  Trash2,
} from "lucide-react";
import "../../assets/css/AdminEmployeesMenu.css";
import { AdminDashBoardContext } from "../../contexts/AdminDashBoardContext";
import { AntDContext } from "../../contexts/AntDContext";
import AllEmployeesFilterGroup from "./alltasks-menu-sub-comp/AllEmployeesFilterGroup";
import { useState } from "react";
import { filterTasks } from "../../utils/filter_and_sorting";
// Placeholder functions for actions

function AdminEmployeesMenu() {
  const {
    isLoading,
    allEmployees,
    error,
    selectedEmployee,
    handleChangeActiveLink,
    setIsEmployeeDetailsFormOpen,
    handleDeleteEmployee
  } = useContext(AdminDashBoardContext);
 const [fileteredEmployees, setFilteredEmployees] = useState(allEmployees);
  const [filterOptions, setFilterOptions] = useState({
    priority: "all",
    designation:"all"
  });
  
  const [searchInput,setSearchInput]=useState("")
  const handleManageEmployee = (employee) => {
    // console.log(employee);
    selectedEmployee.current = employee;
    setIsEmployeeDetailsFormOpen(true);
  };
  useEffect(() => {
    handleChangeActiveLink(1);
  }, []);

  useEffect(() => {
    // The filterTasks utility is called whenever the source tasks or filter options change.
  const seachTerms = ()=>{
  if(searchInput==="") {
    return [...allEmployees]
  }
  const searchResults = (allEmployees).filter(employee=>
  employee.fullName.toLowerCase().includes(searchInput.toLowerCase())||
  employee.userName.toLowerCase().includes(searchInput.toLowerCase())||
  employee.designation.toLowerCase().includes(searchInput.toLowerCase())
 )
  return searchResults;
  }
    const employeessForFilter = seachTerms() 
    filterTasks(employeessForFilter, setFilteredEmployees, filterOptions);
  }, [allEmployees, filterOptions,searchInput]);
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
        <p className="mock-warning">Displaying mock data for development.</p>
      </div>
    );
  }

  return (
    <div className="employee-menu-container">
      <h1 className="employee-list-title">
        <Users size={32} style={{ marginRight: "10px" }} />
        Employee Directory ({allEmployees.length})
      </h1>
      <AllEmployeesFilterGroup filterOptions={filterOptions} setFilterOptions={setFilterOptions} searchInput={searchInput} setSearchInput={setSearchInput}/>
      <div className="employee-table-wrapper">
        {allEmployees.length === 0 ? (
          <div className="no-data">
            No employees found. Please add a new employee.
          </div>
        ) : (
          <table className="employee-table">
            <thead>
              <tr>
                <th>Name</th>
                <th className="hide-on-mobile">Username</th>
                <th>Email</th>
                <th className="hide-on-mobile">Designation</th>
                <th className="actions-column">Actions</th>
              </tr>
            </thead>
            <tbody>
              {fileteredEmployees.map((employee) => (
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
                    <a href={`mailto:${employee.email}`} className="email-link">
                      {employee.email}
                    </a>
                  </td>
                  <td
                    data-label="Designation"
                    className="employee-designation-cell hide-on-mobile"
                  >
                    <BriefcaseBusiness size={16} className="icon-designation" />
                    <span
                      className={`designation-tag ${employee.designation
                        .toLowerCase()
                        .replace(/\s/g, "-")}`}
                    >
                      {employee.designation}
                    </span>
                  </td>
                  {/* New Actions Cell */}
                  <td data-label="Actions" className="actions-cell">
                    <button
                      className="action-btn manage-btn"
                      onClick={() => handleManageEmployee(employee)}
                      title="Manage/Edit Employee"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => handleDeleteEmployee(employee._id)}
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
