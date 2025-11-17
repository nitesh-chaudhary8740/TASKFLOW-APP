import { RefreshCcwIcon } from "lucide-react";
import React from "react";

function EmpFilterGroup({ filterOptions, setFilterOptions,sortOptions,setSortOptions }) {
  return (
    <div className="controls-container">
      <div className="task-search-bar-group">
        <input
          type="text"
          placeholder="Search tasks by name or ID..."
          className="alltasks-search-input"
          // onChange={(e) => setSearchTerm(e.target.value)} // Logic placeholder
        />
        {/* <div className="radio-filter-group">
          <span className="radio-label">Assignment:</span>
          <div className="radio-options-wrapper">
            <label
              className={`radio-option ${
                filterOptions.isAssigned === "all" ? "active-all" : ""
              }`}
            >
              <input
                type="radio"
                name="isAssignedFilter"
                value="all"
                checked={filterOptions.isAssigned === "all"}
                onChange={(e) =>
                  setFilterOptions((prev) => ({
                    ...prev,
                    isAssigned: e.target.value,
                  }))
                }
                className="hidden-radio"
              />
              All
            </label>
            <label
              className={`radio-option assigned ${
                filterOptions.isAssigned === "true" ? "active-assigned" : ""
              }`}
            >
              <input
                type="radio"
                name="isAssignedFilter"
                value="true"
                checked={filterOptions.isAssigned === "true"}
                onChange={(e) =>
                  setFilterOptions((prev) => ({
                    ...prev,
                    isAssigned: e.target.value,
                  }))
                }
                className="hidden-radio"
              />
              Assigned
            </label>
            <label
              className={`radio-option unassigned ${
                filterOptions.isAssigned === "false" ? "active-unassigned" : ""
              }`}
            >
              <input
                type="radio"
                name="isAssignedFilter"
                value="false"
                checked={filterOptions.isAssigned === "false"}
                onChange={(e) =>
                  setFilterOptions((prev) => ({
                    ...prev,
                    isAssigned: e.target.value,
                  }))
                }
                className="hidden-radio"
              />
              Unassigned
            </label>
          </div>
        </div> */}
        <div className="filter-group">
     <select name="by" id="sort-by" className="filter-select" 
     value={sortOptions.by}
     onChange={(e)=>{
        setSortOptions(prev=>({...prev,by:e.target.value}))
     }}
     
     >
                <option  value="none">Sort by ⇅</option>
                <option value="name">Name</option>
                <option value="priority">Priority</option>
                <option value="dueDate">Date</option>
            </select>
        <select name="sortBy" id="sort-by" className="filter-select" 
        value={sortOptions.order}
          onChange={(e)=>{
        setSortOptions(prev=>({...prev,order:e.target.value}))
     }}
        >
                <option  value="none">Order</option>
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
            </select>
        </div>
      </div>

      <div className="filter-group">
        {/* Status Filter */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor:"pointer"
          }}
        >
         <span title="Reset filter">
           <RefreshCcwIcon 
            onClick={() => {
              setFilterOptions(prev=>({
                ...prev,
                priority: "all",
                status: "all",
              }));
            }}
          />
            </span>
        </div>
        <select
          className="filter-select"
        //   defaultValue="all"
        value={filterOptions.status}
          onChange={(e) => {
            setFilterOptions((prev) => ({
              ...prev,
              status: e.target.value,
            }));
          }}
        >
          <option value="all">Filter by Status</option>
          <option value="in-progress">In Progress</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="on-hold">On Hold</option>
        </select>

        {/* Priority Filter */}
        <select
          className="filter-select"
        //   defaultValue="all"
        value={filterOptions.priority}
          onChange={(e) => {
            setFilterOptions((prev) => ({
              ...prev,
              priority: e.target.value,
            }));
          }}
        >
          <option value="all">Filter by Priority</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        {/* NEW: Assignment Radio Filter */}
      </div>
    </div>
  );
}

export default EmpFilterGroup;
