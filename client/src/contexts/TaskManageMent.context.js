import { createContext } from "react";
import { USER_ROLES } from "../enums/roles";

export const TASK_MANAGEMENT_HOME = createContext(
    {
        showHeroSection:false,
        selectedAuthRole:null,
        setShowHeroSection:()=>{},
        currentUser:null,
        setCurrentUser:()=>{}
    }
)