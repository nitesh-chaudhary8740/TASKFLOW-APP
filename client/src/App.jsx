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
                {/* Nested Routes render INSIDE the <Outlet /> of AdminDashboard */}
                
                {/* Index Route (Default content for /admin-dashboard) */}
                <Route index element={<AdminDashBoardContent />} /> 
                
                <Route path="employees" element={<AdminEmployeesMenu />} />
                <Route path="all-tasks" element={<AdminAllTasksMenu />} />
                <Route path="projects" element={<AdminProjectsMenu />} />
              </Route>
              
              {/* Standalone Route (If not intended to be inside AdminDashboard layout) */}
             
              
            </Routes>
          </TaskManageMentProvider>
        </AntDContextProvider>
      </Router>
    </>
  );
}

export default App;