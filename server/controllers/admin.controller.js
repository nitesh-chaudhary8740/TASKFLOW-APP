require("dotenv").configDotenv();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Admin } = require("../models/admin.model.js");
const { Employee } = require("../models/employee.model");
const {
  Task,
  TASK_STATUS_OBJECT,
  TASK_PRIORITIES,
} = require("../models/task.model.js");
// const { User } = require("../models/user.model.js")
const mailData = require("../utils/maildata.template.js");
const generateUserPassword = require("../utils/random.password.generate.js");
const sendEmail = require("../utils/sendmail.util.js");
const nanoid = require("nanoid");
const mongoose = require("mongoose"); // Make sure you require Mongoose at the top
const { validators } = require("../utils/validators.js");

const generateAdminTokens = async (adminId) => {
  const admin = await Admin.findById(adminId).select("-password -refreshToken");
  if (!admin) {
    throw new Error("admin not found");
  }
  const accessToken = await jwt.sign(
    {
    _id:admin._id,
  }
  
  , process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
  const refreshToken = await jwt.sign(
    {_id:admin._id},
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
  admin.refreshToken = refreshToken;
  admin.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
};
const adminLogin = async (req, res) => {
  try {
    const { userNameOrEmail, password } = req.body;
    const fetchedAdmin = await Admin.findOne({
      $or: [{ name: userNameOrEmail }, { email: userNameOrEmail }],
    });
    
    if (!fetchedAdmin) {
      res.status(404).send("No admin user found");
      return;
    }
    const isPasswordCorrect = await bcrypt.compare(password,fetchedAdmin.password)
    if (!isPasswordCorrect) {
      res.status(401).send("wrong password");
      return;
    }
    const {accessToken,refreshToken} = await generateAdminTokens(fetchedAdmin._id)
    const options={
      httpOnly:true,
      secure:true
    }
    const admin = await Admin.findById(fetchedAdmin._id).select("-password -refreshToken")
    res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .send(admin);
  } catch (error) {
    console.log(error)
    res.status(200).send("error in admin login")
  }
};

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
  const currentEmployeeId = new mongoose.Types.ObjectId(id);
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
    const { name, description, dueDate, priority, createdBy } = req.body;

    // --- 1. Input Validation ---
    const requiredFields = { name, description, dueDate, priority, createdBy };
    for (const [key, value] of Object.entries(requiredFields)) {
      if (!value) {
        return res.status(400).json({
          success: false,
          message: `Validation Error: Missing required field - ${key}`,
        });
      }
    }

    // Validate Priority against the defined enum
    if (!TASK_PRIORITIES.includes(priority)) {
      return res.status(400).json({
        success: false,
        message: `Validation Error: Priority must be one of: ${TASK_PRIORITIES.join(
          ", "
        )}`,
      });
    }

    // Validate Due Date format (assuming it should be a valid date string)
    if (isNaN(new Date(dueDate).getTime())) {
      return res.status(400).json({
        success: false,
        message: "Validation Error: Invalid date format for dueDate.",
      });
    }

    // --- 2. Task Creation ---
    // The sequential 'id' field will be automatically generated by the taskSchema.pre('save') middleware.
    const task = await Task.create({
      name,
      description,
      // Convert dueDate string to Date object for the schema
      dueDate: new Date(dueDate),
      priority,
      createdBy, // Reference to the Admin/Manager ID
    });

    // --- 3. Success Response ---
    res.status(201).json({
      success: true,
      message: "Task successfully created.",
      task: task,
    });
  } catch (error) {
    console.error("Task Creation Error:", error);

    // Handle MongoDB duplicate key error for the unique 'id' field
    // (though the Counter logic should prevent this)
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "A task with this ID already exists. Please try again.",
        error: error.message,
      });
    }

    // General error response
    res.status(500).json({
      success: false,
      message: "Server error during task creation.",
      error: error.message,
    });
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
  task.status = TASK_STATUS_OBJECT.PENDING;
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

  task.status = "Un-Assigned";
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
const bulkDeleteTasks = async (req, res) => {
  try {
    // 1. Destructure the array of IDs correctly
    const { selectedTasks } = req.body;
    if (!selectedTasks || selectedTasks.length === 0) {
      return res.status(400).json({ msg: "No tasks selected for deletion." });
    }

    // 2. CRITICAL FIX: Use 'selectedTasks' in the query
    const result = await Task.deleteMany({
      $and: [
        { _id: { $in: selectedTasks } },
        { isAssigned: false }, // Ensures only unassigned tasks are deleted
      ],
    });

    // Optional: Check if any tasks were actually deleted
    if (result.deletedCount === 0) {
      return res.status(400).json({
        msg: "Selected tasks were not deleted. They might be assigned.",
      });
    }

    // 3. Respond with the updated list of tasks
    const tasks = await Task.find({});
    res.status(200).json({
      tasks: tasks,
      msg: `${result.deletedCount} task(s) deleted successfully`,
    });
  } catch (error) {
    console.error("Error deleting multiple tasks:", error);
    res.status(500).json({ msg: "Error in deleting multiple tasks." });
  }
};

const bulkAssignTasks = async (req, res) => {
  try {
    const { empId } = req.params;
    const { selectedTasks } = req.body;
    if (!empId || !selectedTasks || selectedTasks.length === 0) {
      return res
        .status(400)
        .json({ msg: "No employee or tasks selected for assignment." });
    }
    const emp = await Employee.findById(empId);
    if (!emp) {
      return res.status(404).json({ msg: "Employee not found." });
    }
    // 2. Perform the Bulk Update
    const updatedResults = await Task.updateMany(
      {
        // Find all tasks that were selected AND are currently unassigned
        _id: { $in: selectedTasks },
        isAssigned: false,
      },
      {
        // SET NEW VALUES: CRITICAL to set isAssigned and status!
        assignedTo: emp._id,
        isAssigned: true,
        status: TASK_STATUS_OBJECT.PENDING,
      }
    );

    // 3. Handle Case: Zero Tasks Assigned
    if (updatedResults.modifiedCount < 1) {
      return res.status(400).json({
        msg: "None of the selected tasks were assigned. They might have been assigned already.",
      });
    }

    // 4. Success: Retrieve and return all tasks
    const findAssignedTasksIds = await Task.find({
      _id: { $in: selectedTasks },
      assignedTo: emp._id,
    }).select("_id");
    const taskIdsToAppend = findAssignedTasksIds.map((task) => task._id);
    await Employee.updateOne(
      { _id: emp._id },
      { $addToSet: { assignedTasks: { $each: taskIdsToAppend } } }
    );

    const tasks = await Task.find({});

    res.status(200).json({
      tasks: tasks,
      msg: `${updatedResults.modifiedCount} task(s) assigned to ${emp.fullName} successfully.`,
    });
  } catch (error) {
    console.error("Error in bulk assigning tasks:", error);
    return res.status(500).json({ msg: "Error in bulk assigning tasks." });
  }
};
const bulkUnassignTasks = async (req, res) => {
  try {
    const { selectedTasks } = req.body;

    const findSelectedTasks = await Task.find({ _id: { $in: selectedTasks } });
    console.log("seletect", findSelectedTasks);
    res.send("okay");
  } catch (error) {}
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
  bulkDeleteTasks,
  bulkAssignTasks,
  bulkUnassignTasks,
};
