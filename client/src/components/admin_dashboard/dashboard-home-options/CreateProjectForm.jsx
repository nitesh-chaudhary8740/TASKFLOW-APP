import React, { useState, useContext } from 'react';
import { FolderPlus, Info, Users, Calendar, UserCheck, Send, X } from 'lucide-react';
// Assuming AdminDashBoardContext is available and provides closeProjectForm

import "./CreateProjectForm.css"
import { AdminDashBoardContext } from '../../../contexts/AdminDashBoardContext';
export const CreateProjectForm = () => { 
    // Consume the context to get the close function
    const adminContextValues = useContext(AdminDashBoardContext);

    const [projectData, setProjectData] = useState({
        projectName: '',
        clientName: '',
        dueDate: '',
        description: '',
        manager: '',
    });

    const [message, setMessage] = useState('');

    const mockManagers = [
        { id: '1', name: 'Alice Johnson' },
        { id: '2', name: 'Bob Williams' },
        { id: '3', name: 'Charlie Brown' },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProjectData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage('Initiating new project...');
        
        console.log("Project Data Ready for Submission:", projectData);
        
        // Simulate API response
        setTimeout(() => {
            setMessage(`Project '${projectData.projectName}' launched successfully! Closing form...`);
            
            // Clear form fields
            setProjectData({
                projectName: '',
                clientName: '',
                dueDate: '',
                description: '',
                manager: '',
            });
            
            // Close the modal after a delay
            // setTimeout(() => closeProjectForm(), 1500);
        }, 1500);
    };

    return (
        <div className="modal-overlay"> 
            <div className="task-form-container modal-content"> 
                
                {/* Cross Button to Close the Form */}
                <button 
                    className="modal-close-btn" 
                    onClick={()=>{
                        adminContextValues.setIsCreateProjectFormOpen(false)
                    }} 
                    title="Close Form"
                >
                    <X size={24} />
                </button>

                <h2 className="form-title">
                    <FolderPlus size={24} style={{ marginRight: '10px' }} />
                    Create New Project
                </h2>
                
                {message && <div className={`form-message ${message.includes('success') ? 'success' : 'info'}`}>{message}</div>}

                <form onSubmit={handleSubmit} className="task-form">
                    
                    <div className="form-row">
                        {/* 1. Project Name */}
                        <div className="form-group">
                            <label htmlFor="projectName"><Info size={16} /> Project Name</label>
                            <input
                                type="text"
                                id="projectName"
                                name="projectName"
                                value={projectData.projectName}
                                onChange={handleChange}
                                placeholder="e.g., Q3 Marketing Campaign"
                                required
                                className="form-input"
                            />
                        </div>

                        {/* 2. Client Name */}
                        <div className="form-group">
                            <label htmlFor="clientName"><Users size={16} /> Client Name</label>
                            <input
                                type="text"
                                id="clientName"
                                name="clientName"
                                value={projectData.clientName}
                                onChange={handleChange}
                                placeholder="e.g., GlobalTech Solutions"
                                required
                                className="form-input"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        {/* 3. Due Date */}
                        <div className="form-group">
                            <label htmlFor="dueDate"><Calendar size={16} /> Deadline</label>
                            <input
                                type="date"
                                id="dueDate"
                                name="dueDate"
                                value={projectData.dueDate}
                                onChange={handleChange}
                                required
                                className="form-input"
                            />
                        </div>

                        {/* 4. Project Manager */}
                        <div className="form-group">
                            <label htmlFor="manager"><UserCheck size={16} /> Project Manager</label>
                            <select
                                id="manager"
                                name="manager"
                                value={projectData.manager}
                                onChange={handleChange}
                                required
                                className="form-select"
                            >
                                <option value="" disabled>Select Manager</option>
                                {mockManagers.map(manager => (
                                    <option key={manager.id} value={manager.id}>
                                        {manager.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    {/* 5. Project Description */}
                    <div className="form-group">
                        <label htmlFor="description"><Info size={16} /> Project Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={projectData.description}
                            onChange={handleChange}
                            placeholder="Outline the project scope, goals, and key deliverables."
                            rows="4"
                            required
                            className="form-textarea"
                        />
                    </div>

                    <button type="submit" className="form-submit-btn">
                        <Send size={18} style={{ marginRight: '8px' }} />
                        Launch Project
                    </button>
                </form>
            </div>
        </div>
    );
};