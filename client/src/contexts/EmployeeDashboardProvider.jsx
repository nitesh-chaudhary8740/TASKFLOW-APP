import React from "react";
import { EmployeeDashboardContext } from "./EmployeeDashboardContext";
import { useState } from "react";
import { LayoutDashboard, ListChecks, FolderPlus, FileText } from "lucide-react";
import { useEffect } from "react";
import axios from "axios";
import { useRef } from "react";
import { useContext } from "react";
import { AntDContext } from "./AntDContext";
import { TASK_MANAGEMENT_HOME } from "./TaskManageMent.context";
import EmployeeNavbar from "../components/employee-dashboard/EmployeeNavbar";
import ReportSubmissionModal from "../components/employee-dashboard/emp-menus/emp-mytasks/ReportSubmissionModal";
import { Outlet } from "react-router-dom";

const empNavLinks = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    href: "/employee-dashboard",
    active: true,
  },
  { name: "My Tasks", icon: ListChecks, href: "my-tasks", active: false },
  {
    name: "My Reports",
    icon: FileText,
    href: "my-reports",
    active: false,
  },
];
const loggeduser = JSON.parse(localStorage.getItem("currentUser"));
function EmployeeDashboardProvider() {
  const { configPrompt } = useContext(TASK_MANAGEMENT_HOME);
  const { showError, showSuccess } = useContext(AntDContext);

  const [activeEmpNavLinks, setActieEmpNavLinks] = useState([...empNavLinks]);
  const [employeeAllTasks, setEmployeeAllTasks] = useState([]);
  const [employeeReports,setEmployeeReports] = useState([])
  const [refetch, setRefetch] = useState(false);
  const [isReportFormOpen, setIsReportFormOpen] = useState(false);
  const selectedTask = useRef(null);
  const user = useRef(loggeduser);

  const EMP_API = import.meta.env.VITE_EMP_API_URL;
  useEffect(() => {
    const fetchEmpTasks = async () => {
      try {
        const response = await axios.get(
          `${EMP_API}/employee-tasks/${user.current._id}`
        );

        setEmployeeAllTasks(response.data.empTasks);
      } catch (error) {
        if (error?.response?.data) showError(error.response.data);
        else showError("error is fetching tasks");
      }
    };
    const fetchEmpReports = async () => {
      try {
        const response = await axios.get(
          `${EMP_API}/fetch-employee-reports/${user.current._id}`
        );

        setEmployeeReports(response.data.reports);
      } catch (error) {
        if (error?.response?.data?.msg) showError(error.response.data.msg);
        else showError("error is fetching reportss");
      }
    };
    
    fetchEmpTasks();
    fetchEmpReports()
  }, [showError, EMP_API, refetch]);
  const triggerRefetch = () => {
    setRefetch((prev) => !prev);
  };
  const handleChangeActiveLink = (index) => {
    try {
      const tempNavLinks = [...activeEmpNavLinks];
      tempNavLinks.forEach((link) => (link.active = false));
      tempNavLinks[index].active = true;
      setActieEmpNavLinks(tempNavLinks);
    } catch (error) {
      console.log(error);
    }
  };
  const startWorkOnTask = async (taskId, skipPrompt = false) => {
    if (!skipPrompt) {
      configPrompt({
        msg: "Are you sure want to start this task now?",
        confirmText: "Start task",
        cancelText: "Not yet",
        type: "assign",
        onConfirm: () => startWorkOnTask(taskId, true),
      });
      return;
    }
    try {
      const response = await axios.put(`${EMP_API}/start-working/${taskId}`);
      showSuccess(response.data.msg, 3);
      triggerRefetch();
    } catch (error) {
      showError(error.response.data.msg, 3);
    }
  };
  const stopWorkOnTask = async (taskId, skipPrompt = false) => {
    if (!skipPrompt) {
      configPrompt({
        msg: "Are you sure want to stop this task now?",
        confirmText: "Stop task",
        cancelText: "Cancel",
        type: "delete",
        onConfirm: () => stopWorkOnTask(taskId, true),
      });
      return;
    }
    try {
      const response = await axios.put(`${EMP_API}/stop-working/${taskId}`);
      showSuccess(response.data.msg, 3);
      triggerRefetch();
    } catch (error) {
      showError(error.response.data.msg, 3);
    }
  };
  const submitReport = async (reportData, skipPrompt = false) => {
  return new Promise((resolve,reject)=>{
  const performSubmisson = async ()=>{
  try {
  
      const response = await axios.post(`${EMP_API}/submit-report`,reportData);
      showSuccess(response.data.msg, 3)
      resolve(true)
      triggerRefetch();
    } catch (error) {
      showError(error.response.data.msg, 3);
      reject(false)
    }
    }
     if (!skipPrompt) {
      configPrompt({
        msg: "Are you sure want to submit this report now?",
        confirmText: "Submit report",
        cancelText: "Cancel",
        type: "success",
        onConfirm:  performSubmisson,
        onCancel: ()=> resolve(false)
      });
     
    }
    })
 
  
  };

  const returnFetchedTaskById = async (taskId) => {
    try {
      const response = await axios.get(`${EMP_API}/fetch-task/${taskId}`);
      if (response.data.task) return response.data.task;
      else throw new Error("task not found");
    } catch (error) {
      showError(error);
      showError(error?.response?.data?.msg | "error in fetching task by id");
    }
  };
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

  const values = {
    activeEmpNavLinks,
    employeeAllTasks,
    employeeReports,
    user,
    selectedTask,
    triggerRefetch,
    handleChangeActiveLink,
    startWorkOnTask,
    stopWorkOnTask,
    returnFetchedTaskById,
    returnFetchedReportById,
    isReportFormOpen,
    setIsReportFormOpen,
    submitReport,
   
  };
  return (
    <EmployeeDashboardContext.Provider value={values}>
      <EmployeeNavbar />
      {isReportFormOpen && <ReportSubmissionModal />}
      <Outlet />
    </EmployeeDashboardContext.Provider>
  );
}

export default EmployeeDashboardProvider;
