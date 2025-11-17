import React from 'react'
import EmployeeDashboardProvider from '../../contexts/EmployeeDashboardProvider'
import EmployeeNavbar from './EmployeeNavbar'
import { Outlet } from 'react-router-dom'

function EmployeeDashboard() {
  return (
   <EmployeeDashboardProvider>
    <EmployeeNavbar />
    <Outlet/>
   </EmployeeDashboardProvider>
  )
}

export default EmployeeDashboard
