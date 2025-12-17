import React, { useContext } from 'react'
import "./AdminReports.css"
import { FileText, Calendar, List, Eye } from 'lucide-react';
import { AdminDashBoardContext } from '../../contexts/AdminDashBoardContext';
import { useNavigate } from 'react-router-dom';
function AdminReports() {
const {reports} = useContext(AdminDashBoardContext)
const navigate = useNavigate()
   if (!reports || reports.length === 0) {
        return (
            <div className="report-status-message no-data">
                <FileText size={40} />
                <p>You haven't submitted any reports yet.</p>
            </div>
        );
    }
    const handleViewReport = (reportId)=>{
            navigate(`/admin-dashboard/view-report/${reportId}`)
    }
   const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };
    // 4. Main Content Rendering (Table)
    return (
        <div className="my-reports-container">
            <h1><List size={32} style={{marginRight: '10px'}} />My Submitted Reports</h1>

            <div className="reports-table-wrapper">
                <table className="reports-table">
                    <thead>
                        <tr>
                            <th>SN</th>
                            <th>Task ID</th>
                            <th>Task Name</th>
                            <th>Submission Date</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.map((report, index) => (
                            <tr key={report._id}>
                                <td data-label="SN">{index + 1}</td>
                                
                                {/* Assuming 'report.task' is populated and has an ID */}
                                <td data-label="Task ID">
                                    {report.task?.id || 'N/A'} 
                                </td>
                                
                                {/* Assuming 'report.task' is populated and has a 'name' field */}
                                <td data-label="Task Name">
                                    <strong>{report.task?.name || 'Task Title Missing'}</strong>
                                </td>
                                
                                <td data-label="Submission Date">
                                    <Calendar size={14} style={{ marginRight: '5px' }} />
                                    {formatDate(report.createdAt)}
                                </td>
                                
                                <td data-label="Status">
                                    <span className={`report-status status-${(report.status || 'Submitted').toLowerCase()}`}>
                                        {report.status || 'Submitted'}
                                    </span>
                                </td>
                                
                                <td data-label="Action">
                                    <button 
                                        className="action-view-btn"
                                        onClick={() => handleViewReport(report._id)}
                                    >
                                        <Eye size={16} style={{ marginRight: '5px' }} />
                                        View Report
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}


export default AdminReports
