import { RefreshCcwIcon } from "lucide-react";
import React from "react";

function AllEmployeesFilterGroup({filterOptions, setFilterOptions,setSearchInput,searchInput }) {
      const roles = ["Manager", "Engineer", "Designer", "Tester", "HR"];
      const Roles = roles.map(role=>
        <option key={`role-${role}`} value={role.toLocaleLowerCase()}>{role}</option>
      )
  return (
    <div className="controls-container">
      <div className="task-search-bar-group">
        <input
          type="text"
          value={searchInput}
          placeholder="Search employee..."
          className="alltasks-search-input"
          onChange={(e) =>
             {setSearchInput(e.target.value)
             }
            } 
        />
        
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
                setFilterOptions({ designation:"all"})
            
            }}
          />
        </div>
        

        {/* Priority Filter */}
        <select
          className="filter-select"
          value={filterOptions}
          onChange={(e)=>{
            setFilterOptions(prev=>({
                ...prev,
                designation:e.target.value
            }))
          }}
        >
          <option value="all">Filter by Designations</option>
          {Roles}
        </select>

        {/* NEW: Assignment Radio Filter */}
      </div>
    </div>
  );
}

export default AllEmployeesFilterGroup;
