import React from 'react'
import { filterTasks } from '../../../utils/filter_and_sorting';
import { ListChecks } from 'lucide-react';
 
function EmpMyTasksCategory({tasks,setFilterOptions,selectedTaskCategory,setSelectedTaskCategory,taskCategories}) {

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
  return (
    <>
    <div className="task-categories-create-task">
        
        <div className="task-categories-btns">
        {TaskCategories}
        </div>

        </div>
        <h1 className="task-list-title">
          <ListChecks size={32} style={{ marginRight: "10px" }} />
       
          {`${selectedTaskCategory} (${filterTasks.length})`}

        </h1>
    </>
  )
}

export default EmpMyTasksCategory
