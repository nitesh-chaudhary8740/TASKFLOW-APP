import React, { useContext } from "react";
import "./Prompt.css";
import { AdminDashBoardContext } from "../../../contexts/AdminDashBoardContext";

/**
 * @typedef {object} PromptData
 * @property {string} message - The message displayed in the modal.
 * @property {() => void} onConfirm - The function to execute when the confirmation button is clicked.
 * @property {'delete'|'unassign'|'warning'} type - The type of prompt, used for styling (e.g., 'delete' for red color).
 * @property {string} [confirmText='Okay'] - Text for the confirmation button.
 * @property {string} [cancelText='Cancel'] - Text for the cancel button.
 */

/**
 * A generic confirmation modal component.
 * @param {{promptData: PromptData}} props
 */
function Prompt({ promptData }) {
  // We only need setIsPromptOpen from the context now.
  // The action function is handled via promptData.onConfirm.
  const { setIsPromptOpen } = useContext(AdminDashBoardContext);

  const handleConfirm = () => {
    // 1. Execute the function passed by the parent
    if (promptData.onConfirm) {
      promptData.onConfirm();
    }
    // 2. Close the modal
    setIsPromptOpen(false);
  };

  const handleCancel = () => {
    setIsPromptOpen(false);
  };

  return (
    <div className="prompt-overlay">
      {/* Use 'type' for styling the card body */}
      <div className={`prompt-card ${promptData?.type || "default"}`}>
        {/* Message */}
        <p className="prompt-message">
          {promptData?.message || "Are you sure you want to proceed?"}
        </p>

        <div className="prompt-actions">
          {/* Cancel Button */}
          <button className="action-button cancel-btn" onClick={handleCancel}>
            {promptData?.cancelText || "Cancel"}
          </button>

          {/* Confirm Button: Uses type for specific styling */}
          <button
            className={`action-button confirm-btn ${
              promptData?.type || "default"
            }`}
            onClick={handleConfirm}
          >
            {promptData?.confirmText || "Okay"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Prompt;
