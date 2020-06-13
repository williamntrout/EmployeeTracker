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
          name: "View Employee Roles",
          value: "VIEW_EMPLOYEE_ROLES",
        },
        {
          name: "Add Employee Roles",
          value: "ADD_EMPLOYEE_ROLES",
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
    case "ADD_NEW_EMPLOYEE":
      return addNewEmployee;
    case "REMOVE_FORMER_EMPLOYEE":
      return removeFormerEmployee;
    case "UPDATE_EMPLOYEE_ROLE":
      return updateEmployeeRole;
    case "VIEW_EMPLOYEE_ROLES":
      return viewEmployeeRoles;
    case "ADD_EMPLOYEE_ROLES":
      return addEmployeeRoles;
    case "VIEW_DEPARTMENTS":
      return viewDepartments;
    case "ADD_DEPARTMENT":
      return addDepartment;
    default:
      return quit();
  }
}

// functions
// view employees
async function viewEmployees() {
  const employees = db.findAllEmployees((cb) => {
    console.table(cb);
    loadEmployeeTrackerQuestions();
  });
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

// view all roles
async function viewEmployeeRoles() {
  const employeeRoles = db.findAllRoles((cb) => {
    console.table(cb);
    loadEmployeeTrackerQuestions();
  });
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

function quit() {
  console.log("Goodbye!");
  process.exit();
}

init();
