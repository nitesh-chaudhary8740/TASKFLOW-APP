import { createContext } from "react"

export const EmployeeDashboardContext = createContext({
   activeEmpNavLinks:[],//navigation links state var for UI render to show which nav menu is selected
   employeeAllTasks:[], //(state var)all fetched assigned task to logged user
    employeeReports:[], //(state var)all fetched assigned reports to logged user

   user:null, //useRef to store current logged user
   selectedTask:{current:null},
   isReportFormOpen:false,
   setIsReportFormOpen:()=>{},
   triggerRefetch:()=>{},
   handleChangeActiveLink:()=>{},//method to change render the navigation link UI
   startWorkOnTask:(taskId)=>{taskId},
   stopWorkOnTask:(taskId)=>{taskId},
   returnFetchedTaskById:(taskId)=>{taskId},
   returnFetchedReportById:(reportId)=>{reportId},
   submitReport:(taskData)=>{taskData},
   

   
})