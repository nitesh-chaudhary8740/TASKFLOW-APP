import React, { useContext,  useRef, useState } from "react";
import { TASK_MANAGEMENT_HOME } from "./TaskManageMent.context";
import { USER_ROLES } from "../enums/roles.js";
import { Outlet } from "react-router-dom";
import Prompt from "../components/admin_dashboard/dashboard-home-options/Prompt.jsx";
import { AntDContext } from "./AntDContext.js";
import axios from "axios";
import Password from "antd/es/input/Password.js";


function TaskManageMentProvider({ children }) {
    const EMP_API = import.meta.env.VITE_EMP_API_URL;
    const{showError,showSuccess}=useContext(AntDContext)
  const user=JSON.parse (localStorage.getItem("currentUser"))
  const [currentUser,setCurrentUser] = useState(user||null)
  const selectedAuthRole = useRef(USER_ROLES.ADMIN)
 const [isPromptOpen, setIsPromptOpen] = useState(false)
 const promptData = useRef({
        message: "",
        onConfirm: () => { },
        onCancel: () => { },
        type: "",
        taskId: "",
        confirmText: ""
    })

  const configPrompt = (configOptions) => {
        promptData.current = {
            // Set the message, type, and the function to run on confirm
            message: configOptions.msg,
            onConfirm: configOptions.onConfirm,
            onCancel: configOptions.onCancel,
            type: configOptions.type,
            confirmText: configOptions.confirmText || 'Okay',
            cancelText: configOptions.cancelText || 'Cancel'
        }
        setIsPromptOpen(true)
    }
  const  updateEmployeeProfile = async (profileData, skipPrompt = false) => {
  return new Promise((resolve,reject)=>{
  const performUpdatation = async ()=>{
  try {

      const response = await axios.put(`${EMP_API}/update-profile/${currentUser._id}`,profileData);
      localStorage.setItem("currentUser",JSON.stringify(response.data.employee))
      setCurrentUser(response.data.employee)
      showSuccess(response.data.msg, 3)
      resolve(true)
  
    } catch (error) {
      showError(error.response.data.msg, 3);
      reject(false)
    }
    }
     if (!skipPrompt) {
      configPrompt({
        msg: "Are you sure want to update the profile",
        confirmText: "Update Profile",
        cancelText: "Cancel",
        type: "assign",
        onConfirm:  performUpdatation,
        onCancel: ()=> resolve(false)
      });
     
    }
    })
 
  
  };
  const  verifyCurrentPassword = async(password)=>{
    try {
      const response = await axios.post(`${EMP_API}/verify-password/${user._id}`,{password})
       if(response?.data) return response.data.isVerified;
       
    } catch (error) {
      showError(error.response.data.msg, 3);
       if(error.response?.data) return error.response.data.isVerified;
    }
  }
  const  changeCurrentPassword = async(password)=>{
  return new Promise((resolve,reject)=>{
  const performUpdatation = async ()=>{
  try {

      const response = await axios.put(`${EMP_API}/change-password/${currentUser._id}`,{password});
      showSuccess(response.data.msg, 3)
      resolve(true)
  
    } catch (error) {
      showError(error.response.data.msg, 3);
      reject(false)
    }
    }
    
      configPrompt({
        msg: "Are you sure want to update the password",
        confirmText: "Change Password",
        cancelText: "Cancel",
        type: "warning",
        onConfirm:  performUpdatation,
        onCancel: ()=> resolve(false)
      });
     
    
    })
 
  }
  const values = { 
       selectedAuthRole,
        configPrompt,
       currentUser,
       setIsPromptOpen,
       setCurrentUser,
       updateEmployeeProfile,
       verifyCurrentPassword,
       changeCurrentPassword
       }
   
  
  return (
    <TASK_MANAGEMENT_HOME.Provider value={values}>
      {children}
        <Outlet />
      {isPromptOpen && <Prompt promptData={promptData.current} />}
    </TASK_MANAGEMENT_HOME.Provider>
  );
}

export default TaskManageMentProvider;
