import React, { useContext } from "react";
import { EmployeeDashboardContext } from "../../../../contexts/EmployeeDashboardContext";
const TASK_STATUS_OBJECT = {
  PENDING: "Pending",
  IN_PROGRESS: "In-Progress",
  UNDER_REVIEW: "Under-Review",
  COMPLETED: "Completed",
  BLOCKED: "Blocked",
  OVERDUE: "Overdue",
};
function ActionButtons({  task }) {
  const { startWorkOnTask,stopWorkOnTask } = useContext(EmployeeDashboardContext);
  if (task.status === TASK_STATUS_OBJECT.PENDING) 
    return (
    <button
      className="action-btn assign-btn"
      title="View task details"
      onClick={() => startWorkOnTask(task._id)}
    >
      start work
    </button>);
  if (task.status===TASK_STATUS_OBJECT.IN_PROGRESS) 
    return (
    <button
      className="action-btn assign-btn"
      title="View task details"
      onClick={() => stopWorkOnTask(task._id)}
    >
      Stop working
    </button>
);
//   return <div></div>;
}

export default ActionButtons;
