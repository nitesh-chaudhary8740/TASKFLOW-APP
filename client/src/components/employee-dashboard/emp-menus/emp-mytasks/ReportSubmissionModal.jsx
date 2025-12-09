import React, { useContext, useState } from 'react';
import { X, Send, FileText } from 'lucide-react';
import './ReportSubmissionModal.css'; 
import { EmployeeDashboardContext } from '../../../../contexts/EmployeeDashboardContext';

const ReportSubmissionModal = () => {
    const {selectedTask,setIsReportFormOpen,submitReport} = useContext(EmployeeDashboardContext)
    const task = selectedTask.current
    const [reportTitle, setReportTitle] = useState('');
    const [reportDescription, setReportDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onClose = ()=>{
        setIsReportFormOpen(false)
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!reportTitle.trim() || !reportDescription.trim()) {
            alert("Title and Description are required.");
            return;
        }

        setIsSubmitting(true);

        const reportData = {
            reportTitle,
            reportDescription,
            taskId: task._id,          
        };
        
        try {
        const isSubmitted =  await submitReport(reportData); //why it doesn't wait the result
        console.log(isSubmitted,"rpomise") //and jumps here
           if(isSubmitted){
            setReportTitle('');
            setReportDescription('');
           }
            // setReportTitle('');
            // setReportDescription('');
            // // onClose(); // Close the modal
        } catch (error) {
            console.error("Report submission failed:", error);
            alert("Failed to submit report. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <div className="modal-header">
                    <h2 className="modal-title">
                        <FileText size={24} style={{ marginRight: '10px' }} />
                        Submit Report for: {task.id}
                    </h2>
                  
                    <button className="close-btn" onClick={onClose} disabled={isSubmitting}>
                        <X size={24} />
                    </button>
                </div>
                <span style={{display:"flex", alignItems:"center",gap:"2vh"}}>
  
                    <h4>Task: </h4> <span>{task.name}</span>
                    </span>  
  {/* <hr /> */}
                <form className="report-form" onSubmit={handleSubmit}>
                    
                    {/* Report Title */}
                    <div className="form-group">
                        <label htmlFor="reportTitle">Report Title</label>
                        <input
                            id="reportTitle"
                            type="text"
                            placeholder="Report title..."
                            value={reportTitle}
                            onChange={(e) => setReportTitle(e.target.value)}
                            required
                            maxLength={100}
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Report Description */}
                    <div className="form-group">
                        <label htmlFor="reportDescription">Detailed Summary / Outcome</label>
                        <textarea
                            id="reportDescription"
                            placeholder="Report description..."
                            value={reportDescription}
                            onChange={(e) => setReportDescription(e.target.value)}
                            rows={6}
                            required
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Footer and Submit Button */}
                    <div className="modal-footer">
                        <button 
                            type="button" 
                            className="cancel-btn" 
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="submit-btn" 
                            disabled={isSubmitting}
                        >
                            <Send size={18} style={{ marginRight: '8px' }} />
                            {isSubmitting ? 'Submitting...' : 'Submit Final Report'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReportSubmissionModal;