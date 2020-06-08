require("console.table");
const inquirer = require("inquirer");
const mysql = require("mysql");
const db = require("./db");
const util = require("util");
const {
    prompt
} = require("inquirer");

function init() {
    console.log("Employee Tracker");
    loadEmployeeTrackerQuestions();
};
async function loadEmployeeTrackerQuestions() {
    const {
        choice
    } = await prompt([{
        type: "list",
        name: "choice",
        message: "Welcome to the Employee Tracking System.  What would you like to accomplish?"
        choices: [{
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
                value: "VIEW_EMPLOYEES_BY_ROLE"
            },
            {
                name: "Add New Employee",
                value: "ADD_NEW_EMPLOYEE"
            },
            {
                name: "Remove Former Employee",
                value: "REMOVE_FORMER_EMPLOYEE"
            },
            {
                name: "Update Employee Role",
                value: "UPDATE_EMPLOYEE_ROLE"
            },
            {
                name: "Update Employee Manager",
                value: "UPDATE_EMPLOYEE_MANAGER"
            },
            {
                name: "Update Employee Department",
                value: "UPDATE_EMPLOYEE_DEPARTMENT"
            },
            {
                name: "View Roles",
                value: "VIEW_ROLES"
            },
            {
                name: "Add Roles",
                value: "ADD_ROLES"
            },
            {
                name: "Remove Roles",
                value: "REMOVE_ROLES"
            },
            {
                name: "Add Department",
                value: "ADD_DEPARTMENT"
            },
            {
                name: "Remove Department",
                value: "REMOVE_DEPARTMENT"
            },
            {
                name: "Add Department Manager",
                value: "ADD_DEPARTMENT_MANAGER"
            },
            {
                name: "Remove Department Manager",
                value: "REMOVE_DEPARTMENT_MANAGER"
            },
            {
                name: "View Total Payroll",
                value: "VIEW_TOTAL_PAYROLL"
            },
            {
                name: "View Department Payroll",
                value: "VIEW_DEPARTMENT_PAYROLL"
            },
            {
                name: "View Role Specific Payroll",
                value: "VIEW_ROLE_SPECIFIC_PAYROLL"
            },
            {
                name: "Leave Employee Tracker",
                value: "QUIT"
            }
        ]
    }]);


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
        case "VIEW_ROLES":
            return viewRoles;
        case "ADD_ROLES":
            return addRoles;
        case "REMOVE_ROLES":
            return removeRoles;
        case "ADD_DEPARTMENT":
            return addDepartment;
        case "REMOVE_DEPARTMENT":
            return removeDepartment;
        case "ADD_DEPARTMENT_MANAGER":
            return addDepartmentManager;
        case "REMOVE_DEPARTMENT_MANAGER":
            return removeDepartmentManager;
        case "VIEW_TOTAL_PAYROLL":
            return viewTotalPayroll;
        case "VIEW_DEPARTMENT_PAYROLL":
            return viewDepartmentPayroll;
        case "VIEW_ROLE_SPECIFIC_PAYROLL":
            return viewRoleSpecificPayroll;
        default:
            return quit();
    };

};

// functions
// view employees 
async function viewEmployees() {
    const employees = await db.findAllEmployees();
    console.log('\n');
    console.table(employees);
    loadEmployeeTrackerQuestions();
};

// view employees by department
async function viewEmployeesByDepartment() {
    const departments = await db.findAllEmployeesByDepartments();
    const departmentChoices = departments.map (({
        id,
        name
    }) => ({ 
        name: name,
        value: id 
        }));
    const { departmentId } = await prompt([{
        type: "list",
        name: "departmentId",
        message "Which department would you like to display?",
        choices: departmentChoices
    }]);
    const employees = await db.findAllEmployeesByDepartment(departmentId);
    console.log('\n');
    console.table(employees);
    loadEmployeeTrackerQuestions();
};

// view employees by manager

async function viewEmployeesByManager() {
    const managers = await db.findAllEmployeesByManager();
    const managerChoices = managers.map(({
        id,
        first_name,
        last_name
    }) => ({
        name: `${first_name} ${last_name}`,
        value: id
        }));
    const { managerId } = await prompt(({
        type: "list",
        name: "managerId",
        message: "Which manager's direct reports would you like to display?", choices: managerChoices
    }));
    const employees = await db.findAllEmployeesByManager(managerId);
    console.log('\n');
    if (employees.lenghth === 0) {
        console.log('No direct reports.');
    } else {
        console.table(employees);
    }
    loadEmployeeTrackerQuestions();
};

// view employees by role. Not required, but I wanted to test my understanding.
// get someone to look at it.

async function viewEmployeesByRole() {
    const employees = await db.findAllEmployeesByRole();
    const roleChoices = roles.map(({
        id,
        first_name,
        last_name
    }) => ({
        name: `${first_name} ${last_name}`,
        value: id
        }));
    const { roleId } = await prompt(({
        type: "list",
        name: "roleId",
        message: "Which role's roster do you wish to view?", choices: managerChoices
    }));
    const employees = await db.findAllEmployeesByRole(roleId);
    console.log('\n');
    if (employees.lenghth === 0) {
        console.log('None specified.');
    } else {
        console.table(employees);
    }
    loadEmployeeTrackerQuestions();
};

// add new employee

async function addNewEmployee() {
    const employees = await db.findAllEmployees();
    const roles = await db.findAllRoles();
    const employee = await prompt({
        name: "first_name",
        message: "What is the new employee's first name?"
    },
    {
        name: "last_name",
        message: "What is the new employee's last name?"
        });
    const roleChoices = roles.map(({
        id,
        title
    }) => ({
        name: title,
        value: id
        }));
    const {
        roleId
    } = await prompt([
        type: "list",
        name: "roleId",
        message: "What is the new employee's role.",
        choices: roleChoices
    ]);
    employee.role_id = roleId;
    const managerChoices = employee.map(({
        id,
        first_name,
        last_name,
    }) => ({
        name: `${first_name} ${last_name}`,
        value: id
        }));
    managerChoices.unshift({
        name: "None",
        value: null
    });
    const { managerId } = await prompt({
        type: "list",
        name: "managerId",
        message: "Who is the new employee's manager?",
        choices: managerChoices
    });
    employee.manager_id = managerId;
    await db.createEmployee(employee);
    console.log(`${employee.first_name} ${employee.last_name} has been added.`);
    loadEmployeeTrackerQuestions();
};







init();