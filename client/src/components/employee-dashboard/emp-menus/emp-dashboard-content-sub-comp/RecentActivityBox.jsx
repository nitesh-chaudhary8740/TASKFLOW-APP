import React from 'react'
import { CheckCircle, Clock, Calendar, AlertTriangle} from 'lucide-react';
function RecentActivityBox() {
  return (
           <div className="content-box">
                        <h2 className="box-title">
                           Recent Activity</h2>
                        <ul className="activity-list">
                            <li className="activity-item color-green">
                                <CheckCircle className="icon-activity" /> Completed task T-003 'Weekly team sync preparation'.
                            </li>
                            <li className="activity-item color-blue">
                                <Clock className="icon-activity" /> Logged 4 hours on project 'Nexus' yesterday.
                            </li>
                            <li className="activity-item color-orange-icon">
                                <AlertTriangle className="icon-activity" /> New High Priority task T-004 assigned by Manager.
                            </li>
                            <li className="activity-item ">
                                <AlertTriangle className="icon-activity" /> New High Priority task T-004 assigned by Manager.
                            </li>
                        </ul>
                    </div>
  )
}

export default RecentActivityBox
