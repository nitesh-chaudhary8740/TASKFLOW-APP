import React, { useMemo, useRef, useState } from "react";
import { TASK_MANAGEMENT_HOME } from "./TaskManageMent.context";
import { USER_ROLES } from "../enums/roles.js";


function TaskManageMentProvider({ children }) {
  const user=JSON.parse (localStorage.getItem("currentUser"))
  const [currentUser,setCurrentUser] = useState(user||null)
  const selectedAuthRole = useRef(USER_ROLES.ADMIN)


  const values = useMemo(
    () => ({ 
       selectedAuthRole,

       currentUser,
       setCurrentUser
       }),
    [currentUser,setCurrentUser]
  );
  return (
    <TASK_MANAGEMENT_HOME.Provider value={values}>
      {children}
    </TASK_MANAGEMENT_HOME.Provider>
  );
}

export default TaskManageMentProvider;
