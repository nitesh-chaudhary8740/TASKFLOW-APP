// App.jsx (The Root Router)
import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes, Outlet } from "react-router-dom";

// Imports (assumed correct from your list)
import TaskManageMentProvider from "./contexts/TaskManageMentProvider";
import SignIn from "./components/home_and_child_comp/SignIn";
import SignUp from "./components/home_and_child_comp/SignUp";
import Home from "./components/home_and_child_comp/Home"; // Assumed this wraps the non-admin pages
import AdminDashboard from "./components/admin_dashboard/AdminDashboard"; // The layout component

// Admin Children
import AdminDashBoardContent from "./components/admin_dashboard/AdminDashBoardContent";
import AdminAllTasksMenu from "./components/admin_dashboard/AdminAllTasksMenu";
import AdminEmployeesMenu from "./components/admin_dashboard/AdminEmployeesMenu";
import AdminProjectsMenu from "./components/admin_dashboard/AdminProjectsMenu";
// import {CreateTaskForm} from "./components/admin_dashboard/dashboard-home-options/CreateTaskForm";
import AntDContextProvider from "./contexts/AntDContextProvider";

import EmpDashboardContent from "./components/employee-dashboard/emp-menus/EmpDashboardContent";
import EmployeeMyTasks from "./components/employee-dashboard/emp-menus/EmployeeMyTasks";
// import EmployeeAssignedProjects from "./components/employee-dashboard/emp-menus/EmployeeAssignedProjects";
import PendingTasksTable from "./components/employee-dashboard/emp-menus/emp-dashboard-content-sub-comp/PendingTasksTable";
import OngoingTasksTable from "./components/employee-dashboard/emp-menus/emp-dashboard-content-sub-comp/OngoingTasksTable";
import EmployeeDetailsFull from "./components/admin_dashboard/dashboard-home-options/EmployeeDetailsFull";
import ProtectedDashboard from "./components/admin_dashboard/dashboard-home-options/ProtectedDashboard";
import ProtectedEmployeeDashboard from "./components/employee-dashboard/ProtectedEmployeeDashboard";
import TaskDetails from "./components/employee-dashboard/emp-menus/emp-mytasks/TaskDetails";
import MyReports from "./components/employee-dashboard/emp-menus/MyReports";
import ReportDetailsPage from "./components/employee-dashboard/emp-menus/my-reports/ReportDetailsPage";
import EmployeeProfile from "./components/employee-dashboard/EmployeeProfile";
import AdminReports from "./components/admin_dashboard/AdminReports";
import AdminReportView from "./components/admin_dashboard/reports-sub-comp/AdminReportView";
import AdminProfile from "./components/admin_dashboard/admin-nav-sub-com0/AdminProfile";


function App() {
  return (
    <>
      <Router>
        {/* AntD Context placed high up to cover all routes */}
        <AntDContextProvider>
          <TaskManageMentProvider>
            
            <Routes>
              {/* 1. Public/Auth Routes */}
              {/* NOTE: You should likely use a Layout component for / and wrap Home/SignIn/SignUp */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />

              {/* 2. Admin Dashboard Layout Route */}
              <Route path="/admin-dashboard" element={<ProtectedDashboard />}>
                
                <Route index element={<AdminDashBoardContent />} /> 
                
                <Route path="employees" element={<AdminEmployeesMenu />} />
                <Route path="employee-details" element={<EmployeeDetailsFull/>} />
                
                <Route path="all-tasks" element={<AdminAllTasksMenu />} />
                <Route path="reports" element={<AdminReports />} />
                <Route path="view-report/:reportId" element={<AdminReportView />} />
              </Route>
              <Route path="/admin-profile" element={<AdminProfile/>}/>
              {/* Employee Route */}
              <Route path="/employee-dashboard" element={<ProtectedEmployeeDashboard/>}>

                <Route path="/employee-dashboard" element={<EmpDashboardContent/>}>
                      <Route path="/employee-dashboard/pending-tasks" element={<PendingTasksTable/>}/>
                      <Route path="/employee-dashboard/on-going-tasks" element={<OngoingTasksTable/>}/>
                </Route>             
                <Route path="my-tasks" element={<EmployeeMyTasks/>}/>
                <Route path="task-details/:taskId" element={<TaskDetails/>}/>
                <Route path="report-details/:reportId" element={<ReportDetailsPage/>}/>
           
                <Route path="my-reports" element={<MyReports/>}/>           
              </Route>
                <Route path="/employee-profile" element={<EmployeeProfile/>}/>
            </Routes>
          </TaskManageMentProvider>
        </AntDContextProvider>
      </Router>
    </>
  );
}

export default App;