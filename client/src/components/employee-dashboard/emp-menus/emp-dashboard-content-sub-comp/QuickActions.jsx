import React from 'react'
import { Clock,Plus, Send, Zap} from 'lucide-react';
function QuickActions() {
  return (
   <div className="content-box">
        <h2 className="box-title quick-action-title">
            <Zap className="icon-mr" />
            Quick Actions
        </h2>
        
        <div className="emp-quick-action-list">
            <button className="emp-quick-action-btn btn-primary">
                <Clock className="icon-mr" /> Log Work Hours
            </button>
            {/* <button className="quick-action-btn btn-secondary">
                <Send className="icon-mr" /> Request Leave/PTO
            </button> */}
            <button className="emp-quick-action-btn btn-default">
                <Plus className="icon-mr" /> Submit Expense Report
            </button>
        </div>
    </div>
  )
}

export default QuickActions
