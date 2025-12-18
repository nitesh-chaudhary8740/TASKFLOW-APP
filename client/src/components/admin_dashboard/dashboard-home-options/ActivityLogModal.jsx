import React, { useContext } from "react";
import { X, Activity, Clock, PlusCircle, CheckCircle, AlertCircle, User, Briefcase, Trash2 } from "lucide-react";
import { AdminDashBoardContext } from "../../../contexts/AdminDashBoardContext";
import "./ActivityLogModal.css";

const ActivityLogModal = () => {
    const { activities, setIsActivityLogOpen } = useContext(AdminDashBoardContext);

    // Helper to get icon based on action type
   const getActionIcon = (action) => {
    switch (action) {
        case 'Task': return <PlusCircle size={18} className="icon-task" />;
        case 'REPORT_APPROVED': return <CheckCircle size={18} className="icon-approve" />;
        case 'REPORT_REJECTED': return <AlertCircle size={18} className="icon-reject" />;
        case 'PROFILE_UPDATED': return <User size={18} className="icon-user" />;
        case 'TASK_ASSIGNED': return <Briefcase size={18} className="icon-assign" />;
        
        /* --- NEW DELETE CASE --- */
        case 'TASK_DELETED':
        case 'EMPLOYEE_DELETED':
        case 'DELETED': 
            return <Trash2 size={18} className="icon-delete" />;

        default: return <Activity size={18} />;
    }
};

    return (
        <div className="activity-modal-overlay">
            <div className="activity-modal-container">
                {/* Close Button */}
                <button 
                    className="modal-close-btn" 
                    onClick={() => setIsActivityLogOpen(false)}
                >
                    <X size={24} />
                </button>

                {/* Header */}
                <h2 className="form-title">
                    <Activity size={24} style={{ marginRight: "10px" }} />
                    System Activity Log
                </h2>

                {/* Scrollable Content */}
                <div className="activity-scroll-area">
                    {activities && activities.length > 0 ? (
                        <div className="activity-timeline">
                            {activities.map((item, index) => (
                                <div key={item._id || index} className="timeline-item">
                                    <div className="timeline-icon">
                                        {getActionIcon(item.action)}
                                    </div>
                                    <div className="timeline-content">
                                        <p className="timeline-desc">
                                            {item.description}
                                        </p>
                                        <span className="timeline-time">
                                            <Clock size={12} style={{marginRight: '4px'}} />
                                            {new Date(item.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-activities">
                            <Info size={20} />
                            <p>No recent activity found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ActivityLogModal;