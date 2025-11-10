import React, { useContext, useState, useEffect } from "react";
import { TASK_MANAGEMENT_HOME } from "../../contexts/TaskManageMent.context";
import { USER_ROLES } from "../../enums/roles.js";

function Roles() {
  // State to track the active role, defaulting to ADMIN
  const [activeRole, setActiveRole] = useState(USER_ROLES.ADMIN);
  const values = useContext(TASK_MANAGEMENT_HOME);

  // Update context whenever the active role changes
  useEffect(() => {
    values.selectedAuthRole.current = activeRole;
  }, [activeRole, values.selectedAuthRole]);

  const roleSelection = (role) => {
    setActiveRole(role);
  };

  return (
    <div className="role-selection">
      <button
        // ✅ Conditional Class Toggling: applies 'active' if true
        className={`role-button ${
          activeRole === USER_ROLES.ADMIN ? "active" : ""
        }`}
        id="admin-btn"
        onClick={() => roleSelection(USER_ROLES.ADMIN)}
      >
        Admin
      </button>
      <button
        // ✅ Conditional Class Toggling
        className={`role-button ${
          activeRole === USER_ROLES.EMPLOYEE ? "active" : ""
        }`}
        id="employee-btn"
        onClick={() => roleSelection(USER_ROLES.EMPLOYEE)}
      >
        Employee
      </button>
    </div>
  );
}

export default Roles;
