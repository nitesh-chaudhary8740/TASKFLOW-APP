import { RefreshCcwIcon } from "lucide-react";
import React from "react";

function AllTasksFilterGroup({ filterOptions, setFilterOptions,setSearchInput,searchInput,selectedTaskCategory }) {
  return (
    <div className="controls-container">
      <div className="task-search-bar-group">
        <input
          type="text"
          value={searchInput}
          placeholder="Search tasks by name or ID..."
          className="alltasks-search-input"
          onChange={(e) =>
             {setSearchInput(e.target.value)
      
             }
            } // Logic placeholder
        />
       {selectedTaskCategory.toLowerCase()==="all" && <div className="radio-filter-group">
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
                onChange={(e) =>{
                  setFilterOptions((prev) => ({
                    ...prev,
                    isAssigned: e.target.value,
                  }))
                }
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
        </div> }
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
          <RefreshCcwIcon
            onClick={() => {
              setFilterOptions(prev=>({
                ...prev,
                priority: "all",
                status: "all",
              }));
            }}
          />
        </div>
        {/* <select
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
          <option value="overdue">Overdue</option>
          <option value="under-review">UnderReview</option>
          <option value="under-review">Blocked</option>
        </select> */}

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

export default AllTasksFilterGroup;
