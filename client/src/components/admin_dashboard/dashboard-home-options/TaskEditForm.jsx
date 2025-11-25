import React, { useState } from 'react';
import { X, Save, Clock, AlertTriangle,Calendar } from 'lucide-react';
// Assuming TASK_STATUS is available somewhere, or define it locally for the form
const TASK_STATUS = ["Pending", "In-Progress", "Under-Review", "Completed", "Blocked", "Overdue"];
const PRIORITY_LEVELS = ["Low", "Medium", "High"];

function TaskEditForm({ task, setIsEditing }) {
    // Initialize form state with current task data
    const [formData, setFormData] = useState({
        name: task.name,
        description: task.description,
        dueDate: task.dueDate,
        priority: task.priority,
        status: task.status,
    });
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        
        // 🚨 IMPORTANT: You need to implement your actual API call here.
        console.log("Saving updated task data:", formData);
        
        // After successful save:
        setIsEditing(false); // Close the edit form
    };

    return (
        // Reusing 'task-details-overlay' because it defines the modal backdrop/positioning
        <div className='task-details-overlay' onClick={() => setIsEditing(false)}>
            {/* Class name changed to task-edit-card */}
            <form className='task-edit-card' onClick={(e) => e.stopPropagation()} onSubmit={handleSave}>
                
                {/* Header - Class name changed to task-edit-header */}
                <div className='task-edit-header'>
                    <h1 className='task-edit-title'>Edit Task: {task.id}</h1>
                    <button 
                        onClick={() => setIsEditing(false)} 
                        // Reusing 'close-button' as it's a generic modal control style
                        className="close-button"
                        title="Cancel Editing"
                        type="button"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Body - Class name changed to task-edit-body */}
                <div className='task-edit-body'>
                    
                    {/* Name Field */}
                    <label className='task-edit-label' htmlFor="name">Task Name</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="task-edit-input" // Class name changed
                    />

                    {/* Description Field */}
                    <label className='task-edit-label' htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows="4"
                        className="task-edit-textarea" // Class name changed
                    />

                    {/* Grid - Class name changed to task-edit-grid */}
                    <div className='task-edit-grid'>
                        
                        {/* Status Dropdown */}
                        <div className='task-edit-item'>
                            <label className='task-edit-sublabel' htmlFor="status"><Clock size={16}/> Status</label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className={`task-edit-select  `} // Class name changed
                            >
                                {TASK_STATUS.map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                        </div>
                        
                        {/* Priority Dropdown */}
                        <div className='task-edit-item'>
                            <label className='task-edit-sublabel' htmlFor="priority"><AlertTriangle size={16}/> Priority</label>
                            <select
                                id="priority"
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                className={`task-edit-select`} // Class name changed
                            >
                                {PRIORITY_LEVELS.map(priority => (
                                    <option key={priority} value={priority}>{priority}</option>
                                ))}
                            </select>
                        </div>

                        {/* Due Date Field */}
                        <div className='task-edit-item'>
                            <label className='task-edit-sublabel' htmlFor="dueDate"><Calendar size={16}/> Due Date</label>
                            <input
                                id="dueDate"
                                name="dueDate"
                                type="date"
                                value={formData.dueDate.split('T')[0]} 
                                onChange={handleChange}
                                required
                                className="task-edit-input" // Class name changed
                            />
                        </div>

                    </div>
                    
                  
                </div>

                {/* Footer - Class name changed to task-edit-footer */}
                <div className='task-edit-footer'>
                    <button 
                        onClick={() => setIsEditing(false)} 
                        className="action-button delete-button"
                        type="button"
                        title="Cancel and discard changes"
                    >
                        Cancel
                    </button>
                    <button 
                        className="action-button reassign-button"
                        type="submit"
                        title="Save all changes to the task"
                    >
                        <Save size={20} style={{marginRight: '8px'}} />
                        Save Changes
                    </button>
                </div>
            </form>
        </div>
    );
}

export default TaskEditForm;