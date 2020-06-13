const inquirer = require("inquirer");
const mysql = require("mysql");
const db = require("./db");
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
      return viewAllEmployees();
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

function viewAllEmployees() {
  connection.query("SELECT * FROM employee", function (err, res) {
    if (err) throw err;
    console.table(res);
    loadEmployeeTrackerQuestions();
  });
}

// view departments, not working

function viewDepartments() {
  connection.query("SELECT * FROM department", function (err, res) {
    if (err) throw err;
    console.table(res);
    loadEmployeeTrackerQuestions();
  });
}

// view roles, not working

function viewEmployeeRoles() {
  connection.query("SELECT * FROM role", function (err, res) {
    if (err) throw err;
    console.table(res);
    loadEmployeeTrackerQuestions();
  });
}

// add department, not working

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

// add roles, not working

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

// add new employee, not working

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

// update employee info, role... not working...

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

function quit() {
  console.log("Goodbye!");
  process.exit();
}

init();
