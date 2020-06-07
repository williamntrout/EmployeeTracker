const util = require("util");
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  port: 8000,
  user: "root",
  password: "password",
  database: "employee_trackerDB",
});

connection.connect();

connection.query = util.promisify(connection.query);

module.exports = connection;
