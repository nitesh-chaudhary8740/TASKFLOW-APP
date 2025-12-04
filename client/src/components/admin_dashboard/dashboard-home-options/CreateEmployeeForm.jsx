import React, { useContext, useState } from "react";
import {
    UserPlus, Info, Mail, BriefcaseBusiness, X, Send, User, Phone, MapPin,
} from "lucide-react";
import "./CreateEmployeeForm.css";
import { AdminDashBoardContext } from "../../../contexts/AdminDashBoardContext";
import { inputOnChange } from "../../../utils/utility.functions";
import axios from "axios";
import { AntDContext } from "../../../contexts/AntDContext";
import EMPLOYEE_MAX_LENGTHS from "../../../enums/inputMaxLength"; // ⬅️ Imported Constants

export const CreateEmployeeForm = () => {
    const adminContextValues = useContext(AdminDashBoardContext);
    const antDContextValues = useContext(AntDContext)
    
    // 🔑 State to track if an input is focused (to display helper text/errors)
    const [formInputErrors, setFormInputErrors] = useState({
        ERR_FULL_NAME: false,
        ERR_USER_NAME: false,
        ERR_EMAIL: false,
        ERR_PHONE: false,
        ERR_ADDRESS: false,
    });

    const roles = ["Manager", "Engineer", "Designer", "Tester", "HR"];
    const [isCreating, setIsCreating] = useState(false)
    const [employeeData, setEmployeeData] = useState({
        fullName: "",
        userName: "",
        email: "",
        designation: "",
        phone: "",
        address: ""
    });

    // 💡 Helper function to handle focus/blur state updates
    const handleFocus = (fieldName) => {
        setFormInputErrors(prev => ({ ...prev, [fieldName]: true }));
    };

    const handleBlur = (fieldName) => {
        setFormInputErrors(prev => ({ ...prev, [fieldName]: false }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsCreating(true)
        
        // Basic required field check (Enhanced)
        if (
            !employeeData.fullName ||
            !employeeData.userName ||
            !employeeData.email ||
            !employeeData.designation ||
            !employeeData.phone ||
            !employeeData.address
        ) {
            antDContextValues.showError("Please fill out all required fields.", 2);
            setIsCreating(false);
            return;
        }

        try {
            console.log("Employee Data Ready for Submission:", employeeData);

            await axios.post(
                `${import.meta.env.VITE_API_URL}/emp-create`, employeeData, { withCredentials: true });
            
            antDContextValues.showSuccess("New employee added successfully!")
            
            // Success actions
            adminContextValues.triggerRefetch();
            adminContextValues.setIsCreateEmpFormOpen(false); // Close modal on success

            const showNotificationTO = setTimeout(() => {
                antDContextValues.showNotification("info", "A new employee has been created!", `${(new Date()).toDateString()}`)
                clearTimeout(showNotificationTO)
            }, 50);

        } catch (error) {
            console.error(error)
            antDContextValues.showError(error?.response?.data.msg || "Employee creation failed.", 3)
        } finally {
            setIsCreating(false)
        }
    };

    return (
        <div className="create-employee-modal-overlay">
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
                    
                    {/* 1. Full Name - MAX LENGTH 100 */}
                    <div className="form-group">
                        <label htmlFor="fullName">
                            <Info size={16} /> Full Name
                        </label>
                        <input
                            type="text"
                            id="fullName"
                            name="fullName"
                            value={employeeData.fullName}
                            onChange={inputOnChange(setEmployeeData)}
                            placeholder="e.g., Jane Doe"
                            required
                            maxLength={EMPLOYEE_MAX_LENGTHS.FULL_NAME}
                            className={`form-input ${formInputErrors.ERR_FULL_NAME ? "error-border" : ""}`}
                            onFocus={() => handleFocus("ERR_FULL_NAME")}
                            onBlur={() => handleBlur("ERR_FULL_NAME")}
                        />
                        {formInputErrors.ERR_FULL_NAME && (
                            <span className="error-message">Max length: {EMPLOYEE_MAX_LENGTHS.FULL_NAME} characters.</span>
                        )}
                    </div>

                    {/* 2. User Name - MAX LENGTH 50 */}
                    <div className="form-group">
                        <label htmlFor="username">
                            <User size={16} /> User Name
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="userName"
                            value={employeeData.userName}
                            onChange={inputOnChange(setEmployeeData)}
                            placeholder="e.g., user@joe"
                            required
                            maxLength={EMPLOYEE_MAX_LENGTHS.USER_NAME}
                            className={`form-input ${formInputErrors.ERR_USER_NAME ? "error-border" : ""}`}
                            onFocus={() => handleFocus("ERR_USER_NAME")}
                            onBlur={() => handleBlur("ERR_USER_NAME")}
                        />
                        {formInputErrors.ERR_USER_NAME && (
                            <span className="error-message">Max length: {EMPLOYEE_MAX_LENGTHS.USER_NAME} characters.</span>
                        )}
                    </div>

                    {/* 3. Email - MAX LENGTH 100 */}
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
                            maxLength={EMPLOYEE_MAX_LENGTHS.EMAIL}
                            className={`form-input ${formInputErrors.ERR_EMAIL ? "error-border" : ""}`}
                            onFocus={() => handleFocus("ERR_EMAIL")}
                            onBlur={() => handleBlur("ERR_EMAIL")}
                        />
                         {formInputErrors.ERR_EMAIL && (
                            <span className="error-message">Max length: {EMPLOYEE_MAX_LENGTHS.EMAIL} characters.</span>
                        )}
                    </div>

                    {/* 4. Phone No. - MAX LENGTH 15 */}
                    <div className="form-group">
                        <label htmlFor="phone">
                            <Phone size={16} /> Phone No.
                        </label>
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            value={employeeData.phone}
                            onChange={inputOnChange(setEmployeeData)}
                            placeholder="+91"
                            required
                            maxLength={EMPLOYEE_MAX_LENGTHS.PHONE}
                            className={`form-input ${formInputErrors.ERR_PHONE ? "error-border" : ""}`}
                            onFocus={() => handleFocus("ERR_PHONE")}
                            onBlur={() => handleBlur("ERR_PHONE")}
                        />
                         {formInputErrors.ERR_PHONE && (
                            <span className="error-message">Max length: {EMPLOYEE_MAX_LENGTHS.PHONE} digits/characters.</span>
                        )}
                    </div>

                    {/* 5. Address - MAX LENGTH 255 */}
                    <div className="form-group">
                        <label htmlFor="address">
                            <MapPin size={16} /> Address
                        </label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={employeeData.address}
                            onChange={inputOnChange(setEmployeeData)}
                            placeholder="bhopal, MP"
                            required
                            maxLength={EMPLOYEE_MAX_LENGTHS.ADDRESS}
                            className={`form-input ${formInputErrors.ERR_ADDRESS ? "error-border" : ""}`}
                            onFocus={() => handleFocus("ERR_ADDRESS")}
                            onBlur={() => handleBlur("ERR_ADDRESS")}
                        />
                         {formInputErrors.ERR_ADDRESS && (
                            <span className="error-message">Max length: {EMPLOYEE_MAX_LENGTHS.ADDRESS} characters.</span>
                        )}
                    </div>

                    {/* 6. Designation (Modified to Dropdown) */}
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

                    <button
                        disabled={isCreating}
                        type="submit" className="form-submit-btn">
                        <UserPlus size={18} style={{ marginRight: "8px" }} />
                        {isCreating ? "Adding..." : " Add Employee"}
                    </button>
                </form>
            </div>
        </div>
    );
};