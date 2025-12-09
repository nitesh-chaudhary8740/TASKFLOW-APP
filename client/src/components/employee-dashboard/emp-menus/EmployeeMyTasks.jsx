import React, { useContext, useEffect, useState } from "react";
import "./EmployeeAllTasksMenu.css";
import { EmployeeDashboardContext } from "../../../contexts/EmployeeDashboardContext";
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

import EmpFilterGroup from "./EmpFilterGroup";
import { filterTasks, sortTasks } from "../../../utils/filter_and_sorting";
import EmpMyTasksCategory from "./EmpMyTasksCategory";
import ActionButtons from "./emp-mytasks/ActionButtons";
import { useNavigate } from "react-router-dom";
const taskCategories = {
  ALL_TASKS: "All",
  PENDING_TASKS: "Pending",
  COMPLTED_TASKS: "Completed",
  IN_PROGRESS_TASKS: "In-Progress",
  UNDER_REVIEW_TASKS: "Under-Review",
  OVERDUE_TASKS: "Overdue",
  BLOCKED_TASKS: "blocked",
};
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
  const navigate = useNavigate()
  const { employeeAllTasks, handleChangeActiveLink,selectedTask} = useContext(
    EmployeeDashboardContext
  );
  // const [selectedTasksArray,setSelectedTasksArray]=useState([])
  const [selectedTaskCategory, setSelectedTaskCategory] = useState(
    taskCategories.ALL_TASKS
  );
  const [filteredTasks, setFilteredTasks] = useState(employeeAllTasks);
  const [searchInput, setSearchInput] = useState("");
  const [filterOptions, setFilterOptions] = useState({
    priority: "all",
    status: "all",
  });
  const [sortOptions, setSortOptions] = useState({
    by: "none",
    order: "none",
  });
  useEffect(() => {
    handleChangeActiveLink(1);
  }, []);
  useEffect(() => {
    const seachTerms = () => {
      if (searchInput === "") {
        return [...employeeAllTasks];
      }
      const searchResults = employeeAllTasks.filter(
        (task) =>
          task.name.toLowerCase().includes(searchInput.toLowerCase()) ||
          task.dueDate.toLowerCase().includes(searchInput.toLowerCase()) ||
          task.id.toLowerCase().includes(searchInput.toLowerCase())
      );
      return searchResults;
    };
    const tasksForFilter = seachTerms();
    filterTasks(tasksForFilter, setFilteredTasks, filterOptions);
    sortTasks(tasksForFilter, setFilteredTasks, sortOptions);
  }, [employeeAllTasks, filterOptions, sortOptions, searchInput]);

  return (
    <>
      <div className="task-menu-container">
        <EmpMyTasksCategory
          tasks={employeeAllTasks}
          setFilterOptions={setFilterOptions}
          selectedTaskCategory={selectedTaskCategory}
          setSelectedTaskCategory={setSelectedTaskCategory}
          taskCategories={taskCategories}
        />
        {/* --- Filters and Sort Controls UI --- */}
        <EmpFilterGroup
          filterOptions={filterOptions}
          setFilterOptions={setFilterOptions}
          sortOptions={sortOptions}
          setSortOptions={setSortOptions}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
        />
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
                  <th style={{ width: "5%" }} className="sortable-header">
                    <button className="sort-btn">
                      SN.
                      <SortIcon direction={"asc"} />
                    </button>
                  </th>
                  <th style={{ width: "10%" }} className="sortable-header">
                    <button className="sort-btn">
                      Task Id
                      <SortIcon direction={"asc"} />
                    </button>
                  </th>
                  <th style={{ width: "30%" }} className="sortable-header">
                    <button className="sort-btn">
                      Task Name
                      <SortIcon direction={"asc"} />
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
                  <th style={{ width: "16%" }} className="actions-column">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task, i) => (
                  <tr key={task._id}>
                    <td data-label="Task Name" className="task-name-cell">
                      {i + 1}
                    </td>
                    <td data-label="Task Name" className="task-name-cell">
                      {task.id}
                    </td>
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
                      <ActionButtons task={task} />
                      <button
                        className="action-btn manage-btn"
                        title="submit task report"
                        onClick={()=>{
                          selectedTask.current=task
                          navigate(`/employee-dashboard/task-details/${task._id}`)
                        }}
                      >
                        view details
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

export default EmployeeMyTasks;
