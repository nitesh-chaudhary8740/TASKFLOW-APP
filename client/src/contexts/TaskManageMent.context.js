import { createContext } from "react";
import { USER_ROLES } from "../enums/roles";

export const TASK_MANAGEMENT_HOME = createContext(
    {
    
        selectedAuthRole:null,
        currentUser:null,
        setCurrentUser:()=>{},
       /**
 * @typedef {object} ConfigOptions
 * @property {string} msg - The main message to be displayed in the prompt.
 * @property {() => void} onConfirm - The function to execute when the confirmation button is clicked.
 * @property {() => void} onCancel - The function to execute when the cancellation button is clicked.
 * @property {'delete'|'unassign'|'warning'|'assign'} type - The type of prompt, used for styling and context.
 * @property {string} [confirmText='Okay'] - Optional: Text for the confirmation button.
 * @property {string} [cancelText='Cancel'] - Optional: Text for the cancel button.
 */
 /**
     * Configures and displays the generic confirmation prompt.
     * @param {ConfigOptions} configOptions - The configuration object.
     */

  configPrompt: (configOptions) => { configOptions },
  setIsPromptOpen: () => {},
  updateEmployeeProfile:(profileData)=>{profileData},
 verifyCurrentPassword :(password)=>{password},
changeCurrentPassword :(password)=>{password},

    }
)