const inquirer = require("inquirer");
const mysql = require("mysql");
const util = require("util");
const { prompt } = require("inquirer");
const logo = require("asciiart-logo");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "employees",
});

connection.connect();

function init() {
  const logoText = logo({
    name: "Employee Tracker",
  }).render();
  console.log("Employee Tracker");
  console.log(logoText);
  loadEmployeeTrackerQuestions();
}
function loadEmployeeTrackerQuestions() {
  inquirer
    .prompt({
      type: "list",
      name: "choice",
      message:
        "Welcome to the Employee Tracking System.  What would you like to accomplish?",
      choices: [
        "View Employees",
        "Add New Employee",
        "Update Employee Role",
        "View Employee Roles",
        "Add Employee Roles",
        "View Departments",
        "Add Department",
        "Leave Employee Tracker",
      ],
    })
    .then((response) => {
      switch (response.choice) {
        case "View Employees":
          viewAllEmployees();
          break;
        case "Add New Employee":
          addNewEmployee();
          break;
        case "Update Employee Role":
          updateEmployeeRole();
          break;
        case "View Employee Roles":
          viewEmployeeRoles();
          break;
        case "Add Employee Roles":
          addEmployeeRoles();
          break;
        case "View Departments":
          viewDepartments();
          break;
        case "Add Department":
          addDepartment();
          break;
        default:
          quit();
          break;
      }
    });
}

// functions

// view employees

function viewAllEmployees() {
  connection.query(
    "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.department_name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;",
    function (err, res) {
      if (err) throw err;
      console.table(res);
      loadEmployeeTrackerQuestions();
    }
  );
}

function viewEmployeeRoles() {
  connection.query("SELECT * FROM role", function (err, res) {
    if (err) throw err;
    console.table(res);
    loadEmployeeTrackerQuestions();
  });
}

function viewDepartments() {
  connection.query("SELECT * FROM department", function (err, res) {
    if (err) throw err;
    console.table(res);
    loadEmployeeTrackerQuestions();
  });
}

function addDepartment() {
  inquirer
    .prompt([
      {
        name: "department",
        type: "input",
        message: "Add a New Department: ",
      },
    ])
    .then((res) => {
      connection.query(
        `INSERT INTO department(department_name) VALUES ("${res.department}")`,
        (err, res) => {
          if (err) throw err;
          loadEmployeeTrackerQuestions();
          console.log("Department has been added!");
        }
      );
    });
}

function addNewEmployee() {
  connection.query(`SELECT * FROM role`, (err, role) => {
    if (err) throw err;
    const roleList = role.map((r) => {
      return {
        name: r.title,
        value: r.id,
      };
    });
    inquirer
      .prompt([
        {
          type: "input",
          name: "first_name",
          message: "What is the first name of the new employee?",
        },
        {
          type: "input",
          name: "last_name",
          message: "What the last name of the new employee?",
        },
        {
          type: "list",
          name: "role_id",
          message: "What is the role of this new employee?",
          choices: roleList,
        },
      ])
      .then((res) => {
        connection.query(
          `INSERT INTO employee(first_name, last_name, role_id) 
          VALUES ("${res.first_name}", "${res.last_name}", ${res.role_id})`,
          (err, res) => {
            if (err) throw err;
            loadEmployeeTrackerQuestions();
          }
        );
        console.log("Employee has been added!");
      });
  });
}

function addEmployeeRoles() {
  connection.query(`SELECT * FROM department`, (err, department) => {
    if (err) throw err;
    const departmentList = department.map((d) => {
      return {
        name: d.department_name,
        value: d.id,
      };
    });
    inquirer
      .prompt([
        {
          type: "input",
          name: "title",
          message: "What is the title of this new role?",
        },
        {
          type: "input",
          name: "salary",
          message: "What is the salary of this role?",
        },
        {
          type: "list",
          name: "department",
          message: "What department would you like to add this to?",
          choices: departmentList,
        },
      ])
      .then((res) => {
        connection.query(
          `INSERT INTO role(title, salary, department_id) VALUES ("${res.title}","${res.salary}","${res.department}")`,
          (err, res) => {
            if (err) throw err;
            loadEmployeeTrackerQuestions();
          }
        );
        console.log("Role has been added!");
      });
  });
}

function updateEmployeeRole() {
  connection.query(`SELECT * FROM employee`, (err, employee) => {
    if (err) throw err;
    const allEmployees = employee.map((e) => {
      return {
        name: `${e.first_name} ${e.last_name}`,
        value: e.id,
      };
    });
    connection.query(`SELECT title, id FROM role`, (err, role) => {
      if (err) throw err;
      const updateRole = role.map((r) => {
        return {
          name: r.title,
          value: r.id,
        };
      });
      inquirer
        .prompt([
          {
            type: "list",
            name: "employee",
            message: "Which Employee Role would you like to update?",
            choices: allEmployees,
          },
          {
            name: "role",
            type: "list",
            message: "What role are you adding?",
            choices: updateRole,
          },
        ])
        .then((res) => {
          connection.query(
            `UPDATE employee SET role_id=${res.role} WHERE id=${res.employee}`,
            (err, res) => {
              if (err) throw err;
              loadEmployeeTrackerQuestions();
            }
          );
        });
    });
  });
}

