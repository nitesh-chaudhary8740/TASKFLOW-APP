const { Admin } = require("../models/admin.model.js");
const { Employee } = require("../models/employee.model");
const { Task } = require("../models/task.model.js");
// const { User } = require("../models/user.model.js")
const mailData = require("../utils/maildata.template.js");
const generateUserPassword = require("../utils/random.password.generate.js");
const sendEmail = require("../utils/sendmail.util.js");

const employeeRegistration = async (req, res) => {
  try {
    console.log("req, received");
    const { userName, fullName, email, designation } = req.body;

    const existingUser = await Employee.findOne({
      $or: [{ userName }, { email }],
    });
    console.log(existingUser);
    if (existingUser) {
      res.status(400).send("this username and email already exists");
    }
    const password = generateUserPassword(8);
    req.body.password = password;
    try {
      await sendEmail(
        email,
        "MY APP",
        mailData(fullName, userName, password),
        "Welcome to app"
      );
    } catch (error) {
      console.log(error);
    }
    const emp = await Employee.create({
      userName,
      fullName,
      email,
      password,
      designation,
    });
    res.status(201).send({ msg: "user successfully created", emp });
  } catch (error) {
    res.status(400).json({ success: false, err: error.message });
  }
};
const taskCreation = async (req, res) => {
  try {
    console.log("req, received");
    const { name, description, dueDate, priority } = req.body;
    const task = await Task.create({
      name,
      description,
      dueDate,
      priority,
    });
    res.status(201).send({ msg: "task successfully created", task });
  } catch (error) {
    res.status(400).json({ success: false, err: error.message });
  }
};
const adminLogin = async (req, res) => {
  const { userNameOrEmail, password } = req.body;
  const fetchedAdmin = await Admin.findOne({
    $or: [{ name: userNameOrEmail }, { email: userNameOrEmail }],
  });
  if (!fetchedAdmin) {
    res.status(404).send("No admin user found");
    return;
  }
  if (fetchedAdmin.password !== password) {
    res.status(401).send("wrong password");
    return;
  }
  console.log(fetchedAdmin);
  res.status(200).send(fetchedAdmin);
};
const fetchAllEmployees = async (req, res) => {
  const employees = await Employee.find();
  res.status(200).send(employees);
};
const fetchAllTasks = async (req, res) => {
  const tasks = await Task.find();
  res.status(200).send(tasks);
};
const fetchAllPendingTasks = async (req, res) => {
  const pendingTasks = await Task.find({ status: "pending" });
  console.log(pendingTasks);
  res.status(200).send(pendingTasks);
};
const fetchAdminMetaData = async (req, res) => {
  const employees = await Employee.find();
  const pendingTasks = await Task.find({ status: "pending" });
  const tasks = await Task.find();
  res
    .status(200)
    .send({
      totalEmployees: employees.length,
      totalPendingTasks: pendingTasks.length,
      totalTasks: tasks.length,
    });
};
const assignTask = async (req, res) => {
  const { empId,taskId } = req.params;
  const employee = await Employee.findById(empId);
  const task = await Task.findById(taskId);
  if(task.isAssigned) {
    res.status(400).send("this task is already assigned")
    return
  }
  task.isAssigned=true;
  task.assignedTo.empId=employee._id;
  task.assignedTo = {empId:employee._id,empName:employee.fullName}
  await task.save({validateBeforeSave:false})
  employee.assignedTasks.push(task)
  await employee.save({validateBeforeSave:false})
  res.send("task assigned successfully");
};
const deleteEmployee = async (req, res) => {
  const { empId } = req.params;
  const employee = await Employee.findByIdAndDelete(empId);
  res.status(200).send("employee deleted successfully");
};
const deleteTask = async (req, res) => {
  console.log(req.params)
  const {taskId} = req.params;
  const task = await Task.findByIdAndDelete(taskId);
  res.status(200).send("task deleted successfully");
};
module.exports = {
  employeeRegistration,
  adminLogin,
  taskCreation,
  fetchAllEmployees,
  fetchAllTasks,
  fetchAllPendingTasks,
  assignTask,
  fetchAdminMetaData,
  deleteEmployee,
  deleteTask
};
