import React, { useState, useContext } from 'react';
import { X, Save, Mail, BriefcaseBusiness, Phone, MapPin } from 'lucide-react';


import axios from 'axios';
import { AdminDashBoardContext } from '../../../contexts/AdminDashBoardContext';
import { AntDContext } from '../../../contexts/AntDContext';

// Assuming possible designations
const DESIGNATIONS = ["Manager", "Engineer", "Designer", "Tester", "HR"];

function EmployeeEditForm({ employee, setIsEditing }) {
    const adminContextValues = useContext(AdminDashBoardContext);
    const { showSuccess, showError } = useContext(AntDContext);
    // Initialize form state with current employee data
    const [formData, setFormData] = useState({
        fullName: employee.fullName || '',
        userName: employee.userName || '',
        email: employee.email || '',
        designation: employee.designation || DESIGNATIONS[0],
        phone: employee.phone || '',
        address: employee.address || '',
    });
    
    const [isSaving, setIsSaving] = useState(false);


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        
        try {
            const apiUrl = import.meta.env.VITE_API_URL;
            // 🚨 IMPORTANT: Replace with your actual endpoint
            const response = await axios.put(`${apiUrl}/emp-update/${employee._id}`, formData);
            
            
            
            // 1. Update the local context ref with the new data
            adminContextValues.selectedEmployee.current = response.data.employee;
            showSuccess(response.data.message, 3);
            
            setIsEditing(false); // Exit edit mode
        } catch (err) {
            alert(err)
            console.error("Error saving employee:", err.response?.data || err.message);
            const errMsg = err.response?.data?.message || "Failed to save changes.";
            showError(errMsg, 5); 
        } finally {
            setIsSaving(false);
            adminContextValues.isEmployeeDetailsFormOpen(true)
        }
    };

    return (
        // Reusing 'employee-details-overlay' for backdrop
        <div className='employee-details-overlay' onClick={() => !isSaving && setIsEditing(false)}>
            <form className='employee-edit-card' onClick={(e) => e.stopPropagation()} onSubmit={handleSave}>
                
                {/* Header */}
                <div className='employee-edit-header'>
                    <h1 className='employee-edit-title'>Edit Employee: {employee.fullName}</h1>
                    <button 
                        onClick={() => setIsEditing(false)} 
                        className="employee-close-button"
                        title="Cancel Editing"
                        type="button"
                        disabled={isSaving}
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Body - Form Fields */}
                <div className='employee-edit-body'>
                    
                    {/* Full Name & Username Grid */}
                    <div className='employee-edit-grid-2'>
                        <div className='employee-edit-item'>
                            <label className='employee-edit-label' htmlFor="fullName">Full Name</label>
                            <input
                                id="fullName"
                                name="fullName"
                                type="text"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                                className="employee-edit-input"
                            />
                        </div>
                        <div className='employee-edit-item'>
                            <label className='employee-edit-label' htmlFor="userName">Username</label>
                            <input
                                id="userName"
                                name="userName"
                                type="text"
                                value={formData.userName}
                                onChange={handleChange}
                                required
                                className="employee-edit-input"
                            />
                        </div>
                    </div>

                    {/* Email & Designation Grid */}
                    <div className='employee-edit-grid-2'>
                        <div className='employee-edit-item'>
                            <label className='employee-edit-label' htmlFor="email"><Mail size={16}/> Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="employee-edit-input"
                            />
                        </div>
                        <div className='employee-edit-item'>
                            <label className='employee-edit-label' htmlFor="designation"><BriefcaseBusiness size={16}/> Designation</label>
                            <select
                                id="designation"
                                name="designation"
                                value={formData.designation}
                                onChange={handleChange}
                                className="employee-edit-select"
                            >
                                {DESIGNATIONS.map(d => (
                                    <option key={d} value={d}>{d}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    {/* Phone & Address Grid */}
                    <div className='employee-edit-grid-2'>
                        <div className='employee-edit-item'>
                            <label className='employee-edit-label' htmlFor="phone"><Phone size={16}/> Phone</label>
                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                className="employee-edit-input"
                            />
                        </div>
                        <div className='employee-edit-item'>
                            <label className='employee-edit-label' htmlFor="address"><MapPin size={16}/> Address</label>
                            <input
                                id="address"
                                name="address"
                                type="text"
                                value={formData.address}
                                onChange={handleChange}
                                className="employee-edit-input"
                            />
                        </div>
                    </div>
                    
                </div>

                {/* Footer - Actions Section */}
                <div className='employee-edit-footer'>
                    <button 
                        onClick={() => setIsEditing(false)} 
                        className="employee-action-button employee-delete-button"
                        type="button"
                        disabled={isSaving}
                        title="Cancel and discard changes"
                    >
                        Cancel
                    </button>
                    <button 
                        className="employee-action-button employee-save-button"
                        type="submit"
                        disabled={isSaving}
                        title="Save all changes to the employee details"
                        onClick={handleSave}
                    >
                        {isSaving ? 'Saving...' : (
                            <>
                                <Save size={20} style={{marginRight: '8px'}} />
                                Save Changes
                            </>
                        )}
                        
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EmployeeEditForm;