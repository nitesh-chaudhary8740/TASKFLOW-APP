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
const { Report } = require("../models/report.model.js");
const { findById } = require("../models/counter.model.js");
const { default: Activity } = require("../models/activity.model.js");

const generateAdminTokens = async (adminId) => {
  const admin = await Admin.findById(adminId).select("-password -refreshToken");
  if (!admin) {
    throw new Error("admin not found");
  }
  const accessToken = await jwt.sign(
    {
    _id:admin._id,
    role:admin.role
  }
  
  , process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
  const refreshToken = await jwt.sign(
    {_id:admin._id,
      role:admin.role
    },
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
      res.status(404).json({msg:"No admin user found",success:false});
      return;
    }
    const isPasswordCorrect = await bcrypt.compare(password,fetchedAdmin.password)
    if (!isPasswordCorrect) {
      res.status(401).json({msg:"wrong password",success:false});
      return;
    }
    const {accessToken,refreshToken} = await generateAdminTokens(fetchedAdmin._id)
    const options={
      httpOnly:true,
      secure:true,
      sameSite: 'none',
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    path: "/",
      
    }
    const admin = await Admin.findById(fetchedAdmin._id).select("-password -refreshToken")
    res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json({msg:"admin login successful",admin,success:true});
  } catch (error) {
    console.log(error)
    res.status(200).json({msg:"error in admin login",success:false})
  }
};
const adminLogout = async(req,res)=>{
  try {
  //   await Admin.findByIdAndUpdate(req.user._id,{
  //     $set:{
  //       refreshToken:null
  //     }
  //   },{new:true})
  console.log("admin logout")
    const options={
      httpOnly:true,
      secure:true,
      sameSite: 'none'
    }
    res.status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json({msg:"admin logout successfully",success:true})
  } catch (error) {
    console.log("logout error",error)
    res.status(500).json({msg:"Server error occurred during logout.",success:false})
  }
}
const currentUser = async(req,res)=>{
  try {
  if(req.user.role==="admin"){
    const adminUser = await Admin.findById(req.user._id).select("-password -refreshToken");
    return res.status(200).json({msg:"user fetched successfully",user:adminUser,success:true})
  }
  if(req.user.role==="employee"){
    const empUser = await Employee.findById(req.user._id).select("-password -refreshToken");
    return res.status(200).json({msg:"user fetched successfully",user:empUser,success:true}) 
  }
  
  return res.status(404).json({msg:"user not found",success:false}) 
  } catch (error) {
    if (!req.user) {
            return res.status(401).json({ success: false, msg: "User ID not found in request." });
        }
    res.status(500).json({msg:"Server error occurred during fetching user.",success:false})
  }
}

