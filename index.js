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

async function viewEmployeesByDepartment(){
    const departments = await db.findAllDepartments();
    const departmentChoices = departments.map (({
        id, name
    }) => ({ 
        name:  name,
        value: id 
    }));

}



init();