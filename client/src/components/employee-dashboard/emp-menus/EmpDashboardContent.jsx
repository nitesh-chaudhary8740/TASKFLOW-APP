import React, { useEffect } from "react";
import "./EmployeeDashboardContent.css";
import StatCard from "./emp-dashboard-content-sub-comp/StatCard";
import QuickActions from "./emp-dashboard-content-sub-comp/QuickActions";
import { useContext } from "react";
import { EmployeeDashboardContext } from "../../../contexts/EmployeeDashboardContext";
import OngoingTasksTable from "./emp-dashboard-content-sub-comp/OngoingTasksTable";
import ProfileSummary from "./emp-dashboard-content-sub-comp/ProfileSummary";

// --- MAIN DASHBOARD COMPONENT ---
export default function EmployeeDashboardContent() {
    const { user ,handleChangeActiveLink} = useContext(EmployeeDashboardContext);
    const todayDate = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
    });
useEffect(()=>{
handleChangeActiveLink(0)
},[])
    // NOTE: user.current should be checked for existence before accessing properties
    const greetingName = user?.current?.fullName?.split(" ")[0]?.toUpperCase() || "EMPLOYEE";

    return (
        <div className="dashboard-layout">
            <header className="dashboard-header">
                <div>

                <h1 className="dashboard-title">
                    Welcome back, {greetingName}!
                </h1>
                <p className="dashboard-date">{todayDate}</p>
                </div>
                <div>
                <ProfileSummary/>
                </div>
            </header>
            <StatCard />
          <div className="task-activity-column">
                    {/* <OngoingTasksTable /> */}
                    
                    {/* <RecentActivityBox /> */}
                    <QuickActions />
                
                </div>

          
              
            
       
                {/* Right Column: Quick Actions and Profile (1/3 width on large screens) */}
              

        
        </div>
    );
}