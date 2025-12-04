import { createContext } from "react";

// The shape of the ConfigOptions object used by configPrompt
/**
 * @typedef {object} ConfigOptions
 * @property {string} msg - The main message to be displayed in the prompt.
 * @property {() => void} onConfirm - The function to execute when the confirmation button is clicked.
 * @property {'delete'|'unassign'|'warning'|'assign'} type - The type of prompt, used for styling and context.
 * @property {string} [confirmText='Okay'] - Optional: Text for the confirmation button.
 * @property {string} [cancelText='Cancel'] - Optional: Text for the cancel button.
 */

export const AdminDashBoardContext = createContext({
  // ... (All your existing state and setters, unchanged)
  triggerRefetch:()=>{},
  isTaskFormOpen: false,
  setIsTaskFormOpen: () => {},
  isCreateEmpFormOpen: false,
  setIsCreateEmpFormOpen: () => {},
  isCreateProjectFormOpen: false,
  setIsCreateProjectFormOpen: () => {},
  adminMetaData: null,
  isEmployeeTasksFormOpen: false,
  setIsEmployeeTasksFormOpen: () => {},
  selectedEmployee: null,
  selectedTask: null,
  acticeNavLink: null, 
  setActiveNavLink: () => {},
  navLinks: [],
  handleChangeActiveLink: () => {},
  setIsAssignEmployeeFormOpen: () => {},
  isTaskDetailsFormOpen: false, 
  setIsTaskDetailsFormOpen: () => {},
  isEmployeeDetailsFormOpen: false,
  setIsEmployeeDetailsFormOpen: () => {},
  tasks: [],
  isLoading: false,
  error: null,
  setTasks: () => {},
  setIsLoading: () => {},
  setError: () => {},
  allEmployees: [],
  setAllEmployees: () => {},
  
  // --- Individual Handlers ---
  /** @param {string} taskId */
  handleUnassignTask: (taskId) => { taskId; },
  /** @param {string} empId */
  handleDeleteEmployee: (empId) => { empId; },
  /** @param {string} taskId */
  handleDeleteTask: (taskId) => { taskId; },
  
  // --- Bulk Handlers ---
  /** @param {Array<string>} taskArr @param {string} empId */
  handleBulkAssignTasks: (taskArr, empId) => { taskArr; empId; },
  /** @param {Array<string>} taskArr */
  handleBulkUnassignTasks: (taskArr) => { taskArr; },
  /** @param {Array<string>} taskArr */
  handleBulkDeleteTasks: (taskArr) => { taskArr; },
  
  // --- Prompt / Modal Handlers ---
  /** @param {ConfigOptions} configOptions */
  configPrompt: (configOptions) => { configOptions },
  setIsPromptOpen: () => {},
  
  // --- Ref Objects ---
  /**
   * @type {React.MutableRefObject<Array<string>>}
   * A ref object holding the array of currently selected task IDs (strings) for bulk actions.
   */
  selectedTasks: { current: [] } // Set default to match useRef([]) initialization
});