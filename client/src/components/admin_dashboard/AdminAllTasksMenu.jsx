import "../../assets/css/AdminAllTasksMenu.css";

import React, { useContext, useEffect, useState } from "react";
import {ListChecks,Calendar,Edit,Trash2,Loader,AlertCircle,UserPlus,Users,UserMinus, Plus,} from "lucide-react";
import { AdminDashBoardContext } from "../../contexts/AdminDashBoardContext";
import { AntDContext } from "../../contexts/AntDContext";
import { filterTasks } from "../../utils/filter_and_sorting";
import AllTasksFilterGroup from "./alltasks-menu-sub-comp/AllTasksFilterGroup";
import All_Tasks from "./alltasks-menu-sub-comp/All_Tasks";
import { useLocation, useNavigate } from "react-router-dom";


const SortIcon = ({ direction = "none" }) => {
  let color = direction === "none" ? "var(--text-light)" : "var(--primary)";
  let opacity = direction === "none" ? 0.4 : 1;
  let Icon = direction === "asc" ? "▲" : direction === "desc" ? "▼" : "⇅";

  return (
    <span
      style={{
        marginLeft: "5px",
        color,
        opacity,
        transition: "0.2s",
        fontSize: "0.7em",
      }}
    >
      {Icon}
    </span>
  );
};
  const taskCategories = {
    ALL_TASKS:"All",
    PENDING_TASKS:"Pending",
    COMPLTED_TASKS:"Completed",
    IN_PROGRESS_TASKS:"In-Progress",
    UNDER_REVIEW_TASKS:"Under-Review",
    OVERDUE_TASKS:"Overdue",
    BLOCKED_TASKS:"blocked"
    
  }
  
  function AdminAllTasksMenu() {
    const location = useLocation()
    const locationIsAssigned = location?.state?.isAssigned||null
    const locationHasStatus = location?.state?.status||null
    const locationTaskHashElement =location?.state?.taskHashElement||null
  const [isSelecting,setIsSelecting]=useState(false)
  const [selectedTasksArray,setSelectedTasksArray]=useState([])
  const [selectedTaskCategory,setSelectedTaskCategory]=useState(taskCategories.ALL_TASKS)
  const adminContextValues = useContext(AdminDashBoardContext);
  const [fileteredTasks, setFilteredTasks] = useState(adminContextValues.tasks);
  const navigate = useNavigate()
  const [filterOptions, setFilterOptions] = useState({
    priority: "all",
    status: "all",
    isAssigned: "all",
  });
  
  const [searchInput,setSearchInput]=useState("")
  const {tasks,isLoading,error,handleUnassignTask,handleDeleteTask} = useContext(AdminDashBoardContext);
useEffect(()=>{
  if(locationIsAssigned){
   setFilterOptions(prev=>({...prev,isAssigned:locationIsAssigned}))
  }
  if(locationHasStatus){
    setSelectedTaskCategory(taskCategories.UNDER_REVIEW_TASKS)
    setFilterOptions(({
                    priority:"all",
                    isAssigned:"all",
                    status: "UNDER-REVIEW"
                }))
  }
  if(locationTaskHashElement){
    const timer = setTimeout(() => {
        const element = document.getElementById(locationTaskHashElement._id);
        if (element) {
          element.scrollIntoView({ 
            behavior:"smooth",
            block: 'start' // Aligns the top of the element to the top of the viewport
          });
        }
      }, 100); // 100ms is usually enough
       return ()=>{
    clearTimeout(timer)
  }
  }
  adminContextValues.handleChangeActiveLink(2)
 
},[locationTaskHashElement,locationIsAssigned])

  // --- Action Handlers (Moved inside to access AntDContext) ---
  const handleManageTask = (task) => {
    adminContextValues.selectedTask.current = task;
    adminContextValues.setIsTaskDetailsFormOpen(true)
  };

  const handleViewAssignedList = (employee) => {
    adminContextValues.selectedEmployee.current = employee;
      adminContextValues.handleChangeActiveLink(1);
    navigate("/admin-dashboard/employee-details")
  };

  const handleAssignEmployee = (task) => {
  
    adminContextValues.selectedTask.current = task;
    adminContextValues.setIsAssignEmployeeFormOpen(true);
  };
// ... (inside AdminAllTasksMenu function) ...

// --- Helper function to get count for a specific status ---
const getStatusCount = (status) => {
    if (status === taskCategories.ALL_TASKS) {
        return tasks.length;
    }
 
    return tasks.filter(task => task.status.toLowerCase() === status.toLowerCase()).length;
};

// --- Updated TaskCategories rendering with new CSS and Badges ---
const TaskCategories = Object.keys(taskCategories).map(categoryKey => {
    const categoryName = taskCategories[categoryKey];
    const count = getStatusCount(categoryName);
  
    // Determine if the badge should be red (high attention)
    const needsAttention = ['PENDING_TASKS', 'OVERDUE_TASKS', 'UNDER_REVIEW_TASKS'].includes(categoryKey);
    
    const isActive = selectedTaskCategory === categoryName;
  
    
    // Ensure status names are lower-cased and hyphenated for CSS class matching
    const statusClass = categoryName.toLowerCase().replace(/\s+/g, '-'); 
    
    return (
        <button
            key={`category-${categoryKey}`}
            onClick={() => {
                setSelectedTaskCategory(categoryName);
                setFilterOptions(({
                    priority:"all",
                    isAssigned:"all",
                    status: categoryName
                }))
            }}
            className={`task-category-btn task-category-${statusClass} ${isActive ? 'active-category' : ''}`}
        >
            {categoryName}
            {/* Notification Badge */}
            {count > 0 && (
                <span className={`task-badge ${needsAttention ? 'badge-attention' : 'badge-neutral'}`}>
                    {count}
                </span>
            )}
        </button>
    );
});
  // useEffect for filter
  
  useEffect(() => {
    // The filterTasks utility is called whenever the source tasks or filter options change.
  const seachTerms = ()=>{
  if(searchInput==="") {
    return [...tasks]
  }
  const searchResults = (tasks).filter(task=>
  task.name.toLowerCase().includes(searchInput.toLowerCase())||
  task.dueDate.toLowerCase().includes(searchInput.toLowerCase())||
  (task.id.toLowerCase().includes(searchInput.toLowerCase()))
  )
  return searchResults;
  }
    const tasksForFilter = seachTerms() //this function will return the array for filter
    //because filter must be perfomed on the searchTasks, not all availble,
    //if seachbox is empty then filter will apply on all tasks, else on the search results
   setFilteredTasks (filterTasks(tasksForFilter, setFilteredTasks, filterOptions));
  }, [tasks, filterOptions,searchInput]);
useEffect(()=>{

},[searchInput])
 

  // --- DELETE Task Handler (With Optimistic Update and Rollback) ---
 


  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <div className="task-menu-container loading-state">
        <Loader size={32} className="spinner" />
        <p>Loading task data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="task-menu-container error-state">
        <AlertCircle size={32} color="#ef4444" />
        <h2>Error Loading Data</h2>
        <p>Could not fetch task list. Details: {error}</p>
        <p className="mock-warning">Displaying mock data for development.</p>
      </div>
    );
  }

  return (
    <>
      <div className="task-menu-container">
        <div className="task-categories-create-task">
          

        <button className="task-category-btn create-task-btn"
        onClick={()=>{
          adminContextValues.setIsTaskFormOpen(true)
        }}
        >Create new task +</button>
        
        <div className="task-categories-btns">
        {TaskCategories}
        </div>

        </div>
        <h1 className="task-list-title">
          <ListChecks size={32} style={{ marginRight: "10px" }} />
       
          {selectedTaskCategory}
          {(selectedTaskCategory===taskCategories.ALL_TASKS&&filterOptions.isAssigned==='true')&& " Assigned "} 
          {(selectedTaskCategory===taskCategories.ALL_TASKS&&filterOptions.isAssigned==='false')&& " Unassigned "} 
          ({selectedTaskCategory===taskCategories.ALL_TASKS&&filterOptions.isAssigned==="all"?`${tasks.length}`:`${fileteredTasks.length}`})
        </h1>
        {/* --- Filters and Sort Controls UI --- */}
      <AllTasksFilterGroup filterOptions={filterOptions} setFilterOptions={setFilterOptions} searchInput={searchInput} setSearchInput={setSearchInput} selectedTaskCategory={selectedTaskCategory}/>
        {/* --- END NEW UI --- */}
    <All_Tasks 
    fileteredTasks ={fileteredTasks} 
    tasks={tasks} 
    SortIcon={SortIcon}
    handleAssignEmployee={handleAssignEmployee}
    handleDeleteTask={handleDeleteTask}
    handleUnassignTask = {handleUnassignTask}
    handleManageTask={handleManageTask}
    handleViewAssignedList = {handleViewAssignedList}
    formatDate = {formatDate}
    isSelecting ={isSelecting}
    setIsSelecting ={setIsSelecting}
    selectedTaskCategory={selectedTaskCategory}
    selectedTasksArray={selectedTasksArray}
    setSelectedTasksArray={setSelectedTasksArray}
    filterOptions={filterOptions}
     />
     
      </div>
    </>
  );
}

export default AdminAllTasksMenu;
