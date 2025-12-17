const express = require("express");

const { employeeRegistration, adminLogout,adminLogin ,taskCreation, fetchAllTasks, fetchAllEmployees, fetchAdminMetaData, fetchAllPendingTasks, assignTask, deleteTask, deleteEmployee, unAssignTask, upDateEmployeeDetails, updateTask, bulkDeleteTasks, bulkAssignTasks, bulkUnassignTasks, currentUser, fetchAllReports, approveReport, rejectReport, undoReport} = require("../controllers/admin.controller");
const verifyJWT = require("../middlewares/auth.middleware.js");

const adminRouter = express.Router();
adminRouter.route('/login').post(adminLogin)
//protected routes
adminRouter.route('/logout').post(adminLogout)
adminRouter.route('/current-user').get(verifyJWT,currentUser)
adminRouter.route('/emp-create').post(verifyJWT,employeeRegistration)
adminRouter.route('/emp-update/:id').put(verifyJWT,upDateEmployeeDetails)
adminRouter.route('/task-create').post(verifyJWT,taskCreation)
adminRouter.route('/task-update/:taskId').put(verifyJWT,updateTask)
adminRouter.route('/employees').get(verifyJWT,fetchAllEmployees)
adminRouter.route('/tasks').get(verifyJWT,fetchAllTasks)
adminRouter.route('/reports').get(verifyJWT,fetchAllReports)
adminRouter.route('/pending-tasks').get(verifyJWT,fetchAllPendingTasks)
adminRouter.route('/metadata').get(verifyJWT,fetchAdminMetaData)
adminRouter.route('/assign-task/:empId/:taskId').post(verifyJWT,assignTask)
adminRouter.route('/unassign-task/:taskId').patch(verifyJWT,unAssignTask)
adminRouter.route('/delete-task/:taskId').delete(verifyJWT,deleteTask)
adminRouter.route('/delete-employee/:empId').delete(verifyJWT,deleteEmployee)
adminRouter.route('/bulk-delete-tasks').delete(verifyJWT,bulkDeleteTasks)
adminRouter.route('/bulk-assign-tasks/:empId').patch(verifyJWT,bulkAssignTasks)
adminRouter.route('/bulk-unassign-tasks').patch(verifyJWT,bulkUnassignTasks)
adminRouter.route('/approve-report').put(verifyJWT,approveReport)
adminRouter.route('/reject-report').put(verifyJWT,rejectReport)
adminRouter.route('/undo-report').put(verifyJWT,undoReport)
module.exports = adminRouter