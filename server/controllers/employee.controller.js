const { Employee } = require("../models/employee.model");
const { Report } = require("../models/report.model");
const { Task, TASK_STATUS_OBJECT } = require("../models/task.model");
const generateEmployeeTokens = async (empId) => {
  const employee = await Employee.findById(empId).select(
    "-password -refreshToken"
  );
  if (!employee) {
    throw new Error("employee not found");
  }
  const accessToken = await jwt.sign(
    {
      _id: employee._id,
      role: employee.role,
    },

    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
  const refreshToken = await jwt.sign(
    { _id: employee._id, role: employee.role },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
  employee.refreshToken = refreshToken;
  employee.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
};
const employeeLogin = async (req, res) => {
  const { userNameOrEmail, password } = req.body;
  const fetchedEmployee = await Employee.findOne({
    $or: [{ userName: userNameOrEmail }, { email: userNameOrEmail }],
  });
  if (!fetchedEmployee) {
    res.status(404).send("username or email not registered!");
    return;
  }
  if (fetchedEmployee.password !== password) {
    res.status(401).send("password not matched!");
    return;
  }
  console.log(fetchedEmployee);
  res.status(200).send(fetchedEmployee);
};

const fetchEmployeeTasks = async (req, res) => {
  try {
    const { empId } = req.params;
    const employee = await Employee.findById(empId);
    if (!employee) {
      res.send("employee not found").status(400);
      return;
    }
    const empTasks = await Task.find({ assignedTo: empId }).populate(
      "assignedBy"
    );
    res.status(200).json({ empTasks, msg: "task fetched successfully" });
  } catch (error) {
    res.send("failed to fetch employee tasks").status(500);
  }
};
const fetchTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId)
      .populate("assignedTo", "-password")
      .populate("assignedBy", "-password -refreshToken")
      .exec();
    if (!task) {
      return res.status(404).json({ msg: "task not found" });
    }

    res.status(200).json({ task, msg: "task fetched successfully" });
  } catch (error) {
    res.status(500).json({ msg: "failed to fetch task" });
  }
};
const fetchReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const report = await Report.findById(reportId)
      .populate("task", "-password")
      .populate("reportedBy", "-password -refreshToken")
      .exec();
    if (!report) {
      return res.status(404).json({ msg: "report not found" });
    }

    res.status(200).json({ report, msg: "report fetched successfully" });
  } catch (error) {
    res.status(500).json({ msg: "failed to fetch report" });
  }
};
const startWorking = async (req, res) => {
  try {
    const { taskId } = req.params;

    // 1. Use updateOne with a compound query
    const updateResult = await Task.updateOne(
      {
        _id: taskId,
        status: TASK_STATUS_OBJECT.PENDING, // Ensures only PENDING tasks can be started
      },
      {
        $set: {
          status: TASK_STATUS_OBJECT.IN_PROGRESS,
          startDate: new Date(),
        },
      }
    );

    const taskExists = await Task.findById(taskId);
    // 2. Check the result object for modification count
    if (updateResult.modifiedCount === 0) {
      // Check if the task exists but was not PENDING (i.e., status mismatch)

      if (!taskExists) {
        return res.status(404).json({ msg: `Task not found.` });
      } else {
        // Task exists, but the status was wrong (e.g., IN_PROGRESS, COMPLETED, etc.)
        return res
          .status(400)
          .json({
            msg: `Task is already ${taskExists.status}. Cannot start work.`,
          });
      }
    }

    // 3. Success response
    res
      .status(200)
      .json({ msg: `Successfully started working on ${taskExists.id}` });
  } catch (error) {
    console.error("Error starting task:", error);
    // Mongoose validation errors or database connection errors will be caught here
    res.status(500).json({ msg: `Error in starting the task.` });
  }
};
const stopWorking = async (req, res) => {
  try {
    const { taskId } = req.params;

    // 1. Use updateOne with a compound query
    const updateResult = await Task.updateOne(
      {
        _id: taskId,
        status: TASK_STATUS_OBJECT.IN_PROGRESS,
      },
      {
        $set: {
          status: TASK_STATUS_OBJECT.PENDING,
          startDate: null,
        },
      }
    );

    const taskExists = await Task.findById(taskId);
    if (updateResult.modifiedCount === 0) {
      if (!taskExists) {
        return res.status(404).json({ msg: `Task not found.` });
      } else {
        // Task exists, but the status was wrong (e.g., IN_PROGRESS, COMPLETED, etc.)
        return res
          .status(400)
          .json({
            msg: `Task is already ${taskExists.status}. Cannot stop work.`,
          });
      }
    }

    // 3. Success response
    res.status(200).json({ msg: ` ${taskExists.id} stopped successfully ` });
  } catch (error) {
    console.error("Error starting task:", error);
    // Mongoose validation errors or database connection errors will be caught here
    res.status(500).json({ msg: `Error in starting the task.` });
  }
};
const submitedReport = async (req, res) => {
  try {
    const { reportTitle, reportDescription, taskId } = req.body;
    const task = await Task.findById(taskId);
    if (!task)
      return res.status(404).json({ msg: `task not found`, success: false });
    if (task.status !== TASK_STATUS_OBJECT.IN_PROGRESS)
      return res
        .status(400)
        .json({ msg: `task is not in progres`, success: false });
    if (task.hasReport)
      return res
        .status(400)
        .json({ msg: `report already has been submitted`, success: false });
    if (!task.isAssigned)
      return res
        .status(400)
        .json({ msg: `task is not assigned`, success: false });

    const report = await Report.create({
      reportTitle,
      reportDescription,
      task: task._id,
      reportedBy: task.assignedTo,
      reportedTo: task.assignedBy,
    });
    task.hasReport = true;
    task.report = report._id;
    task.status = TASK_STATUS_OBJECT.UNDER_REVIEW;
    await task.save({ validateBeforeSave: false });
    res.status(200).json({ msg: `report submitted successfully` });
  } catch (error) {
    res.status(500).json({ msg: `Error in reading report` });
  }
};
const fetchEmployeeReports = async (req, res) => {
  const { empId } = req.params;
  try {
    const employee = await Employee.findById(empId);
    if (!employee)
      return res
        .status(404)
        .json({ msg: `employee not found`, success: false });
    const reports = await Report.find({ reportedBy: employee._id }).populate(
      "task"
    );
    res
      .status(200)
      .json({ msg: `reports fetched successfully`, reports, success: true });
  } catch (error) {
    console.log("report fetching error", error);
    res.status(500).json({ msg: `unable to fetch reports`, success: false });
  }
};

