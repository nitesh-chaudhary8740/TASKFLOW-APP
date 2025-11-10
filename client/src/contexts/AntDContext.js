/* eslint-disable no-unused-vars */
import { createContext } from "react";

/**
 * The AntDContext provides access to Ant Design's global message and 
 * notification APIs (created via useMessage/useNotification hooks).
 * * Default values are set to empty functions with correct parameter signatures
 * for documentation and IntelliSense.
 */
export const AntDContext = createContext({
    // --- Message Methods (Ephemeral Alerts) ---
    // Parameters: content (string), duration (number in seconds)
    showMessage: (type, content, duration) => {}, 
    showSuccess: (content, duration) => {},
    showError: (content, duration) => {},
    showWarning: (content, duration) => {},
    showInfo: (content, duration) => {},
 /**
     * Shows a persistent notification in the corner of the screen.
     * @param {string} type - 'success', 'error', 'warning', 'info'
     * @param {string} title - The title/header of the notification
     * @param {string} description - The main content of the notification
     * @param {string} placement - 'topRight', 'topLeft', etc. (default: 'topRight')
     */
    // --- Notification Method (Persistent Corner Alerts) ---
    // Parameters: type (string), title (string), description (string), placement (string)
    showNotification: (type, title, description, placement) => {}, 
});