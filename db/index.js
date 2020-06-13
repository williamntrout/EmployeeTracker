const connection = require("./connection");

class DB {
  constructor(connection) {
    this.connection = connection;
  }

  // view employees
  // is there a better way to format this?  it looks messy and is hard to follow, it may be wrong...
  findAllEmployees(cb) {
    this.connection.query(
      "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;",
      (err, data) => {
        cb(data);
      }
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

  // view all roles
  findAllRoles(cb) {
    this.connection.query(
      "SELECT role.id, role.title, department.name AS department, role.salary FROM role LEFT JOIN department on role.department_id = department.id;",
      (err, data) => {
        cb(data);
      }
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
}

module.exports = new DB(connection);
