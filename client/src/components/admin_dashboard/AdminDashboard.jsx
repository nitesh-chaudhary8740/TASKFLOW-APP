import React, { useContext, useEffect, useRef, useState } from "react";
import AdminNavBar from "./AdminNavBar";
import "../../assets/css/AdminDashboard.css";
import { Outlet } from "react-router-dom";
import { AdminDashBoardContext } from "../../contexts/AdminDashBoardContext.js";
import { CreateTaskForm } from "./dashboard-home-options/CreateTaskForm";
import { CreateEmployeeForm } from "./dashboard-home-options/CreateEmployeeForm.jsx";
import { CreateProjectForm } from "./dashboard-home-options/CreateProjectForm.jsx";
import axios from "axios";
import { LayoutDashboard, Users, ListChecks, FolderPlus } from 'lucide-react';
import { AssignEmployee } from "./dashboard-home-options/AssignEmployee.jsx";
import TaskDetails from "./dashboard-home-options/TaskDetails.jsx";
import { AntDContext } from "../../contexts/AntDContext.js";
import EmployeeDetails from "./dashboard-home-options/EmployeeDetails.jsx";
import { EmployeeAssignedTasks } from "./dashboard-home-options/EmployeeAssignedTasks.jsx";
import Prompt from "./dashboard-home-options/Prompt.jsx";

const navLinks = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/admin-dashboard', active: true },
    { name: 'Employees', icon: Users, href: '/admin-dashboard/employees', active: false },
    { name: 'All Tasks', icon: ListChecks, href: '/admin-dashboard/all-tasks', active: false },
    { name: 'Projects', icon: FolderPlus, href: '/admin-dashboard/projects', active: false },
];

