import React, { useContext, useEffect } from 'react'
import { PlusCircle, UserPlus, ListPlus, FolderPlus, Activity, TrendingUp, Users, CheckCircle, Clock } from 'lucide-react';
import { AdminDashBoardContext } from '../../contexts/AdminDashBoardContext';
import { TASK_MANAGEMENT_HOME } from '../../contexts/TaskManageMent.context';
import { Navigate, useNavigate } from 'react-router-dom';
// import { TASK_MANAGEMENT_HOME } from '../../contexts/TaskManageMent.context';

// Mock data for the summary cards
const summaryData = [
    { 
        title: "Total Employees", 
        value: 'totalEmployees', 
        icon: Users, 
        colorClass: 'card-blue' 
    },
    { 
        title: "Active Projects", 
        value: "activeProjects", 
        icon: FolderPlus, 
        colorClass: 'card-green' 
    },
    { 
        title: "Total Tasks", 
        value: 'totalTasks', 
        icon: CheckCircle, 
        colorClass: 'card-indigo' 
    },
    { 
        title: "Unassigned Tasks", 
        value: 'totalUnAssignedTasks',
        icon: Clock, 
        colorClass: 'card-red' 
    },
];

// Helper component for the Action Buttons
// eslint-disable-next-line no-unused-vars
const QuickActionButton = ({ icon: Icon, title, onClick }) => (
    <button className="quick-action-btn" onClick={onClick}>
        <Icon size={24} className="action-icon" />
        <span className="action-title">{title}</span>
    </button>
);

// Helper component for the Summary Cards
// eslint-disable-next-line no-unused-vars
const SummaryCard = ({ title, value, icon: Icon, colorClass,metaData,navigateToAllTasks}) => (
    <div className={`summary-card ${colorClass}`} onClick={()=>{navigateToAllTasks(value)}}>
        <div className="summary-card-header">
            <h3 className="summary-card-title">{title}</h3>
            <Icon size={20} className="summary-card-icon" />
        </div>
        <p className="summary-card-value">{metaData[value]|0}</p>
    </div>
);


function AdminDashBoardContent() {
  const navigate = useNavigate()
  const navigateToAllTasks = (value)=>{
    console.log(value)
    if(value==="totalUnAssignedTasks") navigate("all-tasks",{state:{ isAssigned: "false"}})
    if(value==="totalEmployees") navigate("employees")
    if(value==="totalTasks") navigate("all-tasks")
  }
  const todayDate = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
    const {currentUser} = useContext(TASK_MANAGEMENT_HOME)
    const adminContextValues = useContext(AdminDashBoardContext)
    useEffect(()=>{
         adminContextValues.handleChangeActiveLink(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    
    // Mock handlers for actions
    const handleAddEmployee = () => {
        console.log("hello")
        adminContextValues.setIsCreateEmpFormOpen(true)
    }
    const handleCreateTask = () => {
        console.log("hello")
        adminContextValues.setIsTaskFormOpen(true)
    }
    const handleCreateProject = () => {
        {
        console.log("hello")
        adminContextValues.setIsCreateProjectFormOpen(true)
    }
    }
    const handleReviewActivity = () => console.log('Navigating to Detailed Activity Log...');

// console.log("admin",adminContextValues.adminMetaData)
    return (
        <div className="admin-main-content">
            
            {/* 1. Header Section */}
            <header className="dashboard-header">
                <div>

                <h1 className="organization-name">
                    Welcome, {currentUser.orgnization||"**TaskFlow Management Admin**"}
                </h1>
            <p>{todayDate}</p>
                </div>
                <p className="dashboard-subtitle">
                    Overview and quick actions for your organization's tasks and personnel.
                </p>
            </header>

            {/* 2. Quick Action Section */}
            <section className="quick-actions-section">
                <h2>🚀 Quick Actions</h2>
                <div className="actions-grid">
                    <QuickActionButton 
                        icon={UserPlus} 
                        title="Add New Employee" 
                        onClick={handleAddEmployee} 
                    />
                    <QuickActionButton 
                        icon={ListPlus} 
                        title="Create New Task" 
                        onClick={handleCreateTask} 
                    />
                    <QuickActionButton 
                        icon={FolderPlus} 
                        title="Create New Project" 
                        onClick={handleCreateProject} 
                    />
                     <QuickActionButton 
                        icon={Activity} 
                        title="Review Activity Log" 
                        onClick={handleReviewActivity} 
                    />
                </div>
            </section>
            
            {/* 3. Summary Metrics Section */}
           {adminContextValues.adminMetaData && <section className="metrics-section">
                <h2>📈 Summary Metrics</h2>
                <div className="metrics-grid">
                    {summaryData.map(data => (
                        <SummaryCard key={data.title} {...data} metaData={adminContextValues.adminMetaData} navigateToAllTasks={navigateToAllTasks} />
                    ))}
                </div>
            </section>}

            {/* 4. Future Content Area (e.g., Charts, Recent Tasks) */}
            <section className="detailed-info-section">
                {/* Placeholder for charts, recent activity tables, or reports */}
                {/* This is where you would integrate components like <RecentTasksTable /> */}
            </section>
        </div>
    )
}

export default AdminDashBoardContent