const { Admin } = require("../models/admin.model.js");
const { Employee } = require("../models/employee.model");
const { Task } = require("../models/task.model.js");
// const { User } = require("../models/user.model.js")
const mailData = require("../utils/maildata.template.js");
const generateUserPassword = require("../utils/random.password.generate.js");
const sendEmail = require("../utils/sendmail.util.js");
const nanoid = require("nanoid");
const mongoose = require("mongoose"); // Make sure you require Mongoose at the top
const { validators } = require("../utils/validators.js");
const {
  checkForEmptyFieldsInReqBody,
} = require("../utils/checkNonEmptyFields.util.js");
// Assuming Employee is your Mongoose model
const employeeRegistration = async (req, res) => {
  try {
    const { userName, fullName, email, designation, phone, address } = req.body;

    const existingUser = await Employee.findOne({
      $or: [{ userName }, { email }],
    });
    console.log(existingUser);
    if (existingUser) {
      res.status(400).send("this username and email already exists");
      return;
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
      phone,
      address,
      designation,
    });
    res.status(201).send({ msg: "user successfully created", emp });
  } catch (error) {
    res.status(400).json({ success: false, err: error.message });
  }
};

const upDateEmployeeDetails = async (req, res) => {
  const { userName, fullName, email, designation, phone, address } = req.body;
  const { id } = req.params;
  const { noExtraSpaces } = validators;
  // 1. Convert the string ID from URL params to a Mongoose ObjectId
  const currentEmployeeId = new mongoose.Types.ObjectId(id);

  // 2. Check for conflicts: Find any employee whose userName OR email matches
  //    the input, AND whose _id is NOT the current employee's _id.
  const conflictingEmployee = await Employee.findOne({
    $or: [{ userName }, { email }],
    _id: { $ne: currentEmployeeId }, // $ne means "Not Equal to"
  });

  if (conflictingEmployee) {
    // Conflict found: Another employee already uses this username or email.
    const field =
      conflictingEmployee.userName === userName ? "username" : "email";
    return res.status(400).json({
      message: `This ${field} already exists for another employee.`,
    });
  }

  // 3. If no conflict, perform the update using findByIdAndUpdate

  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(
      currentEmployeeId, // ID of the employee to update
      {
        userName: noExtraSpaces(userName),
        fullName: noExtraSpaces(fullName),
        email: noExtraSpaces(email),
        designation,
        phone,
        address,
      }, // The fields to update
      { new: true, runValidators: true } // {new: true} returns the updated document
    );

    if (!updatedEmployee) {
      return res.status(404).json({ message: "Employee not found." });
    }

    console.log("Update successful:", updatedEmployee.userName);
    // Send back the updated employee details
    res.json({
      message: "Employee updated successfully",
      employee: updatedEmployee,
    });
  } catch (error) {
    console.error("Mongoose Update Error:", error);
    // Handle validation errors or other database errors
    res.status(500).json({ message: "Failed to update employee details." });
  }
};
const taskCreation = async (req, res) => {
  try {
    console.log("req, received");
    const { name, description, dueDate, priority } = req.body;
    const alphabet = nanoid.customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ", 2);
    const number = nanoid.customAlphabet("0123456789", 6);
    const alphabetId = alphabet();
    const numberId = number();
    console.log(alphabetId, numberId);
    const task = await Task.create({
      id: `${alphabetId}-${numberId}`,
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
const updateTask = async (req, res) => {
  const { name, description, dueDate, priority, status } = req.body;
  const { taskId } = req.params;
  const task = await Task.findById(taskId);
  if (!task) {
    return res.status(404).json({ message: "task not found for update" });
  }
  if (task.isAssigned) {
    return res
      .status(400)
      .json({ message: "task is assigned(unassign task before update" });
  }
  const isAnyFieldEmpty = checkForEmptyFieldsInReqBody(req);
  if (isAnyFieldEmpty) {
    return res.status(400).json({ message: "empty input fields" });
  }
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      {
        name,
        description,
        dueDate,
        priority,
        status,
      },
      // 🚨 ADD THIS OPTIONS OBJECT:
      { new: true, runValidators: true }
    );

    // Check if the task was actually found and updated
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found." });
    }

    console.log("updated", updatedTask);
    // updatedTask now holds the document with the new 'name', 'description', etc.
    return res
      .status(200)
      .json({ task: updatedTask, message: "Task updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Error in update task" });
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
  const tasks = await Task.find().populate("assignedTo");
  res.status(200).send(tasks);
};
const fetchAllPendingTasks = async (req, res) => {
  const pendingTasks = await Task.find({ status: "pending" });
  console.log(pendingTasks);
  res.status(200).send(pendingTasks);
};
const fetchAdminMetaData = async (req, res) => {
  const employees = await Employee.find();
  const unAssignedTasks = await Task.find({ isAssigned: false });
  const tasks = await Task.find();
  res.status(200).send({
    totalEmployees: employees.length,
    totalUnAssigned: unAssignedTasks.length,
    totalTasks: tasks.length,
  });
};
const assignTask = async (req, res) => {
  const { empId, taskId } = req.params;
  const employee = await Employee.findById(empId);
  const task = await Task.findById(taskId);
  if (task.isAssigned) {
    res.status(400).send("this task is already assigned");
    return;
  }
  task.isAssigned = true;
  task.assignedTo = employee._id;
  task.status="Pending";
  await task.save({ validateBeforeSave: false });
  employee.assignedTasks.push(task._id);
  await employee.save({ validateBeforeSave: false });
  res.send("task assigned successfully");
};
const unAssignTask = async (req, res) => {
  const { taskId } = req.params;

  // 1. Find Task
  const task = await Task.findById(taskId);
  if (!task) {
    return res.status(404).send("Task not found.");
  }

  if (!task.isAssigned || !task.assignedTo) {
    return res.status(400).send("This task is not currently assigned.");
  }

  // 2. Find Employee
  const employee = await Employee.findById(task.assignedTo);
  if (!employee) {
    // Handle case where employee might have been deleted
    task.isAssigned = false;
    task.assignedTo = null;
    await task.save({ validateBeforeSave: false });
    return res
    .status(200)
    .send("Task unassigned, assigned employee not found.");
  }
  
  // 3. Update Task (De-assign)
  task.isAssigned = false;
  task.assignedTo = null;
  
  task.status="Un-Assigned"
  // 4. Update Employee (Filter Task out)
  // Use .equals() method for safe ObjectId comparison
  employee.assignedTasks = employee.assignedTasks.filter(
    (t) => !t._id.equals(task._id)
  );

  // 5. Save Changes
  await task.save({ validateBeforeSave: false });
  await employee.save({ validateBeforeSave: false });

  res.json({ message: "Task unassigned successfully", employee, task });
};
const deleteEmployee = async (req, res) => {
  const { empId } = req.params;
  const employee = await Employee.findById(empId).populate("assignedTasks");
  if (employee.assignedTasks.length > 0) {
    console.log(employee, employee.assignedTasks.length);
    return res
      .status(400)
      .send(
        `unable to delete ${employee.fullName.split(" ")[0]} [employee has ${
          employee.assignedTasks.length
        } assigned Tasks]`
      );
  }
  await Employee.findByIdAndDelete(employee._id);
  return res.status(200).send("employee deleted successfully");
};
const deleteTask = async (req, res) => {
  console.log(req.params);
  const { taskId } = req.params;
  const task = await Task.findById(taskId);
  if (task.isAssigned) {
    return res.status(400).send("This task is assigned!");
  }
  await Task.findByIdAndDelete(task._id);
  res.status(200).send("task deleted successfully");
};
module.exports = {
  employeeRegistration,
  upDateEmployeeDetails,
  adminLogin,
  taskCreation,
  updateTask,
  fetchAllEmployees,
  fetchAllTasks,
  fetchAllPendingTasks,
  assignTask,
  fetchAdminMetaData,
  deleteEmployee,
  deleteTask,
  unAssignTask,
};
