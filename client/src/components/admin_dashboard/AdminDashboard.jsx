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
  const navLinks = [
      { name: 'Dashboard', icon: LayoutDashboard, href: '/admin-dashboard', active: true },
      { name: 'Employees', icon: Users, href: '/admin-dashboard/employees', active: false },
      { name: 'All Tasks', icon: ListChecks, href: '/admin-dashboard/all-tasks', active: false },
      { name: 'Projects', icon: FolderPlus, href: '/admin-dashboard/projects' , active: false},
    ];
    console.log(navLinks)
function AdminDashboard() {
  const [adminMetaData, setAdminmetaData] = useState(null);
    const [acticeNavLink,setActiveNavLink] =useState([...navLinks])
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [isCreateEmpFormOpen, setIsCreateEmpFormOpen] = useState(false);
  const [isCreateProjectFormOpen, setIsCreateProjectFormOpen] = useState(false);
  const [isAssignTaskFormOpen, setIsAssignTaskFormOpen] = useState(false);
  const selectedEmployee = useRef(null);
  useEffect(() => {
    const fetchAdminMetaData = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        const response = await axios.get(`${apiUrl}/metadata`);
        console.log(response.data);
        setAdminmetaData(response.data);
      } catch (error) {
        alert(error.response.data);
      }
    };
    fetchAdminMetaData();
  }, [isAssignTaskFormOpen,isCreateEmpFormOpen]);

 const handleChangeActiveLink = (index) =>{
   try {
     const tempNavLinks = [...acticeNavLink];
     tempNavLinks.map(link=>link.active=false)
      tempNavLinks[index].active=true
      setActiveNavLink(tempNavLinks)
      console.log("afterchange",tempNavLinks)

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
     handleChangeActiveLink
  };
  return (
    <div className={`admin-app-wrapper${isTaskFormOpen ? "modal" : ""}`}>
      <AdminDashBoardContext.Provider value={values}>
      <AdminNavBar />
        {isTaskFormOpen && <CreateTaskForm />}
        {isCreateEmpFormOpen && <CreateEmployeeForm />}
        {isCreateProjectFormOpen && <CreateProjectForm />}
        {isAssignTaskFormOpen && <AssignTask />}
        <Outlet />
      </AdminDashBoardContext.Provider>
    </div>
  );
}

export default AdminDashboard;
