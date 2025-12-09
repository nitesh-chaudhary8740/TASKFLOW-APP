const express = require("express");
const { employeeLogin, fetchEmployeeTasks, startWorking, stopWorking,fetchTask, submitedReport,  fetchEmployeeReports, fetchReport, updateEmployeeProfile, verifyCurrentPassword, changePassword, } = require("../controllers/employee.controller");

const empRouter = express.Router()
empRouter.route('/login').post(employeeLogin)
empRouter.route('/employee-tasks/:empId').get(fetchEmployeeTasks)
empRouter.route('/fetch-employee-reports/:empId').get(fetchEmployeeReports)
empRouter.route('/start-working/:taskId').put(startWorking)
empRouter.route('/stop-working/:taskId').put(stopWorking)
empRouter.route('/fetch-task/:taskId').get(fetchTask)
empRouter.route('/fetch-report/:reportId').get(fetchReport)
empRouter.route('/submit-report').post(submitedReport)
empRouter.route('/update-profile/:empId').put(updateEmployeeProfile)
empRouter.route('/verify-password/:empId').post(verifyCurrentPassword)
empRouter.route('/change-password/:empId').put(changePassword)
module.exports = empRouter