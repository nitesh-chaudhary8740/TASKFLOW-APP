import React, { useContext, useEffect, useState } from 'react'
import "./EmployeeAllTasksMenu.css"
import { EmployeeDashboardContext } from '../../../contexts/EmployeeDashboardContext';
import {
  ListChecks,
  Calendar,
  Edit,
  Trash2,
  UserPlus,
  ViewIcon,
  View,
  Menu,
} from "lucide-react";

import EmpFilterGroup from './EmpFilterGroup';
import { filterTasks, sortTasks,  } from '../../../utils/filter_and_sorting';
const SortIcon = ({ direction = "none" }) => {
  let color = direction === "none" ? "var(--text-light)" : "var(--primary)";
  let opacity = direction === "none" ? 0.4 : 1;
  let Icon = direction === "asc" ? "▲" : direction === "desc" ? "▼" : "⇅";

  return (
    <span
      style={{
        marginLeft: "5px",
        color,
        opacity,
        transition: "0.2s",
        fontSize: "0.7em",
      }}
    >
      {Icon}
    </span>
  );
};
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };
function EmployeeMyTasks() {
  const {employeeAllTasks}=useContext(EmployeeDashboardContext)
  const [filteredTasks,setFilteredTasks] = useState([])
  const [filterOptions, setFilterOptions] = useState({
    priority: "all",
    status: "all",
  });
  const [sortOptions,setSortOptions] = useState({
    by: "none",
    order: "none",
  });
useEffect(()=>{
setFilteredTasks(employeeAllTasks)
},[employeeAllTasks])
useEffect(()=>{
  filterTasks(employeeAllTasks,setFilteredTasks,filterOptions)
  sortTasks(employeeAllTasks,setFilteredTasks,sortOptions)
},[employeeAllTasks,filterOptions,sortOptions])


  return (
       <>
      <div className="task-menu-container">
        <h1 className="task-list-title">
          <ListChecks size={32} style={{ marginRight: "10px" }} />
          All Project Tasks ({filteredTasks.length})
        </h1>

        {/* --- Filters and Sort Controls UI --- */}
   <EmpFilterGroup filterOptions={filterOptions} setFilterOptions={setFilterOptions} sortOptions={sortOptions} setSortOptions={setSortOptions}/>
        {/* --- END NEW UI --- */}

        <div className="task-table-wrapper">
          {filteredTasks.length === 0 ? (
            <div className="no-data">
              No tasks found. Time to create a new one!
            </div>
          ) : (
            <table className="task-table">
              <thead>
                <tr>
                  <th style={{ width: "30%" }} className="sortable-header">
                    <button
                      className="sort-btn" 
                     
                    >
                      Task Name
                      <SortIcon direction={"asc"}  />
                    </button>
                  </th>
                
                  <th style={{ width: "15%" }} className="sortable-header">
                    <button
                      className="sort-btn" /* onClick={() => handleSort('status')} */
                    >
                      Status
                      <SortIcon direction={"none"} />
                    </button>
                  </th>
                  <th
                    style={{ width: "10%" }}
                    className="hide-on-mobile sortable-header"
                  >
                    <button
                      className="sort-btn" /* onClick={() => handleSort('priority')} */
                    >
                      Priority
                      <SortIcon direction={"none"} />
                    </button>
                  </th>
                  <th
                    style={{ width: "15%" }}
                    className="hide-on-mobile sortable-header"
                  >
                    <button
                      className="sort-btn" /* onClick={() => handleSort('dueDate')} */
                       
                    >
                      Due Date
                      <SortIcon direction={"none"} />
                    </button>
                  </th>
                  <th style={{ width: "10%" }} className="actions-column">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task) => (
                  <tr key={task._id}>
                    <td data-label="Task Name" className="task-name-cell">
                      {task.name}
                    </td>
                  
                    <td data-label="Status" className="status-cell">
                      <span
                        className={`status-tag ${task.status
                          .toLowerCase()
                          .replace(/\s/g, "-")}`}
                      >
                        {task.status}
                      </span>
                    </td>
                    <td
                      data-label="Priority"
                      className="priority-cell hide-on-mobile"
                    >
                      <span
                        className={`priority-tag ${task.priority.toLowerCase()}`}
                      >
                        {task.priority}
                      </span>
                    </td>
                    <td
                      data-label="Due Date"
                      className="date-cell hide-on-mobile"
                    >
                      <Calendar size={16} className="icon-calendar" />
                      {formatDate(task.dueDate)}
                    </td>
                    <td data-label="Actions" className="actions-cell">
                      <button
                        className="action-btn assign-btn"
                        title="View task details"
                      >
                        <Menu size={16} />
                      </button>
                      <button
                        className="action-btn manage-btn"
                        title="submit task report"
                      >
                        <Edit size={16} />
                      </button>
                    
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
  
}

export default EmployeeMyTasks
