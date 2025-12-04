// src/components/admin/admin-nav-sub-com0/SearchResultsOverlay.jsx

import React, { useContext } from 'react';
import { FileText, User } from 'lucide-react';
import './SearchResultsOverlay.css';
import { AdminDashBoardContext } from '../../../contexts/AdminDashBoardContext';
import { useNavigate } from 'react-router-dom';

export const SearchResultsOverlay = ({ searchTerm }) => {
    const { tasks, allEmployees,selectedEmployee } = useContext(AdminDashBoardContext);
    const navigate = useNavigate()
    // 1. COMBINE and SORT: Merge the two arrays and sort them alphabetically
    const combinedAndSorted = [...tasks, ...allEmployees].sort((a, b) => {
        // Determine the display name for sorting (task uses 'name', employee uses 'fullName')
        const nameA = Object.hasOwn(a, "fullName") ? a.fullName : a.name || "";
        const nameB = Object.hasOwn(b, "fullName") ? b.fullName : b.name || "";
        
        return nameA.localeCompare(nameB);
    });

    // 2. FILTER: Apply search term filter on the combined list
    const filteredResults = combinedAndSorted
        .filter(item => {
            const term = searchTerm.toLowerCase();

            // Employee check (using the distinguishing property 'fullName')
            if (Object.hasOwn(item, "fullName")) { 
                return item.fullName.toLowerCase().includes(term) ||
                       item.userName.toLowerCase().includes(term) ||
                       item.designation.toLowerCase().includes(term);
            }
            
            // Task check (assuming tasks have 'name' as the title/name field)
            if (Object.hasOwn(item, "name")) { 
                // Ensure assignedTo and userName exist before calling toLowerCase()
                const assignedUserName = item.assignedTo?.userName?.toLowerCase() || '';
                
                return item.name.toLowerCase().includes(term) ||
                       assignedUserName.includes(term) ||
                       item._id.toLowerCase().includes(term); // Note: using _id for task search is unusual, but kept from original logic
            }
            return false;
        })
        .slice(0, 5); // Limit to a maximum of 5 results

    // --- JSX Rendering ---

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
        <div className="search-results-overlay">
            <div className="results-list">
                {filteredResults.map((item) => {
                    // Determine if the item is an Employee
                    const isEmployee = Object.hasOwn(item, "fullName");

                    return (
                        // Use item._id as the key, assuming both tasks and employees have it
                        <div key={item._id} className="result-item" onClick={(e)=>{
                            e.stopPropagation()
                            if(isEmployee){
                                console.log("is it invoked")
                                selectedEmployee.current = item;
                                console.log(item)
                                navigate("/admin-dashboard/employee-details")
                            }
                            else{
                                navigate("/admin-dashboard/all-tasks")

                            }
                        }}>
                            {/* Icon based on type */}
                            {isEmployee ? 
                                <User size={16} className="result-icon employee-icon" /> 
                                : 
                                <FileText size={16} className="result-icon task-icon" />
                            }
                            <div className="item-details" onClick={(e)=>{
                            e.stopPropagation()
                            if(isEmployee){
                                console.log("is it invoked")
                                selectedEmployee.current = item;
                                console.log(item)
                                navigate("/admin-dashboard/employee-details")
                            }
                            else{
                                navigate("/admin-dashboard/all-tasks")

                            }
                        }}>
                                {/* Title/Name */}
                                <div className="item-title">{isEmployee ? item.fullName : item.name}</div>
                                
                                {/* Subtitle/Detail */}
                                <div className="item-subtitle">
                                    {isEmployee ? 
                                        item.designation 
                                        : 
                                        `Assigned to: ${item.assignedTo?.userName || 'Unassigned'}`
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