function AdminDashboard() {
    const { showError, showSuccess } = useContext(AntDContext); // For AntD messages
    const [adminMetaData, setAdminmetaData] = useState(null);
    const [acticeNavLink, setActiveNavLink] = useState([...navLinks])
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
    const [isPromptOpen, setIsPromptOpen] = useState(false)
    const selectedEmployee = useRef(null);
    const selectedTask = useRef(null);
    const selectedTasks = useRef(null)
    const promptData = useRef({
        message: "",
        onConfirm: () => { },
        type: "",
        taskId: "",
        confirmText: ""
    })

    // --- Fetch Tasks ---
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
    }, [isTaskFormOpen, isAssignEmployeeFormOpen, isTaskDetailsFormOpen]);

    // --- Fetch Employees ---
    useEffect(() => {
        const fetchEmployees = async () => {
            setIsLoading(true);
            try {
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
    }, [showError, isCreateEmpFormOpen, isEmployeeDetailsFormOpen]);

    // --- Fetch Admin Metadata ---
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
    }, [tasks, allEmployees, acticeNavLink]);


    /**
 * @typedef {object} ConfigOptions
 * @property {string} msg - The main message to be displayed in the prompt.
 * @property {() => void} onConfirm - The function to execute when the confirmation button is clicked.
 * @property {'delete'|'unassign'|'warning'|'assign'} type - The type of prompt, used for styling and context.
 * @property {string} [confirmText='Okay'] - Optional: Text for the confirmation button.
 * @property {string} [cancelText='Cancel'] - Optional: Text for the cancel button.
 */

    /**
     * Configures and displays the generic confirmation prompt.
     * @param {ConfigOptions} configOptions - The configuration object.
     */
    const configPrompt = (configOptions) => {
        promptData.current = {
            // Set the message, type, and the function to run on confirm
            message: configOptions.msg,
            onConfirm: configOptions.onConfirm,
            type: configOptions.type,
            confirmText: configOptions.confirmText || 'Okay',
            cancelText: configOptions.cancelText || 'Cancel'
        }
        setIsPromptOpen(true)
    }

    const handleChangeActiveLink = (index) => {
        try {
            const tempNavLinks = [...acticeNavLink];
            tempNavLinks.forEach(link => link.active = false)
            tempNavLinks[index].active = true
            setActiveNavLink(tempNavLinks)
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * Executes the Unassign Task API call directly if confirmed, 
     * otherwise configures and shows the prompt.
     * @param {string} taskId 
     * @param {boolean} [skipPrompt=false]
     */
    const handleUnassignTask = async (taskId, skipPrompt = false) => {
        const task = tasks.find(t => t._id === taskId);
        const taskName = task?.name || 'this task';

        if (!skipPrompt) {
            // 1. If not skipping, configure the prompt with the execution function
            configPrompt({
                msg: `Are you sure you want to unassign the employee from the task: "${taskName}"?`,
                type: "warning",
                confirmText: 'Unassign',
                onConfirm: () => handleUnassignTask(taskId, true) // Pass true to skip the prompt next time
            });
            return;
        }

        // --- API Logic runs only if skipPrompt is true ---
        const originalTasks = tasks;

        // Optimistic Update
        const tempArr = tasks.map(t => {
            if (t._id === taskId) return { ...t, isAssigned: false, status: "Un-Assigned", assignedTo: null }
            else return t;
        })
        setTasks(tempArr);
        selectedTask.current = { ...selectedTask.current, isAssigned: false, assignedTo: null }

        try {
            const apiUrl = import.meta.env.VITE_API_URL;
            await axios.patch(`${apiUrl}/unassign-task/${taskId}`);
            showSuccess(<span>Task "<strong>{taskName}</strong> unassigned successfully!"</span>, 3);
            // Close TaskDetails view if it's open
            setIsTaskDetailsFormOpen(false);
        } catch (err) {
            console.error("Error unassigning task:", err.response?.data || err.message);
            setTasks(originalTasks); // Rollback
            const errMsg = err.response?.data?.message || "Failed to unassign task. Network error.";
            showError(errMsg, 5);
        }
    };

    /**
     * Executes the Delete Employee API call directly if confirmed, 
     * otherwise configures and shows the prompt.
     * @param {string} employeeId 
     * @param {boolean} [skipPrompt=false]
     */
    const handleDeleteEmployee = async (employeeId, skipPrompt = false) => {
        const employee = allEmployees.find(e => e._id === employeeId);
        const employeeName = employee?.fullName || 'this employee';

        if (!skipPrompt) {
            configPrompt({
                msg: `Are you sure you want to permanently DELETE the employee: ${employeeName}? This will unassign all their tasks.`,
                type: 'delete',
                confirmText: 'Delete Employee',
                onConfirm: () => handleDeleteEmployee(employeeId, true)
            });
            return;
        }

        // --- API Logic runs only if skipPrompt is true ---
        const originalEmpList = allEmployees;
        const tempArr = allEmployees.filter(emp => emp._id !== employeeId);
        setAllEmployees(tempArr);
        try {
            const apiUrl = import.meta.env.VITE_API_URL;
            await axios.delete(`${apiUrl}/delete-employee/${employeeId}`);
            showSuccess("Employee deleted successfully!", 3);
            setIsEmployeeDetailsFormOpen(false)
            // Note: Tasks list should also be refreshed or updated to reflect unassigned tasks
        } catch (err) {
            console.error("Error deleting employee:", err.response?.data || err.message);
            setAllEmployees(originalEmpList);
            const errMsg = err.response?.data || "Failed to delete employee. Network error.";
            showError(errMsg, 5); // Show a persistent error
        }
    };

    /**
     * Executes the Delete Task API call directly if confirmed, 
     * otherwise configures and shows the prompt.
     * @param {string} taskId 
     * @param {boolean} [skipPrompt=false]
     */
    const handleDeleteTask = async (taskId, skipPrompt = false) => {
        const task = tasks.find(t => t._id === taskId);
        const taskName = task?.name || 'this task';

        if (!skipPrompt) {
            // 1. If not skipping, configure the prompt with the execution function
            configPrompt({
                msg: `Are you sure you want to permanently DELETE the task: "${taskName}"? This action cannot be undone.`,
                type: 'delete',
                confirmText: 'Delete Task',
                onConfirm: () => handleDeleteTask(taskId, true) // Pass true to skip the prompt next time
            });
            return;
        }

        // --- API Logic runs only if skipPrompt is true ---
        // 1. Capture current state for rollback
        const originalTasks = tasks;

        // 2. Optimistic Update: Immediately filter out the task from the local state
        const tempArr = tasks.filter((t) => t._id !== taskId);
        setTasks(tempArr);

        try {
            // 3. API Call to Delete
            const apiUrl = import.meta.env.VITE_API_URL;
            await axios.delete(`${apiUrl}/delete-task/${taskId}`);

            // 4. Success: Confirmation message (UI is already updated)
            showSuccess(`Task "${taskName}" deleted successfully!`, 3);
            selectedTask.current = null;
            // Crucial: Close the Task Details modal after successful deletion
            setIsTaskDetailsFormOpen(false);
        } catch (err) {
            // 5. Failure: Rollback UI and show error message
            console.error("Error deleting task:", err.response?.data || err.message);
            setTasks(originalTasks);
            const errMsg = err.response?.data || "Failed to delete task. Network error.";
            showError(errMsg, 5);
        }
    };

    const handleBulkAssignTasks = async (tasksArr, emp,skipPrompt=false) => {
        
         if(!skipPrompt){
            configPrompt({
                msg:`Do you want to Assign ${tasksArr.length!==1?tasksArr.length+" tasks":tasksArr.length+" task"} to ${emp.fullName}?`,
                confirmText:`Assign(${tasksArr.length})`,
                cancelText:`Cancel`,
                type:"assign",
                onConfirm:()=>handleBulkAssignTasks(tasksArr,emp,true)
            })
            return;
        }
     
        try {
         const apiUrl = import.meta.env.VITE_API_URL;
         const response = await axios.patch(`${apiUrl}/bulk-assign-tasks/${emp._id}`,{selectedTasks:tasksArr});
        
         setTasks(response?.data?.tasks)
         showSuccess(`${response.data.msg}`, 3);
        setIsAssignEmployeeFormOpen(false)
           
        } catch (err) {
            // 5. Failure: Rollback UI and show error message
            console.error("Error in deleting tasks:", err.response?.data?.msg || err.message);
           
            const errMsg = err.response?.data.msg || "Failed to delete tasks. Network error.";
            showError(errMsg, 5);
        }
        finally{
            selectedTasks.current=null
        }
    }
    const handleBulkUnassignTasks = async (tasksArr,skipPrompt=false) => {
        console.log('bulk-unassign', tasksArr)
         if(!skipPrompt){
            configPrompt({
                msg:`Do you want to Unassign ${tasksArr.length!==1?tasksArr.length+" tasks":tasksArr.length+" task"} ?`,
                confirmText:`Unassign(${tasksArr.length})`,
                cancelText:`Cancel`,
                type:"assign",
                onConfirm:()=>handleBulkUnassignTasks(tasksArr,true)
            })
            return;
        }
     
        try {
         const apiUrl = import.meta.env.VITE_API_URL;
         const response = await axios.patch(`${apiUrl}/bulk-unassign-tasks/`,{selectedTasks:tasksArr});
        
        //  setTasks(response?.data?.tasks)
        //  showSuccess(`${response.data.msg}`, 3);
         showSuccess(`${response.data}`, 3);
        
           
        } catch (err) {
            // 5. Failure: Rollback UI and show error message
            console.error("Error in deleting tasks:", err.response?.data?.msg || err.message);
           
            const errMsg = err.response?.data.msg || "Failed to delete tasks. Network error.";
            showError(errMsg, 5);
        }
        finally{
            selectedTasks.current=null
        }
    }
    const handleBulkDeleteTasks = async (tasksArr,skipPrompt=false) => {
        if(!skipPrompt){
            configPrompt({
                msg:`Do you want to delete ${tasksArr.length!==1?tasksArr.length+" tasks":tasksArr.length+" task"} permanenetly?`,
                confirmText:`Delete(${tasksArr.length})`,
                cancelText:`Cancel`,
                type:"delete",
                onConfirm:()=>handleBulkDeleteTasks(tasksArr,true)
            })
            return;
        }
        console.log('bulk delete', tasksArr)
        
          try {
 
         const apiUrl = import.meta.env.VITE_API_URL;
         const response = await axios.delete(`${apiUrl}/bulk-delete-tasks`,{data:{selectedTasks:tasksArr}});
         setTasks(response.data.tasks)
         showSuccess(`Tasks deleted successfully!`, 3);
           
        } catch (err) {
            // 5. Failure: Rollback UI and show error message
            console.error("Error in deleting tasks:", err.response?.data?.msg || err.message);
           
            const errMsg = err.response?.data.msg || "Failed to delete tasks. Network error.";
            showError(errMsg, 5);
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
        handleDeleteEmployee,
        handleBulkAssignTasks,
        handleBulkUnassignTasks,
        handleBulkDeleteTasks,
        configPrompt,
        setIsPromptOpen,
        selectedTasks,
    };
    return (
        <div className={`admin-app-wrapper${isTaskFormOpen ? "modal" : ""}`}>
            <AdminDashBoardContext.Provider value={values}>
                <AdminNavBar />
                {isTaskFormOpen && <CreateTaskForm />}
                {isCreateEmpFormOpen && <CreateEmployeeForm />}
                {isCreateProjectFormOpen && <CreateProjectForm />}
                {isEmployeeTasksFormOpen && <EmployeeAssignedTasks />}
                {isAssignEmployeeFormOpen && <AssignEmployee />}
                {isTaskDetailsFormOpen && <TaskDetails />}
                {isEmployeeDetailsFormOpen && <EmployeeDetails />}
                {isPromptOpen && <Prompt promptData={promptData.current} />}
                <Outlet />
            </AdminDashBoardContext.Provider>
        </div>
    );
}

export default AdminDashboard;