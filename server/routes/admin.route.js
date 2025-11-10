const express = require("express");
const { employeeRegistration, adminLogin ,taskCreation, fetchAllTasks, fetchAllEmployees, fetchAdminMetaData, fetchAllPendingTasks, assignTask} = require("../controllers/admin.controller");
const router = express.Router();
router.route('/login').post(adminLogin)
router.route('/emp-create').post(employeeRegistration)
router.route('/task-create').post(taskCreation)
router.route('/employees').get(fetchAllEmployees)
router.route('/tasks').get(fetchAllTasks)
router.route('/pending-tasks').get(fetchAllPendingTasks)
router.route('/metadata').get(fetchAdminMetaData)
router.route('/asign-task/:taskId/:empId').post(assignTask)
module.exports = router