const updateEmployeeProfile = async (req, res) => {
  const { empId } = req.params; // Employee ID from URL parameters
  const { fullName, email, phone, address } = req.body; // Updated fields from request body

  if (!empId) {
    return res.status(400).json({
      msg: "Employee ID is required in URL parameters.",
    });
  }

  try {
    // Prepare the fields to update
    const updateFields = {};
    if (fullName) updateFields.fullName = fullName;
    if (email) updateFields.email = email;
    if (phone) updateFields.phone = phone;
    if (address) updateFields.address = address;

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({
        msg: "No valid fields provided for update.",
      });
    }
    const updatedEmployee = await Employee.findByIdAndUpdate(
      empId,
      updateFields,
      { new: true, runValidators: true } // Return new document, run validation rules
    ).select("-password");

    if (!updatedEmployee) {
      return res.status(404).json({
        msg: `Employee with ID ${empId} not found.`,
      });
    }
    return res.status(200).json({
      msg: "Profile updated successfully!",
      employee: updatedEmployee, // Send the updated data back
    });
  } catch (error) {
    console.error("Error updating employee profile:", error);

    // Handle specific validation errors if necessary (e.g., unique email constraint)
    if (error.name === "ValidationError") {
      return res.status(400).json({
        // CHANGED: message -> msg
        msg: "Validation failed.",
        details: error.message,
      });
    }

    // General Server Error
    return res.status(500).json({
      // CHANGED: message -> msg
      msg: "An internal server error occurred during the update.",
    });
  }
};
const verifyCurrentPassword = async (req, res) => {
  try {
    const { empId } = req.params;

    const { password } = req.body;
    if (!empId) {
      return res.status(400).json({
        msg: "Employee ID is required in URL parameters.",
        isVerified: false,
      });
    }
    const employee = await Employee.findById(empId);
    if (!employee) {
      return res.status(404).json({
        msg: `Employee with ID ${empId} not found.`,
        isVerified: false,
      });
    }
    if (employee.password === password)
      return res
        .status(200)
        .json({ msg: `password matched`, isVerified: true });
    else
      return res
        .status(401)
        .json({ msg: `password not matched`, isVerified: false });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({
        msg: `error in current password verification`,
        isVerified: false,
      });
  }
};
const changePassword = async (req, res) => {
  try {
    const { empId } = req.params;

    const { password } = req.body;
    if (!empId) {
      return res.status(400).json({
        msg: "Employee ID is required in URL parameters.",
      });
    }
    if (password.trim().length < 8) {
      return res.status(400).json({
        msg: "Password length must be minimum 8 characters long",
      });
    }
    const employee = await Employee.findById(empId);
    if (!employee) {
      return res.status(404).json({
        msg: `Employee with ID ${empId} not found.`,
      });
    }
    employee.password = password;
    await employee.save({ validateBeforeSave: false });
    return res.status(200).json({ msg: `password changed successfully` });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: `error in updating employee password` });
  }
};

module.exports = {
  employeeLogin,
  fetchEmployeeTasks,
  startWorking,
  stopWorking,
  fetchTask,
  submitedReport,
  fetchReport,
  fetchEmployeeReports,
  updateEmployeeProfile,
  verifyCurrentPassword,
  changePassword,
};
