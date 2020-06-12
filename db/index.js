const connection = require("./connection");

class DB {
  constructor(connection) {
    this.connection = connection;
  }

  // view employees
  // is there a better way to format this?  it looks messy and is hard to follow, it may be wrong...
  findAllEmployees() {
    return this.connection.query(
      "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;"
    );
  }

  // view employees by department
  // is there a better way to format this?  it looks messy and is hard to follow, it may be wrong...
  findAllEmployeesByDepartment(departmentId) {
    return this.connection.query(
      "SELECT employee.id, employee.first_name, employee.last_name, role.title FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department department on role.department_id = department.id WHERE department_id = ?;",
      departmentId
    );
  }

  // view employees by manager
  // is there a better way to format this?  it looks messy and is hard to follow, it may be wrong...
  findAllEmployeesByManager(managerId) {
    return this.connection.query(
      "SELECT employee.id, employee.first_name, employee.last_name, department.name AS department, role.title from employee LEFT JOIN role on employee.role_id LEFT JOIN department ON department.id = role.department_id WHERE manager_id = ?;",
      managerId
    );
  }

  // view employees by role
  // is there a better way to format this?  it looks messy and is hard to follow, this is  wrong...
  findAllEmployeesByRole(roleId) {
    return this.connection.query(
      "SELECT employee.id, employee.first_name, employee.last_name, department.name AS department, role.title from employee LEFT JOIN role on employee.role_id LEFT JOIN department ON department.id = role.department_id WHERE role_id = ?;",
      roleId
    );
  }

  // add new employee
  createEmployee(employee) {
    return this.connection.query("INSERT INTO employee SET ?", employee);
  }

  // remove employee
  removeFormerEmployee(employeeId) {
    return this.connection.query(
      "DELETE FROM employee WHERE id = ?",
      employeeId
    );
  }

  // update existing employees
  // update role
  updateEmployeeRole(employeeId, roleId) {
    return this.connection.query(
      "UPDATE employee SET role_id = ? WHERE id = ?",
      [roleId, employeeId]
    );
  }

  // update manager
  updateEmployeeManager(employeeId, managerId) {
    return this.connection.query(
      "UPDATE employee SET manager_id = ? WHERE id = ?",
      [managerId, employeeId]
    );
  }

  findAllManagers(employeeId) {
    return this.connection.query(
      "SELECT id, first_name, last_name FROM employee WHERE id != ?",
      employeeId
    );
  }

  // update department
  updateEmployeeDepartment(employeeId, departmentId) {
    return this.connection.query(
      "UPDATE employee SET department_id = ? WHERE id = ?",
      [departmentId, employeeId]
    );
  }

  // update salary??
  updateEmployeeSalary(employeeId, salaryId) {
    return this.connection.query(
      "UPDATE employee SET salary_id = ? WHERE id = ?",
      [salaryId, employeeId]
    );
  }

  // view all roles
  findAllRoles() {
    return this.connection.query(
      "SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id;"
    );
  }

  // add new roles
  addEmployeeRoles(role) {
    return this.connection.query("INSERT INTO role SET ?", role);
  }

  // remove role
  removeEmployeeRoles(roleId) {
    return this.connection.query("DELETE FROM role WHERE id = ?", roleId);
  }

  //view departments ????? this is very wrong
  viewDepartments() {
    return this.connection.query(
      "SELECT department.id, department.name FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department department on role.department_id = department.id WHERE department.id",
      departmentId
    );
  }

  // add department
  addDepartment(department) {
    return this.connection.query("INSERT INTO department SET ?", department);
  }

  // remove department
  removeDepartment(departmentId) {
    return this.connection.query(
      "DELETE FROM department WHERE ID = ?",
      departmentId
    );
  }
  // not sure how to do this
  // view total payroll

  // view department specific payroll

  // view role specific payroll
}

module.exports = new DB(connection);
