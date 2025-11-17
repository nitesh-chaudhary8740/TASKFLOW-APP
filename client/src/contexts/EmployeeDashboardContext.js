import { createContext } from "react"

export const EmployeeDashboardContext = createContext({
   activeEmpNavLinks:[],//navigation links state var for UI render to show which nav menu is selected
    handleChangeActiveLink:()=>{},//method to change render the navigation link UI

    employeeAllTasks:[], //(state var)all fetched assigned task to logged user
    user:null //useRef to store current logged user
      
})