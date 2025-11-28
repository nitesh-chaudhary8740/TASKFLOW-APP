const express = require("express");

const { employeeRegistration, adminLogin ,taskCreation, fetchAllTasks, fetchAllEmployees, fetchAdminMetaData, fetchAllPendingTasks, assignTask, deleteTask, deleteEmployee, unAssignTask, upDateEmployeeDetails, updateTask, bulkDeleteTasks, bulkAssignTasks, bulkUnassignTasks} = require("../controllers/admin.controller");
const verifyJWT = require("../middlewares/auth.middleware.js");
const adminRouter = express.Router();
adminRouter.route('/login').post(verifyJWT,adminLogin)
//protected routes
adminRouter.route('/emp-create').post(employeeRegistration)
adminRouter.route('/emp-update/:id').put(upDateEmployeeDetails)
adminRouter.route('/task-create').post(taskCreation)
adminRouter.route('/task-update/:taskId').put(updateTask)
adminRouter.route('/employees').get(fetchAllEmployees)
adminRouter.route('/tasks').get(fetchAllTasks)
adminRouter.route('/pending-tasks').get(fetchAllPendingTasks)
adminRouter.route('/metadata').get(fetchAdminMetaData)
adminRouter.route('/assign-task/:empId/:taskId').post(assignTask)
adminRouter.route('/unassign-task/:taskId').patch(unAssignTask)
adminRouter.route('/delete-task/:taskId').delete(deleteTask)
adminRouter.route('/delete-employee/:empId').delete(deleteEmployee)
adminRouter.route('/bulk-delete-tasks').delete(bulkDeleteTasks)
adminRouter.route('/bulk-assign-tasks/:empId').patch(bulkAssignTasks)
adminRouter.route('/bulk-unassign-tasks').patch(bulkUnassignTasks)
module.exports = adminRouter