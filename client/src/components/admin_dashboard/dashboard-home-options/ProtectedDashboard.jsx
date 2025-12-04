import React from 'react'
import { useContext } from 'react'
import { TASK_MANAGEMENT_HOME } from '../../../contexts/TaskManageMent.context'
import { Navigate } from 'react-router-dom'
import AdminDashboard from '../AdminDashboard'
import EmployeeDashboard from '../../employee-dashboard/EmployeeDashboard'

function ProtectedDashboard() {
    const {currentUser} = useContext(TASK_MANAGEMENT_HOME)
    if(!currentUser) return <Navigate to={"/login"}/>
    if(currentUser.role==="admin") return (<AdminDashboard/>)
    if(currentUser.role==="employee") return <Navigate to={"/employee-dashboard"}/>
}

export default ProtectedDashboard
