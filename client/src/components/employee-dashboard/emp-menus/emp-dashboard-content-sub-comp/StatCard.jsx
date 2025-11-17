import React from 'react';
import { Clock, Calendar, AlertTriangle, ListTodo, FileText, CheckCircle, ClockAlert } from 'lucide-react';
import { useContext } from 'react';
import { EmployeeDashboardContext } from '../../../../contexts/EmployeeDashboardContext';

// Helper function to get today's date in YYYY-MM-DD format for direct string comparison
const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const TODAY_STRING = getTodayDateString(); 

function StatCard() {
    const { employeeAllTasks } = useContext(EmployeeDashboardContext);

    // --- Corrected Calculations (All use .length and fixed field names) ---
    const totalTasks = employeeAllTasks.length;

    // Filter for tasks strictly 'pending'
    const pendingTasks = employeeAllTasks.filter(task => task.status.toLowerCase() === "pending").length;

    // Filter for tasks strictly 'in-progress'
    // NOTE: Confirmed status field name is 'status' (not 'staus')
    const inProgressTasks = employeeAllTasks.filter(task => task.status.toLowerCase() === "in-progress").length;

    // Filter for tasks strictly 'completed'
    const completedTasks = employeeAllTasks.filter(task => task.status.toLowerCase() === "completed").length;

    // Overdue Tasks: Date passed TODAY_STRING and status is not Completed
    const overdueTasks = employeeAllTasks.filter(task =>
        task.dueDate < TODAY_STRING &&
        task.status.toLowerCase() !== "completed"
    ).length;

    // Due Today: Date is TODAY_STRING and status is not Completed
    const tasksDueToday = employeeAllTasks.filter(task =>
        task.dueDate === TODAY_STRING &&
        task.status.toLowerCase() !== "completed"
    ).length;

    // High Priority Pending: Priority is High and status is not Completed
    // NOTE: Corrected typo 'priortiy' to 'priority'
    const highPriorityPending = employeeAllTasks.filter(task =>
        task.priority.toLowerCase() === "high" &&
        task.status.toLowerCase() !== "completed"
    ).length;


    // --- Stat Card Definition Array ---
    const statcards = [
        { 
            title: "Total Tasks Assigned", 
            value: totalTasks, 
            Icon: ListTodo, 
            colorClass: "color-indigo"
        },
        
        { 
            title: "Tasks In Progress", 
            value: inProgressTasks, 
            Icon: Clock, 
            colorClass: "color-yellow" 
        },

        // NEW: Separate Overdue Tasks for recovery visibility
        { 
            title: "Overdue Tasks", 
            value: overdueTasks, 
            Icon: ClockAlert, 
            colorClass: "color-maroon" 
        },

        // Due Today (Immediate action required)
        { 
            title: "Due Today", 
            value: tasksDueToday, 
            Icon: Calendar, 
            colorClass: "color-red" 
        },
        
        { 
            title: "High Priority Pending", 
            value: highPriorityPending, 
            Icon: AlertTriangle, 
            colorClass: "color-orange"
        },
        
        { 
            title: "Completed Tasks", 
            value: completedTasks,
            Icon: CheckCircle, 
            colorClass: "color-green"
        },
        
        { 
            title: "Pending Tasks", 
            value: pendingTasks,
            Icon: FileText, 
            colorClass: "color-blue"
        },
    ];

    // --- Fixed JSX Return Syntax and using only provided class names ---
    return (
        <div className="stats-grid"> 
            {statcards.map((card, i) => (
                <div 
                    key={`stat-card-${i}`}
                    className="stat-card"
                >
                    <div className={`stat-icon-wrapper ${card.colorClass}`}>
                        <card.Icon className="statcard-icon" /> 
                    </div>
                    <p className="stat-value">{card.value}</p>
                    <h3 className="stat-label">{card.title}</h3>
                </div>
            ))}
        </div>
    );
}

export default StatCard;