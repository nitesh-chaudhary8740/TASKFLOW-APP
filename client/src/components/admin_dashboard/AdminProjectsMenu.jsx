import React, { useContext, useEffect } from 'react'
import { AdminDashBoardContext } from '../../contexts/AdminDashBoardContext'

function AdminProjectsMenu() {
   const adminContextValues = useContext(AdminDashBoardContext)
      useEffect(()=>{
           adminContextValues.handleChangeActiveLink(3)
      },[])
     
  return (
    <div>
      this is project menu
    </div>
  )
}

export default AdminProjectsMenu