// async function viewEmployees() {
//   const employees = db.findAllEmployees((cb) => {
//     console.table(cb);
//     loadEmployeeTrackerQuestions();
//   });
// }

// // add new employee

// async function addNewEmployee() {
//   const employees = await db.findAllEmployees();
//   const roles = await db.findAllRoles();
//   const employee = await prompt(
//     {
//       name: "first_name",
//       message: "What is the new employee's first name?",
//     },
//     {
//       name: "last_name",
//       message: "What is the new employee's last name?",
//     }
//   );
//   const roleChoices = roles.map(({ id, title }) => ({
//     name: title,
//     value: id,
//   }));
//   const { roleId } = await prompt([
//     {
//       type: "list",
//       name: "roleId",
//       message: "What is the new employee's role.",
//       choices: roleChoices,
//     },
//   ]);
//   employee.role_id = roleId;
//   const managerChoices = employee.map(({ id, first_name, last_name }) => ({
//     name: `${first_name} ${last_name}`,
//     value: id,
//   }));
//   managerChoices.unshift({
//     name: "None",
//     value: null,
//   });
//   const { managerId } = await prompt({
//     type: "list",
//     name: "managerId",
//     message: "Who is the new employee's manager?",
//     choices: managerChoices,
//   });
//   employee.manager_id = managerId;
//   await db.createEmployee(employee);
//   console.log(`${employee.first_name} ${employee.last_name} has been added.`);
//   loadEmployeeTrackerQuestions();
// }

// // remove ex employees
// async function removeFormerEmployee() {
//   const employees = await db.findAllEmployees();
//   const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
//     name: `${first_name} ${last_name}`,
//     value: id,
//   }));
//   const { employeeId } = await prompt({
//     type: "list",
//     name: "employeeId",
//     message: "Who would you like to remove?",
//     choices: employeeChoices,
//   });
//   await db.removeFormerEmployee(employeeId);
//   console.log(`${employee.first_name} ${employee.last_name} has been removed.`);
//   loadEmployeeTrackerQuestions();
// }

// // update existing employees
// // update employee role ?????
// async function updateEmployeeRole() {
//   const employees = await db.findAllEmployees();
//   const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
//     name: `${first_name} ${last_name}`,
//     value: id,
//   }));
//   const { employeeId } = await prompt([
//     {
//       type: "list",
//       name: "employeeId",
//       message: "Who's role do you need to changed?",
//       choices: employeeChoices,
//     },
//   ]);
//   const roles = await db.findAllRoles();
//   const roleChoices = roles.map(({ id, title }) => ({
//     name: title,
//     value: id,
//   }));
//   const { roleId } = await prompt({
//     type: "list",
//     name: "roleId",
//     message: "What is their new role in the organization?",
//     choices: roleChoices,
//   });
//   await db.updateEmployeeRole(employeeId, roleId);
//   console.log(
//     `Employee role for ${employee.first_name} ${employee.last_name} has been changed.`
//   );
//   loadEmployeeTrackerQuestions();
// }

// // view all roles
// async function viewEmployeeRoles() {
//   const employeeRoles = db.findAllRoles((cb) => {
//     console.table(cb);
//     loadEmployeeTrackerQuestions();
//   });
// }

// // add new roles
// async function addEmployeeRoles() {
//   const departments = await db.findAllByDepartments;
//   const departmentChoices = departments.map(({ id, name }) => ({
//     name: name,
//     value: id,
//   }));
//   const role = await prompt([
//     {
//       name: "title",
//       message: "What is the name of the role being added?",
//     },
//     {
//       name: "salary",
//       message: "What is the salary for this role?",
//     },
//     {
//       type: "list",
//       name: "department_id",
//       message: "Which department does the role align with?",
//       choices: departmentChoices,
//     },
//   ]);
//   await db.addEmployeeRoles(role);
//   console.log(`${role.title} has been added to the database.`);
//   loadEmployeeTrackerQuestions();
// }

// //view departments
// async function viewDepartments() {
//   const departments = await db.findAllDepartments();
//   console.log("\n");
//   console.table(departments);
//   loadMainPrompts();
// }

// // add department
// async function addDepartment() {
//   const department = await prompt([
//     {
//       name: "name",
//       message: "What is the name of the department?",
//     },
//   ]);
//   await db.addDepartment(department);
//   console.log(`Added ${department.name} to the database`);
//   loadMainPrompts();

function quit() {
  console.log("Goodbye!");
  process.exit();
}

init();
