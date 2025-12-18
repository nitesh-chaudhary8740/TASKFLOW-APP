import React, { useContext,   useEffect,   useState } from 'react'
import { EmployeeDashboardContext } from '../../../../contexts/EmployeeDashboardContext'
import { Clock, Briefcase, Calendar, Info, UserCheck, Code } from 'lucide-react'
import './TaskDetails.css' // Assuming you have a CSS file for styling
import ActionButtons from './ActionButtons';
import { useNavigate, useParams } from 'react-router-dom';

function TaskDetails() {
    const { startWorkOnTask,stopWorkOnTask,returnFetchedTaskById,handleChangeActiveLink,selectedTask,setIsReportFormOpen} = useContext(EmployeeDashboardContext);
    const params = useParams()
    const {taskId} = params
    const navigate = useNavigate()
    const [task,setTask]=useState(null)
   
  useEffect(()=>{
     handleChangeActiveLink(1)
  },[])
    useEffect(()=>{
   (async()=>{
      const returnedTask = await returnFetchedTaskById(taskId);
      console.log(returnedTask)
      if(returnedTask) setTask(returnedTask)   
   })();
    },[taskId,returnFetchedTaskById])
    if (!task) {
        return (
            <div className='task-details-container'>
                <div className="no-task-selected">
                    <Info size={24} style={{ marginRight: '10px' }} />
                    Loading task...
                </div>
                {/* Removed unnecessary empty button here */}
            </div>
        );
    }
    
    // Helper function to format dates
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString();
    };

    return (
        <div className='task-details-container'>
            {/* 1. Breadcrumb Navigation */}
            <div className='task-details-breadcrumb'> {/* Renamed class for clarity */}
                <span>
                    <button className="breadcrumb-btn"
                    onClick={()=>{
                      navigate("/employee-dashboard/my-tasks")
                    }}
                    >My Tasks</button>
                    {">>"}
                    <span className="current-task-id">
                        {task.id}
                    </span>
                </span>
            </div>

            {/* 2. Task Header (Name and Status - Now the main block) */}
            <div className='task-details-main-info'> {/* New container for stacking */}
                <div className="task-details-status-and-name">
                    <h2 className="task-title">
                        <Briefcase size={28} style={{ marginRight: '10px' }} />
                        {task.name}
                    </h2>
                    <div className={`task-status task-status-${task.status.toLowerCase()}`}>
                        Status: **{task.status}**
                    </div>
                </div>

                {/* 3. Action: Start/Stop Working (Below Name/Status) */}
                <div className='task-details-progres'>
                    Action: 
                    {task.status === "Pending" ? 
                        (<button className='start-working-btn' 
                        onClick={()=>startWorkOnTask(task._id)}
                        >Start Working</button>) :
                        (<button className='stop-working-btn'
                            onClick={()=>stopWorkOnTask(task._id)}
                           disabled={task.status !== "In-Progress"}>Stop-working Working</button>)
                    }
                </div>

                {/* 4. Report Actions (Below Start/Stop Action) */}
                <div className="task-details-report-actions">
                   <span style={{fontWeight:"500"}}>
                    Report: 
                    </span> {
                        task.hasReport ? (
                            <span>
                                has been submitted:
                                <button className='task-details-report-submit-btn view-report-btn'
                                onClick={()=>{
                                    navigate(`/employee-dashboard/report-details/${task.report}`)
                                }}>View Report</button> 
                                {/* <button className='task-details-report-submit-btn delete-report-btn'>Delete Report</button>  */}
                            </span>
                        ) : (
                            <span >
                                not submitted yet
                                <button className='task-details-report-submit-btn submit-report-btn' 
                                disabled={task.status==="Pending"}
                                onClick={()=>{
                                 
                                    selectedTask.current=task;
                                    setIsReportFormOpen(true)
                                }}
                                >Submit Report</button>
                            </span>
                        )
                    }
                </div>
            </div> 
            {/* End of task-details-main-info container */}
            
            <hr className='separator' />

            {/* 5. Task Metadata Grid */}
            <div className="info-grid">
                
                <div className="info-item">
                    <Clock size={18} className="info-icon" />
                    <strong>Due Date:</strong>
                    <span>{formatDate(task.dueDate)}</span>
                </div>
                
                <div className="info-item">
                    <Calendar size={18} className="info-icon" />
                    <strong>Start Date:</strong>
                    <span>{formatDate(task.startDate)}</span>
                </div>

                <div className="info-item">
                    <Code size={18} className="info-icon" />
                    <strong>Priority:</strong>
                    <span className={`priority priority-${task.priority.toLowerCase()}`}>{task.priority}</span>
                </div>

                <div className="info-item">
                    <UserCheck size={18} className="info-icon" />
                    <strong>Assigned By:</strong>
                    <span>{task.assignedBy?.name || 'Admin'}</span>
                </div>
            </div>

            <hr className='separator' />

            {/* 6. Task Description */}
            <div className="task-description-section">
                <h3><Info size={20} style={{ marginRight: '5px' }} />Description</h3>
                <p>{task.description || "No detailed description provided for this task."}</p>
            </div>
        </div>
    );
}

export default TaskDetails;