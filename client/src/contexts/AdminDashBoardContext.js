import { createContext } from "react";

export const AdminDashBoardContext = createContext({
    isTaskFormOpen:false,
    setIsTaskFormOpen:()=>{},
  isCreateEmpFormOpen:false,
  setIsCreateEmpFormOpen:()=>{},
  isCreateProjectFormOpen:false,
  setIsCreateProjectFormOpen:()=>{},
  adminMetaData:null,
  isAssignTaskFormOpen:false,
   setIsAssignTaskFormOpen:()=>{},
   selectedEmployee:null,
   selectedTask:null,
    acticeNavLink:null,//nav links
     setActiveNavLink:()=>{},
     navLinks:[],
      handleChangeActiveLink:()=>{},
    setIsAssignEmployeeFormOpen:()=>{},
   
})