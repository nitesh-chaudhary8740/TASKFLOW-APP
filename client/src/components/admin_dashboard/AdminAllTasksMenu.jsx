import "../../assets/css/AdminAllTasksMenu.css";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import {
  ListChecks,
  Calendar,
  Edit,
  Trash2,
  Loader,
  AlertCircle,
  UserPlus,
  Users,
  UserMinus,
} from "lucide-react";
import { AdminDashBoardContext } from "../../contexts/AdminDashBoardContext";
import { AntDContext } from "../../contexts/AntDContext";
import { filterTasks } from "../../utils/filter_and_sorting";
import AllTasksFilterGroup from "./alltasks-menu-sub-comp/AllTasksFilterGroup";

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

function AdminAllTasksMenu() {

  const [fileteredTasks, setFilteredTasks] = useState(null);
  const [filterOptions, setFilterOptions] = useState({
    priority: "all",
    status: "all",
    isAssigned: "all",
  });
  
  const [searchInput,setSearchInput]=useState("")
  const adminContextValues = useContext(AdminDashBoardContext);
  const {tasks,isLoading,error,setTasks} = useContext(AdminDashBoardContext);
  const { showSuccess, showError } = useContext(AntDContext);

  // --- Action Handlers (Moved inside to access AntDContext) ---
  const handleManageTask = (task) => {
     console.log(`task: ${task}`);
    adminContextValues.selectedTask.current = task;
      adminContextValues.setIsTaskDetailsFormOpen(true)
  };

  const handleViewAssignedList = (taskId, assignedTo) => {
    console.log(`Viewing assigned employees for task ID: ${taskId}`);
    const assignedName = assignedTo?.empName || "No one";
    showError(
      `Simulated: Task ${taskId} is assigned to: ${assignedName}. (Viewing full list not implemented)`,
      5
    ); // Using AntD notification
  };

  const handleAssignEmployee = (task) => {
    console.log(`Assigning employee to task with ID: ${task}`);
    adminContextValues.selectedTask.current = task;
    adminContextValues.setIsAssignEmployeeFormOpen(true);
  };

  // useEffect for filter
  
  useEffect(() => {
    // The filterTasks utility is called whenever the source tasks or filter options change.
  const seachTerms = ()=>{
  if(searchInput==="") {
    return [...tasks]
  }
  const searchResults = (tasks).filter(task=>
  task.name.toLowerCase().includes(searchInput.toLowerCase())||
  task.dueDate.toLowerCase().includes(searchInput.toLowerCase())||
  (task.isAssigned && task.assignedTo?.empName?.toLowerCase().includes(searchInput.toLowerCase()))
  )
  return searchResults;
  }
    const tasksForFilter = seachTerms() //this function will return the array for filter
    //because filter must be perfomed on the searchTasks, not all availble,
    //if seachbox is empty then filter will apply on all tasks, else on the search results
    filterTasks(tasksForFilter, setFilteredTasks, filterOptions);
  }, [tasks, filterOptions,searchInput]);
useEffect(()=>{

},[searchInput])
 
useEffect(()=>{
  adminContextValues.handleChangeActiveLink(2);
},[])
  // --- DELETE Task Handler (With Optimistic Update and Rollback) ---
  const handleDeleteTask = async (taskId) => {
    // 1. Capture current state for rollback
    const originalTasks = tasks;

    // 2. Optimistic Update: Immediately filter out the task from the local state
    const tempArr = tasks.filter((task) => task._id !== taskId);
    setTasks(tempArr);

    try {
      // 3. API Call to Delete
      const apiUrl = import.meta.env.VITE_API_URL;
      await axios.delete(`${apiUrl}/delete-task/${taskId}`);

      // 4. Success: Confirmation message (UI is already updated)
      showSuccess("Task deleted successfully!", 3);
    } catch (err) {
      // 5. Failure: Rollback UI and show error message
      console.error("Error deleting task:", err.response?.data || err.message);

      // Revert state back to original tasks list
      setTasks(originalTasks);

      const errMsg =
        err.response?.data?.message || "Failed to delete task. Network error.";
      showError(errMsg, 5);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
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
        <p className="mock-warning">Displaying mock data for development.</p>
      </div>
    );
  }

  return (
    <>
      <div className="task-menu-container">
        <h1 className="task-list-title">
          <ListChecks size={32} style={{ marginRight: "10px" }} />
          All Project Tasks ({tasks.length})
        </h1>

        {/* --- Filters and Sort Controls UI --- */}
   <AllTasksFilterGroup filterOptions={filterOptions} setFilterOptions={setFilterOptions} searchInput={searchInput} setSearchInput={setSearchInput}/>
        {/* --- END NEW UI --- */}

        <div className="task-table-wrapper">
          {tasks.length === 0 ? (
            <div className="no-data">
              No tasks found. Time to create a new one!
            </div>
          ) : (
            <table className="task-table">
              <thead>
                <tr>
                  <th style={{ width: "5%" }} className="sortable-header">
                    <button
                      className="sort-btn" /* onClick={() => handleSort('name')} */
                    >
                      
                     
                    </button>
                  </th>
                  <th style={{ width: "10%" }} className="sortable-header">
                    <button
                      className="sort-btn" /* onClick={() => handleSort('name')} */
                    >
                      Task Id
                      
                    </button>
                  </th>
                  <th style={{ width: "30%" }} className="sortable-header">
                    <button
                      className="sort-btn" /* onClick={() => handleSort('name')} */
                    >
                      Task Name
                      <SortIcon direction={"asc"} />
                    </button>
                  </th>
                  <th style={{ width: "20%" }} className="hide-on-mobile">
                    Assigned To
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
                {(fileteredTasks || tasks).map((task,i) => (
                  <tr key={task._id}>
                    <td data-label="Task Name" className="task-sn-cell">
                      {i+1}
                    </td>
                    <td data-label="Task Name" className="task-i-cell" >
                      {task?.id||"task-100"}
                    </td>
                    <td data-label="Task Name" className="task-name-cell">
                      {task.name}
                    </td>
                    <td
                      data-label="Assigned To"
                      className="assigned-to-cell hide-on-mobile"
                    >
                      {task.isAssigned ?   <button
                        className="assigned-list-btn"
                        onClick={() =>
                          handleViewAssignedList(task._id, task.assignedTo)
                        }
                        title="View Assigned Employees List"
                      >
                        <Users size={16} className="icon-user" />
                        <span className="assigned-name">
                          {task.assignedTo.empName}
                        </span>
                      </button> : "none"}
                   
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
                      {task.isAssigned?<button
                        className="action-btn unassign-btn"
                        // onClick={() => handleAssignEmployee(task)}
                        title="Unassign Employee to Task"
                      >
                        <UserMinus size={16}/>
                      </button>:  <button
                        className="action-btn assign-btn"
                        onClick={() => handleAssignEmployee(task)}
                        title="Assign Employee to Task"
                      >
                        <UserPlus size={16} />
                      </button>}
                    
                      
                      <button
                        className="action-btn manage-btn"
                        onClick={() => handleManageTask(task)}
                        title="Manage/Edit Task"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDeleteTask(task._id)}
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
    </>
  );
}

export default AdminAllTasksMenu;
