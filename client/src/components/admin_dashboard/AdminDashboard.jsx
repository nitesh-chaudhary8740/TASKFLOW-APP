import React, { useContext, useEffect, useRef, useState } from "react";
import AdminNavBar from "./AdminNavBar";
import "../../assets/css/AdminDashboard.css";
import { Outlet } from "react-router-dom";
import { AdminDashBoardContext } from "../../contexts/AdminDashBoardContext.js";
import { CreateTaskForm } from "./dashboard-home-options/CreateTaskForm";
import { CreateEmployeeForm } from "./dashboard-home-options/CreateEmployeeForm.jsx";
import { CreateProjectForm } from "./dashboard-home-options/CreateProjectForm.jsx";
import axios from "axios";
import { LayoutDashboard, Users, ListChecks, FolderPlus, FileText } from 'lucide-react';
import { AssignEmployee } from "./dashboard-home-options/AssignEmployee.jsx";
import TaskDetails from "./dashboard-home-options/TaskDetails.jsx";
import { AntDContext } from "../../contexts/AntDContext.js";
import EmployeeDetails from "./dashboard-home-options/EmployeeDetails.jsx";
import { EmployeeAssignedTasks } from "./dashboard-home-options/EmployeeAssignedTasks.jsx";
import Prompt from "./dashboard-home-options/Prompt.jsx";
import { TASK_MANAGEMENT_HOME } from "../../contexts/TaskManageMent.context.js";
import ActivityLogModal from "./dashboard-home-options/ActivityLogModal.jsx";


const navLinks = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/admin-dashboard', active: true },
    { name: 'Employees', icon: Users, href: '/admin-dashboard/employees', active: false },
    { name: 'All Tasks', icon: ListChecks, href: '/admin-dashboard/all-tasks', active: false },
    { name: 'Reports', icon: FileText, href: '/admin-dashboard/reports', active: false },
];

