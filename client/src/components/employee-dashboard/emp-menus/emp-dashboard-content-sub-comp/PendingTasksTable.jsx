import React from 'react'
import {ListTodo,ArrowRight} from 'lucide-react';
import { useContext } from 'react';
import { EmployeeDashboardContext } from '../../../../contexts/EmployeeDashboardContext';
const PriorityBadge = ({ priority }) => {
    let colorClass = '';
    switch (priority.toLowerCase()) {
        case 'high':
            colorClass = 'badge-high';
            break;
        case 'medium':
            colorClass = 'badge-medium';
            break;
        case 'low':
            colorClass = 'badge-low';
            break;
        default:
            colorClass = 'badge-default';
    }
    return <span className={`badge ${colorClass}`}>{priority}</span>;
};

function PendingTasksTable({TODAY}) {
    const {employeeAllTasks} = useContext(EmployeeDashboardContext)
  return (
    // <div className="content-box task-table-container">
    <> <div>

        <h2 className="box-title task-title-icon">
            <ListTodo className="icon-mr" />
            My Pending Tasks ({employeeAllTasks.filter(t => t.status.toLowerCase() !== 'Completed').length})
        </h2>
        
        <div className="overflow-scroll">
            <table className="emp-pending-task-table">
                <thead className="emp-pending-table-header">
                    <tr>
                        <th className="emp-pending-table-th rounded-tl">Task</th>
                        <th className="emp-pending-table-th">Priority</th>
                        <th className="emp-pending-table-th">Due Date</th>
                        <th className="emp-pending-table-th text-right rounded-tr">Action</th>
                    </tr>
                </thead>
                <tbody className="emp-pending-table-body">
                    {employeeAllTasks.filter(t => t.status !== 'Completed').map((task) => (
                        <tr key={task._id} className="emp-pending-table-row-item">
                            <td className="emp-pending-table-td text-main flex-center-y">
                                <span className={`emp-pending-task-icon-status ${task.priority.toLowerCase() === 'high' ? 'text-red' : 'text-indigo'}`}>
                                    <ListTodo className="w-4 h-4" />
                                
                                </span>
                                {task.name}
                            </td>
                            <td className="emp-pending-table-td">
                                <PriorityBadge priority={task.priority} />
                            </td>
                            <td className={`emp-pending-table-td text-sub-lg ${task.dueDate === TODAY ? 'text-due-today' : ''}`}>
                                {task.dueDate === TODAY ? 'TODAY!' : task.dueDate}
                            </td>
                         
                            <td className="emp-pending-table-td text-right">
                                <button className="action-link">
                                    View <ArrowRight className="w-4 h-4 ml-1" />
                                </button>
                            </td>
                        </tr>
                    ))}
                    {employeeAllTasks.filter(t => t.status !== 'Completed').length === 0 && (
                        <tr>
                            <td colSpan="5" className="emp-pending-table-empty-state">
                                🎉 You are all caught up! No tasks currently assigned.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
                    </div>
        </div>
        </>
    // </div>
);
}

export default PendingTasksTable
