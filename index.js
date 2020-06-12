require("console.table");
const inquirer = require("inquirer");
const mysql = require("mysql");
const db = require("./db");
const util = require("util");
const { prompt } = require("inquirer");
const logo = require("asciiart-logo");

function init() {
  const logoText = logo({
    name: "Employee Tracker",
  }).render();
  console.log("Employee Tracker");
  console.log(logoText);
  loadEmployeeTrackerQuestions();
}
async function loadEmployeeTrackerQuestions() {
  const { choice } = await prompt([
    {
      type: "list",
      name: "choice",
      message:
        "Welcome to the Employee Tracking System.  What would you like to accomplish?",
      choices: [
        {
          name: "View Employees",
          value: "VIEW_EMPLOYEES",
        },
        {
          name: "View Employees By Department",
          value: "VIEW_EMPLOYEES_BY_DEPARTMENT",
        },
        {
          name: "View Employees By Manager",
          value: "VIEW_EMPLOYEES_BY_MANAGER",
        },
        {
          name: "View Employees By Role",
          value: "VIEW_EMPLOYEES_BY_ROLE",
        },
        {
          name: "Add New Employee",
          value: "ADD_NEW_EMPLOYEE",
        },
        {
          name: "Remove Former Employee",
          value: "REMOVE_FORMER_EMPLOYEE",
        },
        {
          name: "Update Employee Role",
          value: "UPDATE_EMPLOYEE_ROLE",
        },
        {
          name: "Update Employee Manager",
          value: "UPDATE_EMPLOYEE_MANAGER",
        },
        {
          name: "Update Employee Department",
          value: "UPDATE_EMPLOYEE_DEPARTMENT",
        },
        {
          name: "Update Employee Salary",
          value: "UPDATE_EMPLOYEE_SALARY",
        },
        {
          name: "View Employee Roles",
          value: "VIEW_EMPLOYEE_ROLES",
        },
        {
          name: "Add Employee Roles",
          value: "ADD_EMPLOYEE_ROLES",
        },
        {
          name: "Remove Employee Roles",
          value: "REMOVE_EMPLOYEE_ROLES",
        },
        {
          name: "View Departments",
          value: "VIEW_DEPARTMENTS",
        },
        {
          name: "Add Department",
          value: "ADD_DEPARTMENT",
        },
        {
          name: "Remove Department",
          value: "REMOVE_DEPARTMENT",
        },
        {
          name: "Add Department Manager",
          value: "ADD_DEPARTMENT_MANAGER",
        },
        {
          name: "Remove Department Manager",
          value: "REMOVE_DEPARTMENT_MANAGER",
        },
        {
          name: "View Total Payroll",
          value: "VIEW_TOTAL_PAYROLL",
        },
        {
          name: "View Department Payroll",
          value: "VIEW_DEPARTMENT_PAYROLL",
        },
        {
          name: "View Role Specific Payroll",
          value: "VIEW_ROLE_SPECIFIC_PAYROLL",
        },
        {
          name: "Leave Employee Tracker",
          value: "QUIT",
        },
      ],
    },
  ]);

  // function call

  switch (choice) {
    case "VIEW_EMPLOYEES":
      return viewEmployees();
    case "VIEW_EMPLOYEES_BY_DEPARTMENT":
      return viewEmployeesByDepartment;
    case "VIEW_EMPLOYEES_BY_MANAGER":
      return viewEmployeesByManager;
    case "VIEW_EMPLOYEES_BY_ROLE":
      return viewEmployeesByRole;
    case "ADD_NEW_EMPLOYEE":
      return addNewEmployee;
    case "REMOVE_FORMER_EMPLOYEE":
      return removeFormerEmployee;
    case "UPDATE_EMPLOYEE_ROLE":
      return updateEmployeeRole;
    case "UPDATE_EMPLOYEE_MANAGER":
      return updateEmployeeManager;
    case "UPDATE_EMPLOYEE_DEPARTMENT":
      return updateEmployeeDepartment;
    case "UPDATE_EMPLOYEE_SALARY":
      return updateEmployeeSalary;
    case "VIEW_EMPLOYEE_ROLES":
      return viewEmployeeRoles;
    case "ADD_EMPLOYEE_ROLES":
      return addRoles;
    case "REMOVE_ROLES":
      return removeEmployeeRoles;
    case "VIEW_DEPARTMENTS":
      return viewDepartments;
    case "ADD_DEPARTMENT":
      return addDepartment;
    case "REMOVE_DEPARTMENT":
      return removeDepartment;
    case "VIEW_TOTAL_PAYROLL":
      return viewTotalPayroll;
    case "VIEW_DEPARTMENT_PAYROLL":
      return viewDepartmentPayroll;
    case "VIEW_ROLE_SPECIFIC_PAYROLL":
      return viewRoleSpecificPayroll;
    default:
      return quit();
  }
}

