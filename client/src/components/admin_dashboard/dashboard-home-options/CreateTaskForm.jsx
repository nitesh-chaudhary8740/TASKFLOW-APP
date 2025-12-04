import React, { useContext, useState, } from 'react';
import { Briefcase, Calendar, Info, Clock, Send, X } from 'lucide-react';
import "./CreateTaskForm.css"
import { AdminDashBoardContext } from '../../../contexts/AdminDashBoardContext';
import { inputOnChange } from '../../../utils/utility.functions';
import axios from 'axios';
import { AntDContext } from '../../../contexts/AntDContext';
import { TASK_MANAGEMENT_HOME } from '../../../contexts/TaskManageMent.context';

export const CreateTaskForm = () => { 
const values = useContext(AdminDashBoardContext)
const {currentUser,selectedAuthRole} =useContext(TASK_MANAGEMENT_HOME)
console.log(currentUser,selectedAuthRole)
const {showError,showSuccess} =useContext(AntDContext)

    const [taskData, setTaskData] = useState({
        name: '',
        description: '',
        dueDate: '',
        priority: 'Medium',
    });

    const priorityOptions = [
        { value: 'High', label: 'High Priority' },
        { value: 'Medium', label: 'Medium Priority' },
        { value: 'Low', label: 'Low Priority' },
    ];


    const handleSubmit = async(e) => {
        e.preventDefault();
        console.log("Task Data Ready for Submission:", taskData);
        
       
      try {
         if(!taskData.description||!taskData.dueDate||!taskData.priority){
          alert("all fields required")
          return
         }
          const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/task-create`,taskData,{withCredentials:true});
            showSuccess(response.data.msg,3)
            values.triggerRefetch()
      } catch (error) {
        console.log(error)
        showError(error.response?.data?.msg,3)
      }
     

         
            
           
       
    };

    return (
        <div className="modal-overlay"> 
            <div className="task-form-container modal-content"> 
                
                {/* Cross Button to Close the Form */}
                <button 
                    className="modal-close-btn" 
                    onClick={()=>{
                        values.setIsTaskFormOpen(false)
                    }} 
                    title="Close Form"
                >
                    <X size={24} />
                </button>

                <h2 className="form-title">
                    <Briefcase size={24} style={{ marginRight: '10px' }} />
                    Create New Task
                </h2>
                
                {/* Display submission messages */}
                

                <form onSubmit={handleSubmit} className="task-form">
                    {/* 1. Task Name */}
                    <div className="form-group">
                        <label htmlFor="name"><Info size={16} /> Task Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={taskData.name}
                            onChange={inputOnChange(setTaskData)}
                            placeholder="e.g., Design homepage wireframes"
                            required
                            className="form-input"
                        />
                    </div>

                    {/* 2. Task Description */}
                    <div className="form-group">
                        <label htmlFor="description"><Info size={16} /> Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={taskData.description}
                          onChange={inputOnChange(setTaskData)}
                            placeholder="Provide detailed instructions for the task."
                            rows="4"
                            required
                            className="form-textarea"
                        />
                    </div>

                    <div className="form-row">
                        {/* 3. Due Date */}
                        <div className="form-group">
                            <label htmlFor="dueDate"><Calendar size={16} /> Due Date</label>
                            <input
                                type="date"
                                id="dueDate"
                                name="dueDate"
                                value={taskData.dueDate}
                                 onChange={inputOnChange(setTaskData)}
                                required
                                className="form-input"
                            />
                        </div>

                        {/* 4. Priority */}
                        <div className="form-group">
                            <label htmlFor="priority"><Clock size={16} /> Priority</label>
                            <select
                                id="priority"
                                name="priority"
                                value={taskData.priority}
                                onChange={inputOnChange(setTaskData)}
                                required
                                className="form-select"
                            >
                                {priorityOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button type="submit" className="form-submit-btn">
                        <Send size={18} style={{ marginRight: '8px' }} />
                        Submit Task
                    </button>
                </form>
            </div>
        </div>
    );
};