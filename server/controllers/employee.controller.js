const { Employee } = require("../models/employee.model");
const { Task } = require("../models/task.model");

const employeeLogin = async(req,res)=>{
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
}

const fetchEmployeeTasks = async (req,res)=>{
   try {
     const {empId} = req.params;
     const employee=await Employee.findById(empId)
     if(!employee) {
         res.send("employee not found").status(400)
         return;
     }
     const empTasks = await Task.find({'assignedTo.empId':empId})
     res.send({empTasks,msg:"task fetched successfully"}).status(200)
   } catch (error) {
    res.send("failed to fetch employee tasks").status(500)
   }
}
module.exports = {employeeLogin,fetchEmployeeTasks}