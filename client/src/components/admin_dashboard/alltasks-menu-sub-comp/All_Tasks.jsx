import {
  Calendar,
  Edit,
  Trash2,
  UserPlus,
  Users,
  UserMinus,
  Square,
  CheckSquare,
  X,
  LucideUserRoundPlus,
} from "lucide-react";
import React, { useContext, useEffect, useMemo } from "react";
import "./All_Tasks.css";
import { AdminDashBoardContext } from "../../../contexts/AdminDashBoardContext";


function All_Tasks({
  fileteredTasks,
  // tasks, // Removed, unused in this component
  // eslint-disable-next-line no-unused-vars
  SortIcon,
  handleAssignEmployee,
  handleDeleteTask,
  handleUnassignTask,
  handleManageTask,
  handleViewAssignedList,
  formatDate,
  isSelecting,
  setIsSelecting,
  selectedTasksArray,
  setSelectedTasksArray,
  selectedTaskCategory,
  filterOptions,
}) {
  // --- Helper function to toggle task selection ---
  const adminContextValues = useContext(AdminDashBoardContext)
  useEffect(()=>{
    
    setIsSelecting(false)
    setSelectedTasksArray([])

  },[filterOptions,selectedTaskCategory,setIsSelecting,setSelectedTasksArray])
  const selectOrDeselectTask = (taskId) => {
    const tempArr = [...selectedTasksArray];
    const index = tempArr.findIndex((id) => id === taskId);

    if (index !== -1) {
      // Deselect: remove ID from array
      tempArr.splice(index, 1);
    } else {
      // Select: add ID to array
      tempArr.push(taskId);
    }
    setSelectedTasksArray(tempArr);
  };

  // --- Helper function to check if task is currently selected ---
  const checkIsSelected = (taskId) => {
    return selectedTasksArray.includes(taskId);
  };

  // --- Toggle "Select All" functionality ---
  const handleSelectAll = () => {
    if (
      selectedTasksArray.length === fileteredTasks.length &&
      fileteredTasks.length > 0
    ) {
      // Deselect all
      setSelectedTasksArray([]);
    } else {
      // Select all currently filtered tasks
      const allFilteredIds = fileteredTasks.map((task) => task._id);
      setSelectedTasksArray(allFilteredIds);
    }
  };
  // --- Header Checkbox Logic ---
  const renderHeaderCheckbox = () => {
    if (!isSelecting) {
      return <Square size={18} title="Enable Multi-Select" />;
    }

    const allSelected =
      selectedTasksArray.length > 0 &&
      selectedTasksArray.length === fileteredTasks.length;

    return (
      <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <button
          className="select-all-btn"
          onClick={(e) => {
            e.stopPropagation();
            handleSelectAll();
          }}
          title={allSelected ? "Deselect All" : "Select All"}
        >
          {allSelected ? (
            <CheckSquare size={18} color="#10b981" />
          ) : (
            <Square size={18} />
          )}
        </button>
        <button
          className="exit-select-btn"
          onClick={(e) => {
            e.stopPropagation();
            setIsSelecting(false);
            setSelectedTasksArray([]);
          }}
          title="Exit Selection Mode"
        >
          <X size={18} />
        </button>
      </span>
    );
  };

  // --- Table Row Click Handler ---
  const handleRowClick = (task) => {
    // If selection mode is active, click the row to toggle selection.
    if (isSelecting) {
      selectOrDeselectTask(task._id);
    } else {
      // If selection mode is not active, treat the click as a single item management view.
      handleManageTask(task);
    }
  };

  const {
    assignedTaskIds,
    unassignedTaskIds,
    assignedCount,
    unassignedCount,
    hasAssignedTasks,
  } = useMemo(() => {
    if (selectedTasksArray.length === 0) {
      return {
        assignedTaskIds: [],
        unassignedTaskIds: [],
        assignedCount: 0,
        unassignedCount: 0,
        hasAssignedTasks: false,
      };
    }

    // Find the full task objects for the selected IDs
    const selectedTasks = fileteredTasks.filter((task) =>
      selectedTasksArray.includes(task._id)
    );

    // Separate IDs into two groups
    const assigned = selectedTasks
      .filter((task) => task.isAssigned)
      .map((task) => task._id);
    const unassigned = selectedTasks
      .filter((task) => !task.isAssigned)
      .map((task) => task._id);

    return {
      assignedTaskIds: assigned,
      unassignedTaskIds: unassigned,
      assignedCount: assigned.length,
      unassignedCount: unassigned.length,
      hasAssignedTasks: assigned.length > 0, // Used for Delete button restriction
    };
  }, [selectedTasksArray, fileteredTasks]);

  // Determine if the bulk delete button should be disabled (unchanged from previous)
  const isDeleteDisabled = hasAssignedTasks;

  // Determine if the bulk assign button should be disabled (NEW)
  const isAssignDisabled = unassignedCount === 0;

  // Determine if the bulk unassign button should be disabled (NEW)
  const isUnassignDisabled = assignedCount === 0;

  return (
    <div className="task-table-wrapper">
      {/* --- START OF BULK ACTION BAR --- */}
      {isSelecting && selectedTasksArray.length > 0 && (
        <div className="bulk-actions-bar">
          <span className="selected-info-section">
            <span className="selected-count">
              {selectedTasksArray.length} task
              {selectedTasksArray.length !== 1 ? "s" : ""} selected
            </span>
            {/* Display Warning if assigned tasks are selected for Delete */}
            {isDeleteDisabled && (
              <span className="bulk-warning">
                ⚠️ Delete action is disabled for **{assignedCount}** assigned
                task{assignedCount !== 1 ? "s" : ""}. Unassign first.
              </span>
            )}
          </span>

          <div className="bulk-action-buttons">
            {/* Bulk Assign/Reassign - Targets UNASSIGNED tasks */}
            <button
              className="bulk-action-btn bulk-assign-btn"
              // Pass only the IDs of the unassigned tasks
              onClick={() => {
                setIsSelecting(false)
                adminContextValues.selectedTask.current=null;
                adminContextValues.selectedTasks.current=unassignedTaskIds;
                adminContextValues.setIsAssignEmployeeFormOpen(true)
                setIsSelecting(false)
                setSelectedTasksArray([])

              }}
              disabled={isAssignDisabled}
              title={
                isAssignDisabled
                  ? "No unassigned tasks selected"
                  : `Assign Employees to ${unassignedCount} Selected Task(s)`
              }
            >
              <UserPlus size={18} /> Assign Selected ({unassignedCount})
            </button>

            {/* Bulk Unassign - Targets ASSIGNED tasks */}
            {selectedTaskCategory ==="Pending" &&
              <button
                className="bulk-action-btn bulk-unassign-btn"
                // Pass only the IDs of the assigned tasks
                onClick={() => {
                    setIsSelecting(false)
                    handleUnassignTask(assignedTaskIds)
                }}
                disabled={isUnassignDisabled}
                title={
                  isUnassignDisabled
                    ? "No assigned tasks selected"
                    : `Unassign Employees from ${assignedCount} Selected Task(s)`
                }
              >
                <UserMinus size={18} /> Unassign Selected ({assignedCount})
              </button>
            }

            {/* Bulk Delete - Disabled if any assigned task is selected */}
            <button
              className="bulk-action-btn bulk-delete-btn"
              // Pass all selected tasks for deletion (the backend should handle final validation)
              onClick={() =>{
                setIsSelecting(false)
                !isDeleteDisabled && adminContextValues.handleBulkDeleteTasks(selectedTasksArray)
              }}
              disabled={isDeleteDisabled}
              title={
                isDeleteDisabled
                  ? "Cannot delete assigned tasks. Unassign first."
                  : "Delete Selected Tasks"
              }
            >
              <Trash2 size={18} /> Delete Selected
            </button>
          </div>
        </div>
      )}
      {/* --- END OF BULK ACTION BAR --- */}

      {fileteredTasks.length === 0 ? (
        <div className="no-data">No tasks found. Time to create a new one!</div>
      ) : (
        <table className="task-table">
          <thead>
            <tr>
              {/* NEW SELECTION/SN COLUMN */}
              <th
                style={{ width: "5%" }}
                className="sortable-header select-header"
                onClick={() => !isSelecting && setIsSelecting(true)}
              >
                {renderHeaderCheckbox()}
              </th>

              <th style={{ width: "10%" }} className="sortable-header">
                <button className="sort-btn">Task Id</button>
              </th>
              <th style={{ width: "30%" }} className="sortable-header">
                <button className="sort-btn">
                  Task Name
                  <SortIcon direction={"asc"} />
                </button>
              </th>
              <th style={{ width: "20%" }} className="hide-on-mobile">
                Assigned To
              </th>
              <th style={{ width: "15%" }} className="sortable-header">
                <button className="sort-btn">
                  Status
                  <SortIcon direction={"none"} />
                </button>
              </th>
              <th
                style={{ width: "10%" }}
                className="hide-on-mobile sortable-header"
              >
                <button className="sort-btn">
                  Priority
                  <SortIcon direction={"none"} />
                </button>
              </th>
              <th
                style={{ width: "15%" }}
                className="hide-on-mobile sortable-header"
              >
                <button className="sort-btn">
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
            {fileteredTasks.map((task, i) => (
              <tr
                key={task._id}
                className={checkIsSelected(task._id) ? "task-row-selected" : ""}
                onClick={() => handleRowClick(task)}
              >
                {/* SELECTION CHECKBOX CELL */}
                <td
                  data-label="Select"
                  className="task-sn-cell"
                  onClick={(e) => {
                    if (isSelecting) e.stopPropagation();
                  }}
                >
                  {isSelecting ? (
                    <button
                      className="select-row-checkbox-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        selectOrDeselectTask(task._id);
                      }}
                    >
                      {checkIsSelected(task._id) ? (
                        <CheckSquare size={18} color="#10b981" />
                      ) : (
                        <Square size={18} color="#9ca3af" />
                      )}
                    </button>
                  ) : (
                    <span className="task-sn-number">{i + 1}</span>
                  )}
                </td>

                <td data-label="Task ID" className="task-i-cell">
                  {task?.id || "task-100"}
                </td>
                <td data-label="Task Name" className="task-name-cell">
                  {task.name}
                </td>
                <td
                  data-label="Assigned To"
                  className="assigned-to-cell hide-on-mobile"
                >
                  {task.isAssigned ? (
                    <button
                      className="assigned-list-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewAssignedList(task._id, task.assignedTo);
                      }}
                      title="View Assigned Employees List"
                    >
                      <Users size={16} className="icon-user" />
                      <span className="assigned-name">
                        {task.assignedTo.userName}
                      </span>
                    </button>
                  ) : (
                    "none"
                  )}
                </td>
                <td data-label="Status" className="status-cell">
                  <span
                    className={`status-tag task-status-${task.status
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
                <td data-label="Due Date" className="date-cell hide-on-mobile">
                  <Calendar size={16} className="icon-calendar" />
                  {formatDate(task.dueDate)}
                </td>
                <td data-label="Actions" className="actions-cell">
                  {/* --- Individual Buttons (DISABLED when isSelecting is true) --- */}

                  {task.isAssigned ? (
                    <button
                      className="action-btn unassign-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                    handleUnassignTask(task._id)
                      }}
                      title="Unassign Employee to Task"
                      disabled={isSelecting}
                    >
                      <UserMinus size={16} />
                    </button>
                  ) : (
                    <button
                      className="action-btn assign-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAssignEmployee(task);
                      }}
                      title="Assign Employee to Task"
                      disabled={isSelecting}
                    >
                      <UserPlus size={16} />
                    </button>
                  )}

                  <button
                    className="action-btn manage-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleManageTask(task);
                    }}
                    title="Manage/Edit Task"
                    disabled={isSelecting}
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    className="action-btn delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTask(task._id)
                    }}
                    title="Delete Task"
                    disabled={isSelecting||(task.isAssigned && task.status!=="Pending")}
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
  );
}

export default All_Tasks;
