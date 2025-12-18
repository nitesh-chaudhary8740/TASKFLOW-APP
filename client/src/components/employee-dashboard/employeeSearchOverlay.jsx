import React, { useContext } from "react";
import { FileText, X } from "lucide-react"; // Import X icon
import { useNavigate } from "react-router-dom";
import { EmployeeDashboardContext } from "../../contexts/EmployeeDashboardContext";
import "./SearchResultsOverlay.css"

export const EmpSearchResultsOverlay = ({ searchTerm, onClose }) => {
  const { employeeAllTasks } = useContext(EmployeeDashboardContext);
  const navigate = useNavigate();

  const stopScrollPropagation = (e) => e.stopPropagation();

  return (
    <div 
      className="emp-search-results-overlay"
      onWheel={stopScrollPropagation}
      onTouchMove={stopScrollPropagation}
    >
      {/* ❌ PERSISTENCE CONTROL: CLOSE BUTTON */}
      <div className="emp-overlay-header">
        <span>Search Results</span>
        <button className="emp-close-overlay" onClick={onClose}>
          <X size={16} />
        </button>
      </div>

      <div className="emp-results-list">
        {/* If no search term */}
        {!searchTerm && (
           <div className="emp-no-results">Start typing to search tasks.</div>
        )}

        {/* Filtered Logic */}
        {searchTerm && employeeAllTasks
          .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
          .map((item) => (
            <div
              key={item._id}
              className="emp-result-item"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`task-details/${item._id}`);
                onClose(); // Close after navigation
              }}
            >
              <FileText size={16} className="emp-result-icon emp-task-icon" />
              <div className="emp-item-details">
                <div className="emp-item-title">{item.name}</div>
                <div className="emp-item-subtitle">
                  ID: {item._id.slice(-6)}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};