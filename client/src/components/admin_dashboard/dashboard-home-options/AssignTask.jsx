import React, { useContext, useEffect, useState } from 'react';
import { X, Search, ListChecks, UserPlus, Info, Loader } from 'lucide-react';
// Assuming this context provides the state control for opening/closing this modal
import { AdminDashBoardContext } from '../../../contexts/AdminDashBoardContext'; 
import axios from 'axios';
import './AssignTask.css'; // Import the CSS file

const getMockTasks = () => ([
    { id: 101, name: "Implement User Authentication", description: "Set up login/signup flow.", priority: "High" },
    { id: 102, name: "Design Landing Page Mockup", description: "Create initial layout in Figma.", priority: "Medium" },
    { id: 103, name: "Bug Fix: Shopping Cart", description: "Resolve checkout error on mobile.", priority: "High" },
    { id: 104, name: "Review Q4 Budget", description: "Finalize financial report.", priority: "Medium" },
    { id: 105, name: "Set up CI/CD Pipeline", description: "Automate deployment process.", priority: "High" },
]);

export const AssignTask = () => {
    // Assuming the context provides 'setIsAssignTaskOpen'
    const values = useContext(AdminDashBoardContext); 

    const [allTasks, setAllTasks] = useState([]);
    const [filteredTasks, setFilteredTasks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // 1. Fetch Tasks (Mocked for structure)
    useEffect(() => {
        const fetchTasks = async () => {
            setIsLoading(true);
            try {
                // In a real application, you would fetch tasks that need assigning
                const response = await axios.get(`${import.meta.env.VITE_API_URL}/pending-tasks`);
                
                // Using mock data for immediate functionality
                // const fetchedTasks = getMockTasks();
                 console.log(response)
                const fetchedTasks = response.data
                setAllTasks(fetchedTasks);
                setFilteredTasks(fetchedTasks);
                setError(null);
            } catch (err) {
                console.error("Error fetching tasks:", err);
                setError("Failed to load tasks. Displaying mock data.");
                const mockTasks = getMockTasks();
                setAllTasks(mockTasks);
                setFilteredTasks(mockTasks);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTasks();
    }, []);

    // 2. Filter Tasks based on search term
    useEffect(() => {
        if (!searchTerm) {
            setFilteredTasks(allTasks);
            return;
        }
        const lowerCaseSearch = searchTerm.toLowerCase();
        const results = allTasks.filter(task =>
            task.name.toLowerCase().includes(lowerCaseSearch) ||
            task.description.toLowerCase().includes(lowerCaseSearch)
        );
        setFilteredTasks(results);
    }, [searchTerm, allTasks]);


    // 3. Handle Assignment Action
    const handleAssign =async (task) => {
        console.log(values.selectedEmployee.current)
        console.log(`Attempting to assign employee to task: ${task.name} (ID: ${task._id})`);
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/assign-task/${values.selectedEmployee.current}/${task._id}`);
            console.log(response)
        } catch (error) {
            console.log(error)
        }
        // In a real application, this would open a sub-modal to select an employee
        alert(`Opened Employee Selector for Task: "${task.name}".`);

        // Close this modal upon successful selection/assignment (optional)
        // values.setIsAssignTaskOpen(false); 
    };
    
    // 4. Handle Modal Close
    const handleClose = () => {
        // Assuming the context state variable is named 'setIsAssignTaskOpen'
        values.setIsAssignTaskFormOpen(false)
    }


    return (
        <div className="modal-overlay"> 
            <div className="assign-task-container modal-content"> 
                
                {/* Close Button */}
                <button 
                    className="modal-close-btn" 
                    onClick={handleClose} 
                    title="Close Assignment Form"
                >
                    <X size={24} />
                </button>

                <h2 className="form-title">
                    <UserPlus size={24} style={{ marginRight: '10px' }} />
                    Assign Employee to Task
                </h2>
                
                {error && <div className="form-message error">{error}</div>}

                {/* Search Bar */}
                <div className="search-bar-group">
                    <Search size={20} className="assign-search-icon" />
                    <input
                        type="text"
                        placeholder="Search tasks by name or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="assign-search-input"
                    />
                </div>

                {isLoading ? (
                    <div className="task-list-state loading-state">
                        <Loader size={32} className="spinner" />
                        <p>Loading available tasks...</p>
                    </div>
                ) : (
                    <div className="task-list">
                        {filteredTasks.length === 0 && allTasks.length > 0 && (
                            <div className="task-list-state no-results">
                                <Info size={24} />
                                <p>No tasks match your search term.</p>
                            </div>
                        )}
                        {filteredTasks.length === 0 && allTasks.length === 0 && (
                            <div className="task-list-state no-data">
                                <ListChecks size={24} />
                                <p>All tasks have been assigned!</p>
                            </div>
                        )}
                        
                        {filteredTasks.map(task => (
                            <div key={task.id} className="task-item">
                                <div className="task-info">
                                    <h4 className="task-name">{task.name}</h4>
                                    <p className="task-description">{task.description}</p>
                                    <span className={`priority-tag ${task.priority.toLowerCase()}`}>
                                        {task.priority} Priority
                                    </span>
                                </div>
                                <button 
                                    className="assign-action-btn"
                                    onClick={() => handleAssign(task)}
                                >
                                    <UserPlus size={18} />
                                    Assign
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};