import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit, Save, X, AlertTriangle, Key, ChevronLeft, Check } from 'lucide-react';
import { TASK_MANAGEMENT_HOME } from '../../contexts/TaskManageMent.context';
// import { EmployeeDashboardContext } from '../../contexts/EmployeeDashboardContext';
import './EmployeeProfile.css'; 

// Component remains focused on profile management
function EmployeeProfile() {
    const { currentUser,updateEmployeeProfile, verifyCurrentPassword,changeCurrentPassword } = useContext(TASK_MANAGEMENT_HOME);
    const navigate = useNavigate();
  
    
    const currentEmployee = currentUser; 

    // Profile Details State (Unchanged)
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [feedback, setFeedback] = useState({ message: '', isError: false, type: '' });

    // Password Change State (Updated for multi-step flow)
    const [passwordStep, setPasswordStep] = useState(1); // 1: Enter Current, 2: Enter New
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    useEffect(() => {
       
        if (currentEmployee) {
            setFormData({
                fullName: currentEmployee.fullName || '',
                email: currentEmployee.email || '',
                phone: currentEmployee.phone || '', 
                address: currentEmployee.address || '',
            });
        }
    }, [currentEmployee]);

    // Consolidate feedback setting
    const showFeedback = (message, isError, type = 'profile') => {
        setFeedback({ message, isError, type });
        setTimeout(() => setFeedback(prev => (prev.type === type ? { message: '', isError: false, type: '' } : prev)), 5000); 
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleEditToggle = () => {
        if (isEditing) {
            // Reset to current saved data if canceling
            setFormData({
                fullName: currentEmployee.fullName,
                email: currentEmployee.email,
                phone: currentEmployee.phone,
                address: currentEmployee.address,
            });
            showFeedback('Changes discarded.', true);
        } else {
            showFeedback('', false);
        }
        setIsEditing(!isEditing);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        showFeedback('Saving...', false);
        
        try {
            const payload = {
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
            };
            await updateEmployeeProfile(payload);
            showFeedback('Profile updated successfully!', false);
            setIsEditing(false);

        } catch (error) {
            console.log(error)
            console.log(error)
            showFeedback('Failed to save profile. Please check inputs.', true);
        }
    };
    
    // --- New Password Change Handlers ---
    
    const handleVerifyCurrentPassword = async () => {
        if (!currentPassword) {
            showFeedback('Please enter your current password.', true, 'password');
            return;
        }

        showFeedback('Verifying...', false, 'password');

        try {
            // Replace with your actual verification API call
            const success = await verifyCurrentPassword(currentPassword); 
            if (success) {
                showFeedback('Verification successful. Enter new password.', false, 'password');
                setPasswordStep(2); // Move to step 2
                setCurrentPassword(''); // Clear the field for security
            } else {
                showFeedback('Current password is incorrect.', true, 'password');
            }
        } catch (error) {
            console.log(error)
            showFeedback('Verification failed. Server error.', true, 'password');
        }
    };

    const handlePasswordChange = async () => {
        if (!newPassword || newPassword.length < 8) {
            showFeedback('New password must be at least 8 characters.', true, 'password');
            return;
        }
        if (newPassword !== confirmNewPassword) {
            showFeedback('New passwords do not match.', true, 'password');
            return;
        }

        showFeedback('Updating password...', false, 'password');

        try {
            await changeCurrentPassword(newPassword); 
            showFeedback('Password changed successfully!', false, 'password');
            setNewPassword('');
            setConfirmNewPassword('');
            setPasswordStep(1); // Reset to step 1
        } catch (error) {
            console.log(error)
            showFeedback('Failed to change password. Try again.', true, 'password');
        }
    };

    const handlePasswordCancel = () => {
        setPasswordStep(1);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        showFeedback('', false, 'password');
    };
    // ------------------------------------

    if (!currentEmployee) {
        return <div className="employee-profile-wrapper loading">Loading profile data...</div>;
    }

    const { fullName, role, designation, email, phone, address } = currentEmployee;
    const initial = fullName ? fullName.charAt(0).toUpperCase() : '?';

    // Helper function to render a field row (omitted for brevity, assume it's included)
    const renderField = (label, key, value, editable, type = 'text') => (
        <div key={key} className="employee-profile-field-row">
            <label className="employee-profile-field-label">{label}:</label>
            <div className="employee-profile-field-value">
                {isEditing && editable ? (
                    <input 
                        type={type} 
                        name={key} 
                        value={formData[key]} 
                        onChange={handleChange} 
                        required={key !== 'address'}
                        className="employee-profile-input" 
                    />
                ) : (
                    <span>{value || 'N/A'}</span>
                )}
            </div>
        </div>
    );

    return (
        <div className="employee-profile-wrapper">
            
            <div className="employee-profile-back-button-container">
                <button className="employee-profile-back-btn" onClick={() => navigate(-1)}> 
                    <ChevronLeft size={20} /> Go Back
                </button>
            </div>
            
            <div className="employee-profile-container">
                
                {/* 1. Identity Section */}
                <div className="employee-profile-identity">
                    <div className="employee-profile-avatar">{initial}</div>
                    <h3 className="employee-profile-username">{fullName || 'N/A'}</h3>
                    <p className="employee-profile-role">Role: **{role || 'Employee'}**</p>
                    <p className="employee-profile-designation">Designation: **{designation || 'N/A'}**</p>
                </div>
                
                <hr className="employee-profile-separator" />
                
                {/* 2. Personal Details Section (Profile Update) */}
                <div className="employee-profile-details-section">
                    <div className="employee-profile-header-details">
                        <h4>Personal Information</h4>
                        <button  className="employee-profile-btn-edit" onClick={handleEditToggle} disabled={isEditing}>
                            <Edit size={18} /> Edit Details
                        </button>
                    </div>

                    {/* Profile Feedback */}
                    {feedback.message && feedback.type === 'profile' && (
                        <div className={`employee-profile-status-message ${feedback.isError ? 'error' : 'success'}`}>
                            <AlertTriangle size={18} /> {feedback.message}
                        </div>
                    )}

                    <form onSubmit={handleSave} className="employee-profile-form">
                        {renderField('Full Name', 'fullName', fullName, true)}
                        {renderField('Email', 'email', email, true, 'email')}
                        {renderField('Phone', 'phone', phone, true, 'tel')}
                        {renderField('Address', 'address', address, true)}
                        
                        {/* Save/Cancel Buttons */}
                        {isEditing && (
                            <div className="employee-profile-actions-bottom">
                                <button type="submit" className="employee-profile-btn-save" disabled={!formData.fullName || !formData.email}>
                                    <Save size={18} /> Save Changes
                                </button>
                                <button type="button" className="employee-profile-btn-cancel" onClick={handleEditToggle}>
                                    <X size={18} /> Cancel
                                </button>
                            </div>
                        )}
                    </form>
                </div>
                
                <hr className="employee-profile-separator" />

                {/* 3. Change Password Section (Multi-Step Logic) */}
                <div className="employee-profile-password-section">
                    <h4><Key size={20} /> Change Password (Step {passwordStep} of 2)</h4>
                    
                    {/* Password Feedback */}
                    {feedback.message && feedback.type === 'password' && (
                        <div className={`employee-profile-status-message small ${feedback.isError ? 'error' : 'success'}`}>
                            {feedback.message}
                        </div>
                    )}
                    
                    {/* Step 1: Enter Current Password */}
                    {passwordStep === 1 && (
                        <div className="employee-profile-password-input-row">
                            <label className="employee-profile-field-label">Current Password:</label>
                            <input 
                                type="password" 
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="Enter current password"
                                className="employee-profile-input employee-profile-password-input"
                            />
                            <button 
                                className="employee-profile-btn-edit" // Re-using edit styling for confirm button
                                onClick={handleVerifyCurrentPassword}
                                disabled={!currentPassword}
                            >
                                <Check size={18} /> Confirm
                            </button>
                        </div>
                    )}

                    {/* Step 2: Enter New Password */}
                    {passwordStep === 2 && (
                        <div className="employee-profile-password-form-step2">
                            <div className="employee-profile-field-row">
                                <label className="employee-profile-field-label">New Password:</label>
                                <input 
                                    type="password" 
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Enter new password"
                                    className="employee-profile-input"
                                />
                            </div>
                            <div className="employee-profile-field-row">
                                <label className="employee-profile-field-label">Re-enter New Password:</label>
                                <input 
                                    type="password" 
                                    value={confirmNewPassword}
                                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                                    placeholder="Confirm new password"
                                    className="employee-profile-input"
                                />
                            </div>
                            <div className="employee-profile-actions-bottom">
                                <button type="button" className="employee-profile-btn-cancel" onClick={handlePasswordCancel}>
                                    <X size={18} /> Cancel
                                </button>
                                <button 
                                    className="employee-profile-btn-password-change" 
                                    onClick={handlePasswordChange}
                                    disabled={newPassword.length < 6 || newPassword !== confirmNewPassword}
                                >
                                    Change Password
                                </button>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

export default EmployeeProfile;