// functions
// view employees
async function viewEmployees() {
  const employees = await db.findAllEmployees();
  console.log("\n");
  console.table(employees);
  loadEmployeeTrackerQuestions();
}

// view employees by department
async function viewEmployeesByDepartment() {
  const departments = await db.findAllEmployeesByDepartments();
  const departmentChoices = departments.map(({ id, name }) => ({
    name: name,
    value: id,
  }));
  const { departmentId } = await prompt([
    {
      type: "list",
      name: "departmentId",
      message: "Which department would you like to display?",
      choices: departmentChoices,
    },
  ]);
  const employees = await db.findAllEmployeesByDepartment(departmentId);
  console.log("\n");
  console.table(employees);
  loadEmployeeTrackerQuestions();
}

// view employees by manager

async function viewEmployeesByManager() {
  const managers = await db.findAllEmployeesByManager();
  const managerChoices = managers.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id,
  }));
  const { managerId } = await prompt({
    type: "list",
    name: "managerId",
    message: "Which manager's direct reports would you like to display?",
    choices: managerChoices,
  });
  const employees = await db.findAllEmployeesByManager(managerId);
  console.log("\n");
  if (employees.lenghth === 0) {
    console.log("No direct reports.");
  } else {
    console.table(employees);
  }
  loadEmployeeTrackerQuestions();
}

// view employees by role. Not required, but I wanted to test my understanding.
// get someone to look at it.

async function viewEmployeesByRole() {
  const employees = await db.findAllEmployeesByRole();
  const roleChoices = roles.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id,
  }));
  const { roleId } = await prompt({
    type: "list",
    name: "roleId",
    message: "Which employee role's roster do you wish to view?",
    choices: managerChoices,
  });
  const employees = await db.findAllEmployeesByRole(roleId);
  console.log("\n");
  if (employees.length === 0) {
    console.log("None specified.");
  } else {
    console.table(employees);
  }
  loadEmployeeTrackerQuestions();
}

// add new employee

async function addNewEmployee() {
  const employees = await db.findAllEmployees();
  const roles = await db.findAllRoles();
  const employee = await prompt(
    {
      name: "first_name",
      message: "What is the new employee's first name?",
    },
    {
      name: "last_name",
      message: "What is the new employee's last name?",
    }
  );
  const roleChoices = roles.map(({ id, title }) => ({
    name: title,
    value: id,
  }));
  const { roleId } = await prompt([
    {
      type: "list",
      name: "roleId",
      message: "What is the new employee's role.",
      choices: roleChoices,
    },
  ]);
  employee.role_id = roleId;
  const managerChoices = employee.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id,
  }));
  managerChoices.unshift({
    name: "None",
    value: null,
  });
  const { managerId } = await prompt({
    type: "list",
    name: "managerId",
    message: "Who is the new employee's manager?",
    choices: managerChoices,
  });
  employee.manager_id = managerId;
  await db.createEmployee(employee);
  console.log(`${employee.first_name} ${employee.last_name} has been added.`);
  loadEmployeeTrackerQuestions();
}

// remove ex employees
async function removeFormerEmployee() {
  const employees = await db.findAllEmployees();
  const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id,
  }));
  const { employeeId } = await prompt({
    type: "list",
    name: "employeeId",
    message: "Who would you like to remove?",
    choices: employeeChoices,
  });
  await db.removeFormerEmployee(employeeId);
  console.log(`${employee.first_name} ${employee.last_name} has been removed.`);
  loadEmployeeTrackerQuestions();
}

