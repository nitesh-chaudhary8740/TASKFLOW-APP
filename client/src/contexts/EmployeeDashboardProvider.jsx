import React from 'react'
import { EmployeeDashboardContext } from './EmployeeDashboardContext'
import { useState } from 'react';
import { LayoutDashboard,   ListChecks,FolderPlus  } from 'lucide-react';
import { useEffect } from 'react';
import axios from 'axios';
import { useRef } from 'react';
import { useContext } from 'react';
import { AntDContext } from './AntDContext';
  const empNavLinks = [
      { name: 'Dashboard', icon: LayoutDashboard, href: '/employee-dashboard', active: true },
      { name: 'My Tasks', icon: ListChecks, href: 'my-tasks', active: false },
      { name: 'Assignedd Projects', icon: FolderPlus, href: 'assigned-projects' , active: false},
    ];
const loggeduser  = JSON.parse(localStorage.getItem("currentUser"))
function EmployeeDashboardProvider({children}) {
    const {showError}= useContext(AntDContext)
    const [activeEmpNavLinks,setActieEmpNavLinks] = useState([...empNavLinks])
    const [employeeAllTasks,setEmployeeAllTasks] = useState([])
    const user = useRef(loggeduser)
 
    useEffect(()=>{
        const fetchEmpTasks =async ()=>{
           try {
             const response = await axios.get(`${import.meta.env.VITE_EMP_API_URL}/employee-tasks/${user.current._id}`)
             console.log(response.data)
             setEmployeeAllTasks(response.data.empTasks)
           } catch (error) {
            console.log(error)
            if(error?.response?.data) showError(error.response.data)
                else showError("error is fetching tasks")    
           }
        }
        fetchEmpTasks()
    },[showError])
    const handleChangeActiveLink = (index) =>{
   try {
     const tempNavLinks = [...activeEmpNavLinks];
     tempNavLinks.forEach(link=>link.active=false)
      tempNavLinks[index].active=true
      setActieEmpNavLinks(tempNavLinks)
   } catch (error) {
    console.log(error)
   }
  }
    //
     const values = {
        activeEmpNavLinks,
        employeeAllTasks,
        user,
        handleChangeActiveLink,
    }
  return (
    <EmployeeDashboardContext.Provider value={values}>
        {children}
    </EmployeeDashboardContext.Provider>
  )
}

export default EmployeeDashboardProvider
