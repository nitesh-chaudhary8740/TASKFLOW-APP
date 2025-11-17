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
import {CreateTaskForm} from "./components/admin_dashboard/dashboard-home-options/CreateTaskForm";
import AntDContextProvider from "./contexts/AntDContextProvider";
import EmployeeDashboard from "./components/employee-dashboard/EmployeeDashboard";
import EmpDashboardContent from "./components/employee-dashboard/emp-menus/EmpDashboardContent";
import EmployeeMyTasks from "./components/employee-dashboard/emp-menus/EmployeeMyTasks";
import EmployeeAssignedProjects from "./components/employee-dashboard/emp-menus/EmployeeAssignedProjects";
import PendingTasksTable from "./components/employee-dashboard/emp-menus/emp-dashboard-content-sub-comp/PendingTasksTable";
import OngoingTasksTable from "./components/employee-dashboard/emp-menus/emp-dashboard-content-sub-comp/OngoingTasksTable";


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
              <Route path="/admin-dashboard" element={<AdminDashboard />}>
                
                <Route index element={<AdminDashBoardContent />} /> 
                
                <Route path="employees" element={<AdminEmployeesMenu />} />
                <Route path="all-tasks" element={<AdminAllTasksMenu />} />
                <Route path="projects" element={<AdminProjectsMenu />} />
              </Route>
              {/* Employee Route */}
              <Route path="/employee-dashboard" element={<EmployeeDashboard/>}>

                <Route path="/employee-dashboard" element={<EmpDashboardContent/>}>
                      <Route path="/employee-dashboard/pending-tasks" element={<PendingTasksTable/>}/>
                      <Route path="/employee-dashboard/on-going-tasks" element={<OngoingTasksTable/>}/>
                </Route>
                
                <Route path="my-tasks" element={<EmployeeMyTasks/>}/>
                <Route path="assigned-projects" element={<EmployeeAssignedProjects/>}/>
              
              </Route>
             
             
              
            </Routes>
          </TaskManageMentProvider>
        </AntDContextProvider>
      </Router>
    </>
  );
}

export default App;