const employeeRegistration = async (req, res) => {
  try {
    const { userName, fullName, email, designation, phone, address } = req.body;
    const existingUser = await Employee.findOne({
      $or: [{ userName }, { email }],
    });
   
    if (existingUser) {
      res.status(400).json({msg:"this username and email already exists",success:false});
      return;
    }
    const password = generateUserPassword(8);
    req.body.password = password;

      await sendEmail(
        email,
        "MY APP",
        mailData(fullName, userName, password),
        "Welcome to app"
      );
 
    const emp = await Employee.create({
      userName,
      fullName,
      email,
      password,
      phone,
      address,
      designation,
      createdBy:req.user._id
    });
    res.status(201).json({ msg: "user successfully created", emp });
  } catch (error) {
    console.log("error",error)
    res.status(400).json({ success: false, msg: "" });
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
    const { name, description, dueDate, priority } = req.body;
   
    // --- 1. Input Validation ---
    const taskCreator = await Admin.findById(req.user._id)

    const requiredFields = { name, description, dueDate, priority };
    for (const [key, value] of Object.entries(requiredFields)) {
      if (!value) {
        return res.status(400).json({
          success: false,
          msg: `Validation Error: Missing required field - ${key}`,
        });
      }
    }

    // Validate Priority against the defined enum
    if (!TASK_PRIORITIES.includes(priority)) {
      return res.status(400).json({
        success: false,
        msg: `Validation Error: Priority must be one of: ${TASK_PRIORITIES.join(
          ", "
        )}`,
      });
    }

    // Validate Due Date format (assuming it should be a valid date string)
    if (isNaN(new Date(dueDate).getTime())) {
      return res.status(400).json({
        success: false,
        msg: "Validation Error: Invalid date format for dueDate.",
      });
    }

    // --- 2. Task Creation ---
    // The sequential 'id' field will be automatically generated by the taskSchema.pre('save') middleware.
    
    const task = await Task.create({
      name:validators.noExtraSpaces(name),
      description:validators.noExtraSpaces(description),

      dueDate: new Date(dueDate),
      priority,
      createdBy:taskCreator._id, // Reference to the Admin/Manager ID
    });

    // --- 3. Success Response ---
    res.status(201).json({
      success: true,
      msg: "Task successfully created.",
      task: task,
    });
  } catch (error) {
    console.error("Task Creation Error:", error);


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
   if ([name,description,dueDate,priority,status].some(field=>field==="")) {
    return res.status(400).json({ message: "empty input fields" });
  }
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

    // console.log("updated", updatedTask);
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
  res.status(200).send({msg:"tasks fetched successfully",tasks});
};
const fetchAllReports = async (req, res) => {
  const reports = await Report.find().populate("task").populate("reportedBy","-password").exec();
  res.status(200).send({msg:"tasks fetched successfully",reports});
};
const fetchAllPendingTasks = async (req, res) => {
  const pendingTasks = await Task.find({ status: "pending" });
  res.status(200).send(pendingTasks);
};
const fetchAdminMetaData = async (req, res) => {
 
  const employees = await Employee.find();
  const unAssignedTasks = await Task.find({ isAssigned: false });
  const tasks = await Task.find();
  const underReviewTasks = tasks.filter((task)=>task.status===TASK_STATUS_OBJECT.UNDER_REVIEW)
  res.status(200).send({
    totalEmployees: employees.length,
    totalUnAssignedTasks: unAssignedTasks.length,
    totalTasks: tasks.length,
    totalUnderReview:underReviewTasks.length
  });
};
const assignTask = async (req, res) => {
  const { empId, taskId } = req.params;
  const employee = await Employee.findById(empId);
  const task = await Task.findById(taskId);
  if (task.isAssigned) {
    res.status(400).json({msg:"task is already assigned"});
    return;
  }
  task.isAssigned = true;
  task.assignedTo = employee._id;
  task.assignedBy = req.user._id;
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

  if (task.status!==TASK_STATUS_OBJECT.PENDING) {
    return res.status(400).send("This task is in working");
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
    task.assignedBy=null;
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
        assignedBy:req.user._id,
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
      { $addToSet: { assignedTasks: { $each: taskIdsToAppend } } }//add unique
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

  // 1. Check if selectedTasks is provided and is an array
  if (!selectedTasks || !Array.isArray(selectedTasks) || selectedTasks.length === 0) {
   return res.status(400).json({ msg: "No tasks selected for unassignment." });
  }
  const fetchedSelectedTasks = await Task.find({_id: { $in: selectedTasks } })

  const employeesIds =  fetchedSelectedTasks.map(task=>task.assignedTo)
  const tasksIdsForUnassign =  fetchedSelectedTasks.map(task=>task._id)
  const updateResult = await Task.updateMany(
   { _id: { $in: tasksIdsForUnassign } ,isAssigned:true, status:TASK_STATUS_OBJECT.PENDING},
   { $set: {assignedBy:null, assignedTo: null,isAssigned:false,status:TASK_STATUS_OBJECT.UN_ASSIGNED } } // Corrected and completed update operation
  );
const rollbackEmployeeUnassignmentResults = await Employee.updateMany(
  {_id:{$in:employeesIds}},
  {$pullAll:{assignedTasks:tasksIdsForUnassign}})//complete this
 

  // 3. Send a success response
  if (updateResult.modifiedCount > 0) {
   res.send({ msg: `Successfully unassigned ${updateResult.modifiedCount} tasks.` });
  } else {
   res.send({ msg: "No tasks were updated (they might already be unassigned or IDs were incorrect)." });
  }

 } catch (error) {
  console.error("Error during bulk unassign:", error);
  res.status(500).json({ msg: "Failed to unassign tasks due to a server error." });
 }
};
const approveReport = async(req,res)=>{

  const {reportId} = req.body
  const report = await Report.findById(reportId);
  if(!report) return res.status(404).json({ msg: "report not found" });
  const taskId= report.task
  const task = await Task.findById(taskId)
  if(!task) return res.status(404).json({ msg: "task not found, invalid task report" });
  report.status="ACCEPTED";
  await report.save({validateBeforeSave:false})
  task.status = TASK_STATUS_OBJECT.COMPLETED
  await task.save({validateBeforeSave:false})
   res.status(200).json({ msg: "report approved",report });
    }
const rejectReport = async(req,res)=>{
  const {reportId} = req.body
  const report = await Report.findById(reportId);
  if(!report) return res.status(404).json({ msg: "report not found" });
  const taskId= report.task
  const task = await Task.findById(taskId)
  if(!task) return res.status(404).json({ msg: "task not found, invalid task report" });
  report.status="REJECTED";
  await report.save({validateBeforeSave:false})
  task.status = TASK_STATUS_OBJECT.IN_PROGRESS
  await task.save({validateBeforeSave:false})
   res.status(200).json({ msg: "report rejected successfully",report });
    }
const undoReport = async(req,res)=>{
  const {reportId} = req.body
  const report = await Report.findById(reportId);
  if(!report) return res.status(404).json({ msg: "report not found" });
  const taskId= report.task
  const task = await Task.findById(taskId)
  if(!task) return res.status(404).json({ msg: "task not found, invalid task report" });
  report.status="SUBMITTED";
  await report.save({validateBeforeSave:false})
  task.status = TASK_STATUS_OBJECT.UNDER_REVIEW
  await task.save({validateBeforeSave:false})
   res.status(200).json({ msg: "report undo successfully",report });
    }
const createActivity = async(req,res)=>{
   try {
     const {performerType,performerId,action,targetType,targetId,description} =req.body
     console.log(req.body,"activity")
     await Activity.create({
     performerType,
     performerId,
     action,
     targetType,
     targetId,
     description,  
 });
  res.status(200).json({ msg: "activity created successfully" });
} catch (error) {
     res.status(200).json({ msg: "failed to create activity" });
   }
}
const getActivities = async (req, res) => {
    try {
        const activities = await Activity.find()
            .sort({ createdAt: -1 }) // Newest first
            .limit(20)
            .populate('performerId', 'name fullName profileImage') // Get names/images
            .populate('targetId', 'name reportTitle'); // Get task name or report title
            
        res.status(200).json(activities);
    } catch (error) {
        res.status(500).json({ msg: "Failed to fetch activities" });
    }
};
module.exports = {
  generateAdminTokens,
  adminLogin,
  adminLogout,
  currentUser,
  employeeRegistration,
  upDateEmployeeDetails,
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
  fetchAllReports,
  approveReport,
  rejectReport,
  undoReport,
  createActivity,
  getActivities
};
