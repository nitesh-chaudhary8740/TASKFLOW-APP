import React from 'react'
import  { Link, Outlet } from "react-router-dom"
function DashboardTasks() {
  return (
    <div className="content-box task-table-container">
      <div className="dashboard-tasks-options-btns">
        <Link to={"/employee-dashboard/on-going-tasks"}>In Progress</Link>
        <Link>Due Today</Link>
        <Link>Due in week</Link>
      </div>
      <div className="dashboard-tasks-tables-container">
        <Outlet/>
      </div>
    </div>
  )
}

export default DashboardTasks
