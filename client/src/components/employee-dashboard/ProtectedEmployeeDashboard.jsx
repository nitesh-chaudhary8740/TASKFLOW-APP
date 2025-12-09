import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { TASK_MANAGEMENT_HOME } from '../../contexts/TaskManageMent.context'
import AdminDashboard from '../admin_dashboard/AdminDashboard'

import EmployeeDashboardProvider from '../../contexts/EmployeeDashboardProvider'

function ProtectedEmployeeDashboard() {
    const {currentUser} = useContext(TASK_MANAGEMENT_HOME)
    
    if(!currentUser) return <Navigate to={"/login"}/>
    if(currentUser.role==="admin") return (<AdminDashboard/>)
    if(currentUser.role==="employee") return <EmployeeDashboardProvider/>
}

export default ProtectedEmployeeDashboard
