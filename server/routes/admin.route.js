const express = require("express");
const { employeeRegistration, adminLogin ,taskCreation, fetchAllTasks, fetchAllEmployees, fetchAdminMetaData, fetchAllPendingTasks, assignTask, deleteTask, deleteEmployee} = require("../controllers/admin.controller");
const router = express.Router();
router.route('/login').post(adminLogin)
router.route('/emp-create').post(employeeRegistration)
router.route('/task-create').post(taskCreation)
router.route('/employees').get(fetchAllEmployees)
router.route('/tasks').get(fetchAllTasks)
router.route('/pending-tasks').get(fetchAllPendingTasks)
router.route('/metadata').get(fetchAdminMetaData)
router.route('/assign-task/:empId/:taskId').post(assignTask)
router.route('/delete-task/:taskId').delete(deleteTask)
router.route('/delete-employee/:empId').delete(deleteEmployee)
module.exports = router