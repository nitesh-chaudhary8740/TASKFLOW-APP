const express = require("express");
const { employeeLogin, fetchEmployeeTasks } = require("../controllers/employee.controller");
const empRouter = express.Router()
empRouter.route('/login').post(employeeLogin)
empRouter.route('/employee-tasks/:empId').get(fetchEmployeeTasks)
module.exports = empRouter