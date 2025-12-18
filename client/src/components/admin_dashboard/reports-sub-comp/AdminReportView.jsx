import React, { useContext, useEffect, useState, useCallback } from 'react';
import "./AdminReportView.css";
import { AdminDashBoardContext } from '../../../contexts/AdminDashBoardContext';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, FileText, User, Briefcase, Clock, Info, Code } from 'lucide-react';

function AdminReportView() {
    const { 
        handleChangeActiveLink, 
        returnFetchedReportById, 
        approveReport, 
        rejectReport, 
        undoReport 
    } = useContext(AdminDashBoardContext);

    const { reportId } = useParams();
    const navigate = useNavigate();

    const [report, setReport] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // 1. Memoized Fetch Function
    const fetchReport = useCallback(async () => {
        setIsLoading(true);
        try {
            const fetchedReport = await returnFetchedReportById(reportId);
            if (fetchedReport) {
                setReport(fetchedReport);
            }
        } catch (error) {
            console.error("Error fetching report:", error);
        } finally {
            setIsLoading(false);
        }
    }, [reportId, returnFetchedReportById]);

    // 2. Initial Setup
    useEffect(() => {
        handleChangeActiveLink(3);
    }, []);

    useEffect(() => {
        if (!report) {
            fetchReport();
        }
    }, [fetchReport, report]);

    // 3. Action Handlers (Waiting for Promises)
    const handleApprove = async () => {
        const isApproved = await approveReport(report._id);
        if (isApproved) fetchReport();
    };

    const handleReject = async () => {
        const isRejected = await rejectReport(report._id);
        if (isRejected) fetchReport();
    };

    const handleUndo = async () => {
        const isUndone = await undoReport(report._id);
        if (isUndone) fetchReport();
    };

    // 4. Helper for Formatting Dates
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

    // 5. Loading and Error States
    if (isLoading && !report) {
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
                    <button onClick={() => navigate("/admin-dashboard/reports")} className="back-button" style={{ marginLeft: '10px' }}>
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const status = report.status || 'SUBMITTED';

    return (
        <div className="report-details-container">
            {/* Breadcrumb */}
            <div className="report-breadcrumb">
                <button onClick={() => navigate("/admin-dashboard/reports")} className="back-button">
                    <ChevronLeft size={20} />
                    Reports
                </button>
                <span>/ {report.reportTitle}</span>
            </div>

            {/* Header Area */}
            <div className="report-header">
                <h1 className="report-title">
                    <FileText size={32} style={{ marginRight: '10px' }} />
                    {report.reportTitle}
                    <span className="report-id-subtle">
                        (ID: {report._id?.slice(-6) || 'N/A'})
                    </span>
                </h1>

                <div className="action-button-group">
                    <div className={`report-status-badge status-${status.toLowerCase()}`}>
                        {status}
                    </div>

                    {/* Logic for Approval/Undo */}
                    {status === "ACCEPTED" ? (
                        <button className='disapprove-btn' onClick={handleUndo}>
                            Undo Approval
                        </button>
                    ) : (
                        <button 
                            className='approve-btn' 
                            onClick={handleApprove}
                            disabled={status === "REJECTED"}
                        >
                            Approve Report
                        </button>
                    )}

                    {/* Logic for Rejection/Undo */}
                    {status === "REJECTED" ? (
                        <button className='disapprove-btn' onClick={handleUndo}>
                            Undo Rejection
                        </button>
                    ) : (
                        <button 
                            className='reject-btn' 
                            onClick={handleReject}
                            disabled={status === "ACCEPTED"}
                        >
                            Reject Report
                        </button>
                    )}
                </div>
            </div>

            <hr className="separator" />

            {/* Metadata Grid */}
            <div className="info-grid">
                <div className="info-item full-width-line">
                    <Code size={18} className="info-icon" />
                    <strong>Task ID:</strong>
                    <span>{report.task?.id || 'N/A'}</span>
                </div>

                <div className="info-item full-width-line">
                    <Briefcase size={18} className="info-icon" />
                    <strong>Task Name:</strong>
                    <span>{report.task?.name || 'N/A'}</span>
                </div>

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

            {/* Detailed Description Section */}
            <div className="report-description-section">
                <h3><FileText size={20} style={{ marginRight: '5px' }} />Detailed Summary</h3>
                <div className="report-description-box">
                    <p>{report.reportDescription || "No detailed summary provided."}</p>
                </div>
            </div>
        </div>
    );
}

export default AdminReportView;