import React, { useContext, useEffect, useState } from 'react'
import "./AdminReportView.css"
import { AdminDashBoardContext } from '../../../contexts/AdminDashBoardContext';

import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, FileText, Calendar, User, Briefcase, List, Clock, Info, Code } from 'lucide-react';
function AdminReportView() {
  const { handleChangeActiveLink,returnFetchedReportById,approveReport,rejectReport,undoReport} = useContext(AdminDashBoardContext);


    const { reportId } = useParams(); 
    const navigate = useNavigate();
    
    const [report, setReport] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // 1. Effects (No Change)
    useEffect(() => {
        handleChangeActiveLink(3); 
    }, []);

    useEffect(() => {
        const fetchReport = async () => {
            setIsLoading(true);
            try {
                console.log(reportId)
                const fetchedReport = await returnFetchedReportById(reportId);
                console.log(fetchedReport)
                if (fetchedReport) {
                    setReport(fetchedReport);
                    console.log(fetchedReport)
                }
            } catch (error) {
                console.error("Error fetching report:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (reportId) {
            fetchReport();
        }
    }, [reportId, returnFetchedReportById]);

    // Helper function to format dates
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    
    // 2. Conditional Rendering (No Change)
    if (isLoading) {
        return (
            <div className='report-details-container'>
                <div className="no-task-selected">
                    <Info size={24} style={{ marginRight: '10px' }} />
                    Loading report details...
                </div>
            </div>
        );
    }

    if (!report) {
         return (
            <div className='report-details-container'>
                <div className="no-task-selected">
                    <Info size={24} style={{ marginRight: '10px' }} />
                    Report not found.
                    <button onClick={() => navigate("/admin-dashboard/reports")} className="back-button" style={{marginLeft: '10px'}}>
                        Go Back to Reports List
                    </button>
                </div>
            </div>
        );
    }
    
    const status = report.status || 'Submitted';

    return (
        <div className="report-details-container">
            {/* 1. Breadcrumb Navigation */}
            <div className="report-breadcrumb">
                <button onClick={() => navigate("/admin-dashboard/reports")} className="back-button">
                    <ChevronLeft size={20} />
                    Reports
                </button>
                <span>/ {report.reportTitle}</span>
            </div>

            {/* 2. Header and Status (Title + ID) */}
            <div className="report-header">
                <h1 className="report-title">
                    <FileText size={32} style={{ marginRight: '10px' }} />
                    {report.reportTitle}
                    {/* Report ID next to title, smaller font */}
                    <span className="report-id-subtle">
                        (ID: {report._id?.slice(-6) || 'N/A'})
                    </span>
                </h1>
                <div style={{display:"flex",alignItems:"center", flexDirection:"column",gap:"2vh"}}>

                <div className={`report-status-badge status-${status.toLowerCase()}`}>
                    {status}
                
                </div>
                  {report.status==="ACCEPTED"?  <button className='disapprove-btn' onClick={()=>undoReport(report)}>Undo Approved Report</button>:  <button className='approve-btn' onClick={()=>approveReport(report._id)}>Approve Report</button>
                  }
                  {report.status==="REJECTED"?  <button className='disapprove-btn' onClick={()=>undoReport(report)}>Undo Rejected Report</button>:  
      <button className='reject-btn'
                  onClick={()=>rejectReport(report._id)}
                  >Reject Report</button>
                  }
                  
                </div>
            </div>
            
            <hr className="separator" />

            {/* 3. Metadata Rows (The Required Vertical Flow) */}
            <div className="info-grid">
                
                {/* Task ID (Full Width Line) */}
                <div className="info-item full-width-line">
                    <Code size={18} className="info-icon" />
                    <strong>Task ID:</strong>
                    <span>{report.task?.id|| 'N/A'}</span>
                </div>

                {/* Task Name (Full Width Line) */}
                <div className="info-item full-width-line">
                    <Briefcase size={18} className="info-icon" />
                    <strong>Task Name:</strong>
                    <span>{report.task?.name || 'N/A'}</span>
                </div>
                
                {/* Reported By & Reported At (Two items on one line, or stacked if space is tight) */}
                <div className="info-item-group-horizontal">
                    <div className="info-item compact-item">
                        <User size={18} className="info-icon" />
                        <strong>Reported By:</strong>
                        <span>{report?.reportedBy?.fullName || 'Employee'}</span>
                    </div>
                    
                    <div className="info-item compact-item">
                        <Clock size={18} className="info-icon" />
                        <strong>Reported At:</strong>
                        <span>{formatDate(report.createdAt)}</span>
                    </div>
                </div>

            </div>
            
            <hr className="separator" />

            {/* 4. Detailed Description */}
            <div className="report-description-section">
                <h3><FileText size={20} style={{ marginRight: '5px' }} />Detailed Summary</h3>
                <div className="report-description-box">
                    <p>{report.reportDescription || "No detailed summary provided."}</p>
                </div>
            </div>
        </div>
    );
}

export default AdminReportView
