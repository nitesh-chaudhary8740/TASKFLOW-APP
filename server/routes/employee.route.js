const express = require("express");
const { employeeLogin, fetchEmployeeTasks, startWorking } = require("../controllers/employee.controller");

const empRouter = express.Router()
empRouter.route('/login').post(employeeLogin)
empRouter.route('/employee-tasks/:empId').get(fetchEmployeeTasks)
empRouter.route('/start-working').post(startWorking)
module.exports = empRouter