import React, { useContext, useEffect, useRef, useState } from "react";
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
import { AntDContext } from "../../contexts/AntDContext.js";
import EmployeeDetails from "./dashboard-home-options/EmployeeDetails.jsx";
import { EmployeeAssignedTasks } from "./dashboard-home-options/EmployeeAssignedTasks.jsx";
  const navLinks = [
      { name: 'Dashboard', icon: LayoutDashboard, href: '/admin-dashboard', active: true },
      { name: 'Employees', icon: Users, href: '/admin-dashboard/employees', active: false },
      { name: 'All Tasks', icon: ListChecks, href: '/admin-dashboard/all-tasks', active: false },
      { name: 'Projects', icon: FolderPlus, href: '/admin-dashboard/projects' , active: false},
    ];
function AdminDashboard() {
  const {  showError,showSuccess } = useContext(AntDContext); // For AntD messages
  const [adminMetaData, setAdminmetaData] = useState(null);
    const [acticeNavLink,setActiveNavLink] =useState([...navLinks])
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [isCreateEmpFormOpen, setIsCreateEmpFormOpen] = useState(false);
  const [isCreateProjectFormOpen, setIsCreateProjectFormOpen] = useState(false);
  const [isEmployeeTasksFormOpen, setIsEmployeeTasksFormOpen] = useState(false);
  const [isAssignEmployeeFormOpen, setIsAssignEmployeeFormOpen] = useState(false);
  const [isTaskDetailsFormOpen, setIsTaskDetailsFormOpen] = useState(false);
  const [isEmployeeDetailsFormOpen, setIsEmployeeDetailsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [allEmployees, setAllEmployees] = useState([]);
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
  }, [isTaskFormOpen,isAssignEmployeeFormOpen,isTaskDetailsFormOpen]);
     useEffect(() => {
          const fetchEmployees = async () => {
              setIsLoading(true);
              try {
                  // Adjust API endpoint to fetch Employees
                  const response = await axios.get(`${import.meta.env.VITE_API_URL}/employees`); 
                  const fetchedEmployees = response.data;
                  setAllEmployees(fetchedEmployees);
                  setError(null);
              } catch (err) {
                  console.error("Error fetching employees:", err);
                  showError("Failed to load employee list.", 3);
                  setError("Failed to load employees.");
              } finally {
                  setIsLoading(false);
              }
          };
          fetchEmployees();
      }, [showError,isCreateEmpFormOpen,isEmployeeDetailsFormOpen]);
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
  }, [tasks,allEmployees,acticeNavLink]);

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
  const handleUnassignTask = async (taskId) => {
    // 1. Capture current state for rollback
    const originalTasks = tasks;

    // 2. Optimistic Update: Immediately filter out the task from the local state
    const tempArr = tasks.map(task=>{
      if(task._id===taskId) return {...task,
        isAssigned:false,
        status:"Un-Assigned",
        assignedTo:null
      }
      else return task;
    })
    setTasks(tempArr);
    selectedTask.current={...selectedTask.current,isAssigned:false,assignedTo:null}
    try {
      // 3. API Call to Delete
      const apiUrl = import.meta.env.VITE_API_URL;
      await axios.patch(`${apiUrl}/unassign-task/${taskId}`);

      // 4. Success: Confirmation message (UI is already updated)
      showSuccess("Task unassigned successfully!", 3);
    } catch (err) {
      // 5. Failure: Rollback UI and show error message
      console.error("Error unassigning task:", err.response?.data || err.message);

      // Revert state back to original tasks list
      setTasks(originalTasks);

      const errMsg =
      err.response?.data?.message || "Failed to delete task. Network error.";
      showError(errMsg, 5);
    }
  };
  const handleDeleteEmployee = async (employeeId) => {
          const originalEmpList = allEmployees;  
          const tempArr = allEmployees.filter(emp => emp._id !== employeeId);
          setAllEmployees(tempArr);
          try {
              const apiUrl = import.meta.env.VITE_API_URL;
              await axios.delete(`${apiUrl}/delete-employee/${employeeId}`);
              showSuccess("Employee deleted successfully!", 3); 
              setIsEmployeeDetailsFormOpen(false)         
          } catch (err) {
  
              console.error("Error deleting task:", err.response?.data || err.message);
              setAllEmployees(originalEmpList); 
              const errMsg = err.response?.data|| "Failed to delete employee. Network error.";
              showError(errMsg, 5); // Show a persistent error
          }
    };
   const handleDeleteTask = async (taskId) => {
    // 1. Capture current state for rollback
    const originalTasks = tasks;

    // 2. Optimistic Update: Immediately filter out the task from the local state
    const tempArr = tasks.filter((task) => task._id !== taskId);
    setTasks(tempArr);

    try {
      // 3. API Call to Delete
      const apiUrl = import.meta.env.VITE_API_URL;
      await axios.delete(`${apiUrl}/delete-task/${taskId}`);

      // 4. Success: Confirmation message (UI is already updated)
      showSuccess("Task deleted successfully!", 3);
      selectedTask.current=null;
      
    } catch (err) {
      // 5. Failure: Rollback UI and show error message
      console.error("Error deleting task:", err.response?.data || err.message);

      // Revert state back to original tasks list
      setTasks(originalTasks);

      const errMsg =
      err.response?.data|| "Failed to delete task. Network error.";
      showError(errMsg, 5);
    }
  };
  const values = {
    selectedEmployee,
    isTaskFormOpen,
    adminMetaData,
    setIsTaskFormOpen,
    isCreateEmpFormOpen,
    setIsCreateEmpFormOpen,
    isCreateProjectFormOpen,
    setIsCreateProjectFormOpen,
    isEmployeeTasksFormOpen, setIsEmployeeTasksFormOpen,
    acticeNavLink,//nav links
    setActiveNavLink,
    navLinks,
    handleChangeActiveLink,
    setIsAssignEmployeeFormOpen,
    selectedTask,
    isTaskDetailsFormOpen,//task detail modal overlay togglee
    setIsTaskDetailsFormOpen,
    isEmployeeDetailsFormOpen, setIsEmployeeDetailsFormOpen,
    tasks,//all tasks
    isLoading,//api loading
    error,//api error
    setTasks,
    setIsLoading,
    setError,
    allEmployees,//all employees
    setAllEmployees,
    handleDeleteTask,
     handleUnassignTask,
     handleDeleteEmployee
  };
  return (
    <div className={`admin-app-wrapper${isTaskFormOpen ? "modal" : ""}`}>
      <AdminDashBoardContext.Provider value={values}>
      <AdminNavBar />
        {isTaskFormOpen && <CreateTaskForm />}
        {isCreateEmpFormOpen && <CreateEmployeeForm />}
        {isCreateProjectFormOpen && <CreateProjectForm />}
        {isEmployeeTasksFormOpen && <EmployeeAssignedTasks />}
        {isAssignEmployeeFormOpen &&<AssignEmployee/>}
        {isTaskDetailsFormOpen &&<TaskDetails/>}
        {isEmployeeDetailsFormOpen&&<EmployeeDetails/>}
        <Outlet />
      </AdminDashBoardContext.Provider>
    </div>
  );
}

export default AdminDashboard;
