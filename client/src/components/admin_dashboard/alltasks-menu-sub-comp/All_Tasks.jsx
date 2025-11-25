import {
  Calendar,
  Edit,
  Trash2,
  UserPlus,
  Users,
  UserMinus,
  Square,
  SquareCheck,
  SquareCheckBig,
  SquareCheckIcon,
  X,
  CheckSquare,
} from "lucide-react";
import React from "react";


function All_Tasks({
  fileteredTasks,
  tasks,
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
  setSelectedTasksArray
}) 

{
    const selectOrDeselectTask = (taskId)=>{
    const tempArr = [...selectedTasksArray]
    const index = tempArr.findIndex((id)=>id===taskId)
    console.log("temp",tempArr)
    console.log(index)
    if(index!==-1){
      tempArr.splice(index,1)
      console.log("removed",tempArr)
      setSelectedTasksArray(tempArr)
      return
    }
    tempArr.push(taskId)
    setSelectedTasksArray(tempArr)
    console.log(tempArr)
    return
}
const checkIsSelected = (taskId)=>{
    if(selectedTasksArray.includes(taskId)) return true;
    return false;
}
  return (
    <div className="task-table-wrapper">
      {fileteredTasks.length === 0 ? (
        <div className="no-data">No tasks found. Time to create a new one!</div>
      ) : (
        <table className="task-table">
          <thead>
            <tr>
              <th style={{ width: "5%" }} className="sortable-header">
                <button
                  className="sort-btn" /* onClick={() => handleSort('name')} */
                >
              { isSelecting? <span
              onClick={()=>{
                setIsSelecting(false)
                setSelectedTasksArray([])
              }}
              ><X/></span> : <span>
                <Square/>
                </span>}
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
            {(fileteredTasks || tasks).map((task, i) => (
              <tr key={task._id}
                 onClick={()=>{
                    setIsSelecting(true)
                    selectOrDeselectTask(task._id)
                }}
              >
                <td data-label="Task Name" className="task-sn-cell"
             
                >
                  <span style={{ display: "flex", gap: "1vh" }}>
                    <button className="sort-btn">
                      {isSelecting?(checkIsSelected(task._id)?<SquareCheck/>:<Square />):""}
                    </button>
                    {i + 1}
                  </span>
                </td>
                <td data-label="Task Name" className="task-i-cell">
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
                      onClick={() =>
                        handleViewAssignedList(task._id, task.assignedTo)
                      }
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
                  {task.isAssigned ? (
                    <button
                      className="action-btn unassign-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleUnassignTask(task._id)}}
                      title="Unassign Employee to Task"
                    >
                      <UserMinus size={16} />
                    </button>
                  ) : (
                    <button
                      className="action-btn assign-btn"
                      onClick={(e) =>{
                        e.stopPropagation()
                         handleAssignEmployee(task)}}
                      title="Assign Employee to Task"
                    >
                      <UserPlus size={16} />
                    </button>
                  )}

                  <button
                    className="action-btn manage-btn"
                    onClick={(e) => {
                        e.stopPropagation()
                        handleManageTask(task)}}
                    title="Manage/Edit Task"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    className="action-btn delete-btn"
                    onClick={(e) => {
                        e.stopPropagation
                        handleDeleteTask(task._id)
                    }}
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
  );
}

export default All_Tasks;
