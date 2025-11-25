import { createContext } from "react";

export const AdminDashBoardContext = createContext({
  isTaskFormOpen: false,
  setIsTaskFormOpen: () => {},
  isCreateEmpFormOpen: false,
  setIsCreateEmpFormOpen: () => {},
  isCreateProjectFormOpen: false,
  setIsCreateProjectFormOpen: () => {},
  adminMetaData: null,
  isEmployeeTasksFormOpen: false,
  setIsEmployeeTasksFormOpen: () => {},
  selectedEmployee: null,
  selectedTask: null,
  acticeNavLink: null, //nav links
  setActiveNavLink: () => {},
  navLinks: [],
  handleChangeActiveLink: () => {},
  setIsAssignEmployeeFormOpen: () => {},
  isTaskDetailsFormOpen: false, //task detail modal overlay togglee
  setIsTaskDetailsFormOpen: () => {},
  isEmployeeDetailsFormOpen: false,
  setIsEmployeeDetailsFormOpen: () => {},
  tasks: [],
  isLoading: false,
  error: null,
  setTasks: () => {},
  setIsLoading: () => {},
  setError: () => {},
  allEmployees: [],
  setAllEmployees: () => {},
  handleUnassignTask: (taskId) => {
    taskId;
  },
  handleDeleteEmployee: (empId) => {
    empId;
  },
  handleDeleteTask: (taskId) => {
    taskId;
  },
});
