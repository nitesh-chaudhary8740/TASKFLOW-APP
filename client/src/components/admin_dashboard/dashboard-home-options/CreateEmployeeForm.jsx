import React, { useContext, useState } from "react";
import {
  UserPlus,
  Info,
  Mail,
  BriefcaseBusiness,
  X,
  Send,
  User,
} from "lucide-react";
// import { AdminDashBoardContext } from './AdminDashboard';
import "./CreateEmployeeForm.css";
import { AdminDashBoardContext } from "../../../contexts/AdminDashBoardContext";
import { inputOnChange } from "../../../utils/utility.functions";
import axios from "axios";
import { AntDContext } from "../../../contexts/AntDContext";
import { useNavigate } from "react-router-dom";
export const CreateEmployeeForm = () => {
  const navigate = useNavigate()
  const adminContextValues = useContext(AdminDashBoardContext);
  const antDContextValues = useContext(AntDContext)
  // Consume the context to get the close function
  // const { closeEmployeeForm } = useContext(AdminDashBoardContext);
  const roles = ["Manager", "Engineer", "Designer", "Tester", "HR"];
  const [employeeData, setEmployeeData] = useState({
    fullName: "",
    userName: "",
    email: "",
    designation: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("Employee Data Ready for Submission:", employeeData);
      if (
        !employeeData.fullName ||
        !employeeData.userName ||
        !employeeData.email ||
        !employeeData.designation
      ) {
        alert("all feilds req");
        return;
      }
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/emp-create`,employeeData);
      console.log(response.data);
      antDContextValues.showSuccess("New employee added successfully!")
        const showNotificationTO = setTimeout(() => {
                antDContextValues.showNotification("info","A new employee has been created!",`${(new Date).toDateString}`)
                clearTimeout(showNotificationTO)
        }, 2000);
     navigate('/admin-dashboard')
    } catch (error) {
      alert(error.response.data.msg);
    }
    finally{
         navigate('/admin-dashboard')
       setEmployeeData({ //empty all the fields even if success/fail
      fullName: "",
      userName: "",
      email: "",
      designation: "",
    });
    adminContextValues.setIsCreateEmpFormOpen(false); //close the form after submission if failed/success
    }

   
   
  };

  return (
    <div className="modal-overlay">
      <div className="task-form-container modal-content">
        {/* Cross Button to Close the Form */}
        <button
          className="modal-close-btn"
          onClick={() => {
            adminContextValues.setIsCreateEmpFormOpen(false);
          }}
          title="Close Form"
        >
          <X size={24} />
        </button>

        <h2 className="form-title">
          <UserPlus size={24} style={{ marginRight: "10px" }} />
          Add New Employee
        </h2>

        <form onSubmit={handleSubmit} className="task-form">
          {/* 1. Employee Name */}
          <div className="form-group">
            <label htmlFor="fullName">
              <Info size={16} /> Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={employeeData.name}
              onChange={inputOnChange(setEmployeeData)}
              placeholder="e.g., Jane Doe"
              required
              className="form-input"
            />
          </div>

          {/* 2. User Name */}
          <div className="form-group">
            <label htmlFor="username">
              <User size={16} /> User Name
            </label>
            <input
              type="text"
              id="username"
              name="userName"
              value={employeeData.username}
              onChange={inputOnChange(setEmployeeData)}
              placeholder="e.g., user@joe"
              required
              className="form-input"
            />
          </div>

          {/* 3. Email */}
          <div className="form-group">
            <label htmlFor="email">
              <Mail size={16} /> Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={employeeData.email}
              onChange={inputOnChange(setEmployeeData)}
              placeholder="jane.doe@acmecorp.com"
              required
              className="form-input"
            />
          </div>

          {/* 4. Designation (Modified to Dropdown) */}
          <div className="form-group">
            <label htmlFor="designation">
              <BriefcaseBusiness size={16} /> Designation
            </label>
            <select
              id="designation"
              name="designation"
              value={employeeData.designation}
              onChange={inputOnChange(setEmployeeData)}
              required
              className="form-select"
            >
              <option value="" disabled>
                Select Role
              </option>
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="form-submit-btn">
            <UserPlus size={18} style={{ marginRight: "8px" }} />
            Add Employee
          </button>
        </form>
      </div>
    </div>
  );
};
