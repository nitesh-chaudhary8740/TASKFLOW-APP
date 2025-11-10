import React, { useContext, useState } from 'react'
import "../../assets/css/auth.css"
import axios from "axios"

import { inputOnChange } from '../../utils/utility.functions.js'
import {SignUpJSX} from './SignUpJSX.jsx'
import { TASK_MANAGEMENT_HOME } from '../../contexts/TaskManageMent.context.js'

function SignUp() {
  const values = useContext(TASK_MANAGEMENT_HOME)
  const [formData,setFormData] = useState({
    fullName:"",
    userName:"",
    email:"",
  })
  const signUpHandler = async(e)=>{
    e.preventDefault()
    console.log(values.selectedAuthRole.current)
    try {
      if(!formData.fullName||!formData.email||!formData.userName) {
        throw new Error("All fields required")
      }
      console.log(formData)
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/emp-signup`,formData)
      console.log(response.data)
    } catch (error) {
      alert(error)
      
    }
  }
  return <SignUpJSX
  setFormData ={setFormData}
   signUpHandler={signUpHandler}
   inputOnChange ={inputOnChange}
   formData = {formData}
   />
    
}

export default SignUp
