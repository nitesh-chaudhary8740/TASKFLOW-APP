import React, { useMemo, useRef, useState } from "react";
import { TASK_MANAGEMENT_HOME } from "./TaskManageMent.context";
import { USER_ROLES } from "../enums/roles.js";


function TaskManageMentProvider({ children }) {
 
  const [currentUser,setCurrentUser] = useState(null)
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
