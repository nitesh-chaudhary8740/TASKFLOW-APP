const express = require("express");
const { employeeRegistration, adminLogin ,taskCreation, fetchAllTasks, fetchAllEmployees, fetchAdminMetaData, fetchAllPendingTasks, assignTask, deleteTask, deleteEmployee} = require("../controllers/admin.controller");
const adminRouter = express.Router();
adminRouter.route('/login').post(adminLogin)
adminRouter.route('/emp-create').post(employeeRegistration)
adminRouter.route('/task-create').post(taskCreation)
adminRouter.route('/employees').get(fetchAllEmployees)
adminRouter.route('/tasks').get(fetchAllTasks)
adminRouter.route('/pending-tasks').get(fetchAllPendingTasks)
adminRouter.route('/metadata').get(fetchAdminMetaData)
adminRouter.route('/assign-task/:empId/:taskId').post(assignTask)
adminRouter.route('/delete-task/:taskId').delete(deleteTask)
adminRouter.route('/delete-employee/:empId').delete(deleteEmployee)
module.exports = adminRouter