import React, { useContext } from 'react';
import { FileText, User, X } from 'lucide-react';
import './SearchResultsOverlay.css';
import { AdminDashBoardContext } from '../../../contexts/AdminDashBoardContext';
import { useNavigate } from 'react-router-dom';

export const SearchResultsOverlay = ({ searchTerm, onClose }) => {
    const { tasks, allEmployees, selectedEmployee,selectedTask,setIsTaskDetailsFormOpen} = useContext(AdminDashBoardContext);
    const navigate = useNavigate();

    // Prevent background scroll
    const handleScroll = (e) => e.stopPropagation();

    // 1. COMBINE and SORT
    const combinedAndSorted = [...tasks, ...allEmployees].sort((a, b) => {
        const nameA = Object.hasOwn(a, "fullName") ? a.fullName : a.name || "";
        const nameB = Object.hasOwn(b, "fullName") ? b.fullName : b.name || "";
        return nameA.localeCompare(nameB);
    });

    // 2. FILTER
    const filteredResults = combinedAndSorted
        .filter(item => {
            const term = searchTerm.toLowerCase();
            if (Object.hasOwn(item, "fullName")) { 
                return item.fullName.toLowerCase().includes(term) ||
                       item.userName.toLowerCase().includes(term) ||
                       item.designation.toLowerCase().includes(term);
            }
            if (Object.hasOwn(item, "name")) { 
                const assignedUserName = item.assignedTo?.userName?.toLowerCase() || '';
                return item.name.toLowerCase().includes(term) ||
                       assignedUserName.includes(term) ||
                       item._id.toLowerCase().includes(term);
            }
            return false;
        })
        .slice(0, 5);

    if (!searchTerm) {
        return (
            <div className="search-results-overlay">
                <div className="no-results">Start typing to search tasks and employees.</div>
            </div>
        );
    }
    
    if (filteredResults.length === 0) {
        return (
            <div className="search-results-overlay">
                <div className="no-results">No results found for "{searchTerm}".</div>
            </div>
        );
    }

    return (
        <div 
            className="search-results-overlay" 
            onWheel={handleScroll} 
            onTouchMove={handleScroll}
        >
            {/* Persistence Header */}
            <div className="overlay-header">
                <span>Admin Search</span>
                <button className="close-overlay-btn" onClick={onClose}>
                    <X size={14} />
                </button>
            </div>

            <div className="results-list">
                {filteredResults.map((item) => {
                    const isEmployee = Object.hasOwn(item, "fullName");

                    return (
                        <div 
                            key={item._id} 
                            className="result-item" 
                            onClick={(e) => {
                                e.stopPropagation();
                                if (isEmployee) {
                                    selectedEmployee.current = item;
                                    navigate("/admin-dashboard/employee-details");
                                } else {
                                    selectedTask.current=item
                                    setIsTaskDetailsFormOpen(true)
                                    navigate("/admin-dashboard/all-tasks",{state:{taskHashElement:item}});
                                }
                                if(onClose) onClose(); // Hide after selection
                            }}
                        >
                            {isEmployee ? 
                                <User size={16} className="result-icon employee-icon" /> : 
                                <FileText size={16} className="result-icon task-icon" />
                            }
                            <div className="item-details">
                                <div className="item-title">{isEmployee ? item.fullName : item.name}</div>
                                <div className="item-subtitle">
                                    {isEmployee ? 
                                        item.designation : 
                                        `Assigned: ${item.assignedTo?.userName || 'Unassigned'}`
                                    }
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};