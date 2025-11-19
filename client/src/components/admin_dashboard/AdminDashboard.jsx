import React, { useEffect, useRef, useState } from "react";
import AdminNavBar from "./AdminNavBar";
import "../../assets/css/AdminDashboard.css";
import { Outlet } from "react-router-dom";
import { AdminDashBoardContext } from "../../contexts/AdminDashBoardContext.js";
import { CreateTaskForm } from "./dashboard-home-options/CreateTaskForm";
import { CreateEmployeeForm } from "./dashboard-home-options/CreateEmployeeForm.jsx";
import { CreateProjectForm } from "./dashboard-home-options/CreateProjectForm.jsx";
import axios from "axios";
import { LayoutDashboard, Users,  ListChecks,FolderPlus  } from 'lucide-react';
import { AssignTask } from "./dashboard-home-options/AssignTask.jsx";
import { AssignEmployee } from "./dashboard-home-options/AssignEmployee.jsx";
import TaskDetails from "./dashboard-home-options/TaskDetails.jsx";
  const navLinks = [
      { name: 'Dashboard', icon: LayoutDashboard, href: '/admin-dashboard', active: true },
      { name: 'Employees', icon: Users, href: '/admin-dashboard/employees', active: false },
      { name: 'All Tasks', icon: ListChecks, href: '/admin-dashboard/all-tasks', active: false },
      { name: 'Projects', icon: FolderPlus, href: '/admin-dashboard/projects' , active: false},
    ];
function AdminDashboard() {
  const [adminMetaData, setAdminmetaData] = useState(null);
    const [acticeNavLink,setActiveNavLink] =useState([...navLinks])
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [isCreateEmpFormOpen, setIsCreateEmpFormOpen] = useState(false);
  const [isCreateProjectFormOpen, setIsCreateProjectFormOpen] = useState(false);
  const [isAssignTaskFormOpen, setIsAssignTaskFormOpen] = useState(false);
  const [isAssignEmployeeFormOpen, setIsAssignEmployeeFormOpen] = useState(false);
  const [isTaskDetailsFormOpen, setIsTaskDetailsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tasks, setTasks] = useState([]);
  const selectedEmployee = useRef(null);
  const selectedTask = useRef(null);
   // --- Fetch Tasks (Initial Load) ---
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        if (!apiUrl) {
          throw new Error(
            "VITE_API_URL is not defined in environment variables."
          );
        }

        const response = await axios.get(`${apiUrl}/tasks`);
        setTasks(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching tasks:", err);
        const errMsg = err.response
          ? err.response.data.message || "Network Error"
          : err.message;
        setError(errMsg);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTasks();
  }, [isTaskFormOpen,isAssignEmployeeFormOpen]);
  useEffect(() => {
    const fetchAdminMetaData = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await axios.get(`${apiUrl}/metadata`);
        setAdminmetaData(response.data);
      } catch (error) {
        alert(error.response.data);
      }
    };
    fetchAdminMetaData();
  }, [isAssignTaskFormOpen,isCreateEmpFormOpen,isTaskFormOpen]);

 const handleChangeActiveLink = (index) =>{
   try {
     const tempNavLinks = [...acticeNavLink];
     tempNavLinks.forEach(link=>link.active=false)
      tempNavLinks[index].active=true
      setActiveNavLink(tempNavLinks)
   } catch (error) {
    console.log(error)
   }
  }

  const values = {
    selectedEmployee,
    isTaskFormOpen,
    adminMetaData,
    setIsTaskFormOpen,
    isCreateEmpFormOpen,
    setIsCreateEmpFormOpen,
    isCreateProjectFormOpen,
    setIsCreateProjectFormOpen,
    isAssignTaskFormOpen,
     setIsAssignTaskFormOpen,
     acticeNavLink,//nav links
     setActiveNavLink,
     navLinks,
     handleChangeActiveLink,
     setIsAssignEmployeeFormOpen,
     selectedTask,
     isTaskDetailsFormOpen,//task detail modal overlay togglee
     setIsTaskDetailsFormOpen,
     tasks,
     isLoading,
     error,
     setTasks,
     setIsLoading,
     setError,
     
  };
  return (
    <div className={`admin-app-wrapper${isTaskFormOpen ? "modal" : ""}`}>
      <AdminDashBoardContext.Provider value={values}>
      <AdminNavBar />
        {isTaskFormOpen && <CreateTaskForm />}
        {isCreateEmpFormOpen && <CreateEmployeeForm />}
        {isCreateProjectFormOpen && <CreateProjectForm />}
        {isAssignTaskFormOpen && <AssignTask />}
        {isAssignEmployeeFormOpen &&<AssignEmployee/>}
        {isTaskDetailsFormOpen &&<TaskDetails/>}
        <Outlet />
      </AdminDashBoardContext.Provider>
    </div>
  );
}

export default AdminDashboard;
