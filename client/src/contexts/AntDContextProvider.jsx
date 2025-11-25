import React from 'react';
import { message, notification } from "antd"; // Import notification
// Assuming AntDContext.js defines the context and useAntDContext hook
import { AntDContext } from './AntDContext.js'; 
  message.config(
        {
            zIndex:999999
        }
    )
// ----------------------------------------------------
// 1. Context Provider Setup
// ----------------------------------------------------
function AntDContextProvider({children}) {
  
    // --- Message API Setup (Ephemeral Alerts) ---
    const [messageApi, msgContextHolder] = message.useMessage();

    // --- Notification API Setup (Persistent Alerts) ---
    const [notificationApi, notifContextHolder] = notification.useNotification();


    // ----------------------------------------------------
    // 2. Message Methods (Exposed via Context)
    // ----------------------------------------------------
    
    const showMessage = (type, content, duration = 3) => {
        messageApi.open({
            type,
            content,
            duration,
        });
    };

    // 4 standard message types
    const showSuccess = (content, duration) => showMessage('success', content, duration);
    const showError = (content, duration) => showMessage('error', content, duration);
    const showWarning = (content, duration) => showMessage('warning', content, duration);
    const showInfo = (content, duration) => showMessage('info', content, duration);

    // ----------------------------------------------------
    // 3. Notification Method (Exposed via Context)
    // ----------------------------------------------------

    /**
     * Shows a persistent notification in the corner of the screen.
     * @param {string} type - 'success', 'error', 'warning', 'info'
     * @param {string} title - The title/header of the notification
     * @param {string} description - The main content of the notification
     * @param {string} placement - 'topRight', 'topLeft', etc. (default: 'topRight')
     */
    const showNotification = (type, title, description, placement = 'topRight') => {
        if (notificationApi[type]) {
            notificationApi[type]({
                message: title,
                description: description,
                placement: placement,
            });
        }
    };


    // ----------------------------------------------------
    // 4. Value Bundle
    // ----------------------------------------------------
    const values = {
        // Message functions
        showSuccess,
        showError,
        showWarning,
        showInfo,

        // Unified Message function (if preferred)
        showMessage, 

        // Notification function
        showNotification,
    };

    return (
        <AntDContext.Provider value={values}>
            {/* Context Holders must be rendered inside the Provider */}
            {msgContextHolder}
            {notifContextHolder} 
            {children}
        </AntDContext.Provider>
    );
}

export default AntDContextProvider;