// update existing employees
// update employee role ?????
async function updateEmployeeRole() {
  const employees = await db.findAllEmployees();
  const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id,
  }));
  const { employeeId } = await prompt([
    {
      type: "list",
      name: "employeeId",
      message: "Who's role do you need to changed?",
      choices: employeeChoices,
    },
  ]);
  const roles = await db.findAllRoles();
  const roleChoices = roles.map(({ id, title }) => ({
    name: title,
    value: id,
  }));
  const { roleId } = await prompt({
    type: "list",
    name: "roleId",
    message: "What is their new role in the organization?",
    choices: roleChoices,
  });
  await db.updateEmployeeRole(employeeId, roleId);
  console.log(
    `Employee role for ${employee.first_name} ${employee.last_name} has been changed.`
  );
  loadEmployeeTrackerQuestions();
}

// update manager ????
async function updateEmployeeManager() {
  const employees = await db.findAllEmployees();
  const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id,
  }));
  const { employeeId } = await prompt([
    {
      type: "list",
      name: "employeeId",
      message: "Who's manager assignment do you need to change?",
      choices: employeeChoices,
    },
  ]);
  const managers = await db.findAllManagers(employeeId);
  const managerChoices = managers.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id,
  }));
  const { managerId } = await prompt({
    type: "list",
    name: "managerId",
    message: "Who is their new manager?",
    choices: managerChoices,
  });
  await db.updateEmployeeManager(employeeId, managerId);
  console.log(
    `${employee.first_name} ${employee.last_name} has been assigned to a new manager.`
  );
  loadEmployeeTrackerQuestions();
}

// update department

// update salary??

// view all roles
async function viewEmployeeRoles() {
  const roles = await db.findAllRoles();
  console.log('"\n');
  console.table(roles);
  loadEmployeeTrackerQuestions();
}

// add new roles
async function addEmployeeRoles() {
  const departments = await db.findAllByDepartments;
  const departmentChoices = departments.map(({ id, name }) => ({
    name: name,
    value: id,
  }));
  const role = await prompt([
    {
      name: "title",
      message: "What is the name of the role being added?",
    },
    {
      name: "salary",
      message: "What is the salary for this role?",
    },
    {
      type: "list",
      name: "department_id",
      message: "Which department does the role align with?",
      choices: departmentChoices,
    },
  ]);
  await db.addEmployeeRoles(role);
  console.log(`${role.title} has been added to the database.`);
  loadEmployeeTrackerQuestions();
}

// delete role
async function removeEmployeeRoles() {
  const roles = await db.findAllRoles();
  const roleChoices = roles.map(({ id, title }) => ({
    name: title,
    value: id,
  }));
  const { roleId } = await prompt([
    {
      type: "list",
      name: "roleId",
      message:
        "Which role needs to be eliminated? (This will also eliminate the corresponding employees.",
      choices: roleChoices,
    },
  ]);
  await db.removeEmployeeRoles(roleId);
  console.log("Employee Role eliminated.");
  loadEmployeeTrackerQuestions();
}

//view departments
async function viewDepartments() {
  const departments = await db.findAllDepartments();
  console.log("\n");
  console.table(departments);
  loadMainPrompts();
}

// add department
async function addDepartment() {
  const department = await prompt([
    {
      name: "name",
      message: "What is the name of the department?",
    },
  ]);
  await db.addDepartment(department);
  console.log(`Added ${department.name} to the database`);
  loadMainPrompts();
}

// remove department
async function removeDepartment() {
  const departments = await db.findAllDepartments();
  const departmentChoices = departments.map(({ id, name }) => ({
    name: name,
    value: id,
  }));
  await db.removeDepartment(departmentId);
  loadEmployeeTrackerQuestions();
}
// not sure how to do this
// view total payroll

// view department specific payroll

// view role specific payroll

function quit() {
  console.log("Goodbye!");
  process.exit();
}

init();