function AdminDashboard() {
    const { showError, showSuccess } = useContext(AntDContext); // For AntD messages
    const {configPrompt,currentUser} = useContext(TASK_MANAGEMENT_HOME)
    const [refetch,setRefetch]=useState(false)
    const [adminMetaData, setAdminmetaData] = useState(null);
    const [acticeNavLink, setActiveNavLink] = useState([...navLinks])
    const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
    const [isActivityLogOpen, setIsActivityLogOpen] = useState(false);
    const [isCreateEmpFormOpen, setIsCreateEmpFormOpen] = useState(false);
    const [isCreateProjectFormOpen, setIsCreateProjectFormOpen] = useState(false);
    const [isEmployeeTasksFormOpen, setIsEmployeeTasksFormOpen] = useState(false);
    const [isAssignEmployeeFormOpen, setIsAssignEmployeeFormOpen] = useState(false);
    const [isTaskDetailsFormOpen, setIsTaskDetailsFormOpen] = useState(false);
    const [isEmployeeDetailsFormOpen, setIsEmployeeDetailsFormOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [activities,setActivities]=useState([])
    const [error, setError] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [reports, setReports] = useState([]);
    const [allEmployees, setAllEmployees] = useState([]);
    // const [isPromptOpen, setIsPromptOpen] = useState(false)
    const selectedEmployee = useRef(null);
    const selectedTask = useRef(null);
    const selectedTasks = useRef(null)
    const EMP_API = import.meta.env.VITE_EMP_API_URL;
    // const promptData = useRef({
    //     message: "",
    //     onConfirm: () => { },
    //     type: "",
    //     taskId: "",
    //     confirmText: ""
    // })
    const triggerRefetch = ()=>setRefetch(prev=>!prev)
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

                const response = await axios.get(`${apiUrl}/tasks`,{withCredentials:true});
                setTasks(response.data.tasks);
                setError(null);
            } catch (err) {
                console.error("Error fetching tasks:", err);
                // const errMsg = err.response
                //     ? err.response.data.message || "Network Error"
                //     : err.message;
                   
                // setError(errMsg);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTasks();
    }, [refetch]);

    // --- Fetch Employees ---
    useEffect(() => {
        const fetchEmployees = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/employees`,{withCredentials:true});
                const fetchedEmployees = response.data;
                setAllEmployees(fetchedEmployees);
                setError(null);
            } catch (err) {
                console.error("Error fetching employees:", err);
                // showError("Failed to load employee list.", 3);
                setError("Failed to load employees.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchEmployees();
    }, [showError,refetch]);
    // --- Fetch Reports ---
    useEffect(() => {
        const fetchReports = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/reports`,{withCredentials:true});
                const fetchedReports = response.data.reports;
                setReports(fetchedReports);
                setError(null);
            } catch (err) {
                console.error("Error fetching reports:", err);
                // showError("Failed to reports.", 3);
                setError("Failed to reports.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchReports();
    }, [showError,refetch]);

    // --- Fetch Admin Metadata ---
    useEffect(() => {
        const fetchAdminMetaData = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL;
                const response = await axios.get(`${apiUrl}/metadata`,{withCredentials:true});
                setAdminmetaData(response.data);
            } catch (error) {
                showError("metadata")
                showError(error.response.data.msg);
            }
        };
        fetchAdminMetaData();
    }, [showError,refetch]);
    useEffect(() => {
        const fetchActivities = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/get-activities`, { withCredentials: true });
            setActivities(response.data);
        } catch (error) {
            console.error("Error fetching activities", error);
        } 
    };
    fetchActivities()
    }, [showError,refetch]);


  /**
 * Sends activity data to the backend to log a new system event.
 * * @async
 * @function createActivity
 * @param {Object} options - The activity configuration object.
 * @param {('Admin'|'Employee')} options.performerType - The collection type of the user performing the action.
 * @param {string} options.performerId - The MongoDB ObjectId of the Admin or Employee.
 * @param {string} options.action - A constant representing the action (e.g., 'TASK_ASSIGNED', 'WORK_STARTED').
 * @param {('Task'|'Report'|'Admin'|'Employee')} options.targetType - The collection type of the object being acted upon.
 * @param {string} options.targetId - The MongoDB ObjectId of the target (Task, Report, etc.).
 * @param {string} options.description - A human-readable summary of the event (e.g., "John Doe submitted a report").
 * @param {Object} [options.metadata] - Optional additional data (e.g., { oldStatus: 'Pending', newStatus: 'Accepted' }).
 * @returns {Promise<void>}
 */
const createActivity = async (options) => {
    try {
        const apiUrl = import.meta.env.VITE_API_URL;
        await axios.post(`${apiUrl}/create-activity`, options, { withCredentials: true });
    } catch (error) {
        // Log the specific error message from the server if available
        console.error("Activity Logging Error:", error.response?.data?.msg || error.message);
    }
};

    /**
     * Configures and displays the generic confirmation prompt.
     * @param {ConfigOptions} configOptions - The configuration object.
     */
    // const configPrompt = (configOptions) => {
    //     promptData.current = {
    //         // Set the message, type, and the function to run on confirm
    //         message: configOptions.msg,
    //         onConfirm: configOptions.onConfirm,
    //         type: configOptions.type,
    //         confirmText: configOptions.confirmText || 'Okay',
    //         cancelText: configOptions.cancelText || 'Cancel'
    //     }
    //     setIsPromptOpen(true)
    // }

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
            await axios.patch(`${apiUrl}/unassign-task/${taskId}`,{},{withCredentials:true});
            showSuccess(<span>Task "<strong>{taskName}</strong> unassigned successfully!"</span>, 3);
            // Close TaskDetails view if it's open
            setIsTaskDetailsFormOpen(false);
        } catch (err) {
            console.error("Error unassigning task:", err.response?.data || err.message);
            setTasks(originalTasks); // Rollback
            const errMsg = err.response?.data || "Failed to unassign task. Network error.";
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
            await axios.delete(`${apiUrl}/delete-employee/${employeeId}`,{withCredentials:true});
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
            await axios.delete(`${apiUrl}/delete-task/${taskId}`,{withCredentials:true});

            // 4. Success: Confirmation message (UI is already updated)
           await createActivity({
            performerType:"Admin",
            performerId:currentUser._id,
            action:"TASK_DELETED",
            targetType:"Task",
            targetId:taskId,
            description:`${task.id} task is deleted by ${currentUser.name}`

        })
            showSuccess(`Task "${taskName}" deleted successfully!`, 3);
            selectedTask.current = null;
            // Crucial: Close the Task Details modal after successful deletion
            setIsTaskDetailsFormOpen(false);
            triggerRefetch()
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
         const response = await axios.patch(`${apiUrl}/bulk-assign-tasks/${emp._id}`,{selectedTasks:tasksArr},{withCredentials:true});
        
         setTasks(response?.data?.tasks)
         showSuccess(`${response.data.msg}`, 3);
        setIsAssignEmployeeFormOpen(false)
        triggerRefetch()
           
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
         const response = await axios.patch(`${apiUrl}/bulk-unassign-tasks/`,{selectedTasks:tasksArr},{withCredentials:true});
        
        //  setTasks(response?.data?.tasks)
        //  showSuccess(`${response.data.msg}`, 3);
         showSuccess(`${response.data.msg}`, 3);
        triggerRefetch()
           
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
         const response = await axios.delete(`${apiUrl}/bulk-delete-tasks`,{data:{selectedTasks:tasksArr},withCredentials:true});
         setTasks(response.data.tasks)
         showSuccess(`Tasks deleted successfully!`, 3);
           triggerRefetch()
        } catch (err) {
            // 5. Failure: Rollback UI and show error message
            console.error("Error in deleting tasks:", err.response?.data?.msg || err.message);
           
            const errMsg = err.response?.data.msg || "Failed to delete tasks. Network error.";
            showError(errMsg, 5);
        }
    }
    const returnFetchedReportById = async (reportId) => {
    try {
      const response = await axios.get(`${EMP_API}/fetch-report/${reportId}`);
      console.log("report",response.data)
      if (response.data.report) return response.data.report;
      else throw new Error("report not found");
    } catch (error) {
      showError(error);
      showError(error?.response?.data?.msg | "error in fetching report by id");
    }
  };
  const approveReport = async(reportId,skipPrompt=false)=>{
  return new Promise((resolve, reject) => {
    
   const performApproval = async(reportId)=>{
 
        try {
         const apiUrl = import.meta.env.VITE_API_URL;
         const response = await axios.put(`${apiUrl}/approve-report/`,{reportId:reportId},{withCredentials:true});
         showSuccess(`${response.data.msg}`, 3);
         resolve(true)
           
        } catch (err) {
            // 5. Failure: Rollback UI and show error message
            console.error("Error in approving report:", err.response?.data?.msg || err.message);
            const errMsg = err.response?.data.msg || "Failed to approve report. Network error.";
            reject(false)
            showError(errMsg, 5);

        }
   }
        if(!skipPrompt){
            configPrompt({
                msg:`Do you want to approve this report} ?`,
                confirmText:`Approve`,
                cancelText:`Cancel`,
                type:"success",
                onConfirm:()=>performApproval(reportId,true),
                onCancel:()=>resolve(false)
            })
            
        }
  })
       
  }
  const rejectReport = (reportId, skipPrompt = false) => {
    return new Promise((resolve) => {
        const performRejection = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL;
                const response = await axios.put(
                    `${apiUrl}/reject-report/`,
                    { reportId },
                    { withCredentials: true }
                );
                showSuccess(`${response.data.msg}`, 3);
                resolve(true);
            } catch (err) {
                const errMsg = err.response?.data.msg || "Failed to reject report.";
                showError(errMsg, 5);
                resolve(false);
            }
        };

        if (!skipPrompt) {
            configPrompt({
                msg: "Are you sure you want to reject this report?",
                confirmText: "Reject",
                cancelText: "Cancel",
                type: "delete", // Red/Warning style
                onConfirm: performRejection,
                onCancel: () => resolve(false)
            });
        } else {
            performRejection();
        }
    });
};
 const undoReport = (reportId, skipPrompt = false) => {
    return new Promise((resolve) => {
        const performUndo = async () => {
            try {
                const apiUrl = import.meta.env.VITE_API_URL;
                const response = await axios.put(
                    `${apiUrl}/undo-report/`,
                    { reportId },
                    { withCredentials: true }
                );
                showSuccess(`${response.data.msg}`, 3);
                resolve(true);
            } catch (err) {
                const errMsg = err.response?.data.msg || "Failed to undo report status.";
                showError(errMsg, 5);
                resolve(false);
            }
        };

        if (!skipPrompt) {
            configPrompt({
                msg: "Do you want to reset this report back to 'Submitted' status?",
                confirmText: "Undo Status",
                cancelText: "Cancel",
                type: "warning",
                onConfirm: performUndo,
                onCancel: () => resolve(false)
            });
        } else {
            performUndo();
        }
    });
};

    const values = {
        EMP_API,
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
        isEmployeeDetailsFormOpen,
        setIsEmployeeDetailsFormOpen,
        tasks,//all tasks
        reports,
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
        returnFetchedReportById,
        selectedTasks,
        triggerRefetch,
        approveReport,
        rejectReport,
        undoReport,
        createActivity,
        activities,
        isActivityLogOpen, 
        setIsActivityLogOpen
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
                {isActivityLogOpen && <ActivityLogModal/>}
                {/* {isPromptOpen && <Prompt promptData={promptData.current} />}
                */}
                 <Outlet />
            </AdminDashBoardContext.Provider>
        </div>
    );
}

export default AdminDashboard;