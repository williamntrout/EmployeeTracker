DROP DATABASE IF EXISTS employee_trackerDB;
CREATE DATABASE employee_trackeDB;
USE employee_trackerDB;

CREATE TABLE department(
    id INT UNSIGNED AUTO_INCREMENT NOT NULL,
    name VARCHAR (30) UNIQUE NOT NULL
);

CREATE TABLE role (
    id IN UNSIGNED AUTO_INCREMENT NOT NULL,
    title VARCHAR (30) UNIQUE NOT NULL,
    salary DECIMAL UNSIGNED NOT NULL,
    department_id INT UNSIGNED NOT NULL,
    INDEX dep_ind (department_id),
    CONSTRAINT fk_department
        FOREIGN KEY (department_id)
        REFERENCES department(id)
        ON DELETE CASCADE
);

CREATE TABLE (
    id IN UNSIGNED AUTO_INCREMENT NOT NULL,
    first_name VARCHAR (30) UNIQUE NOT NULL,
    last_name VARCHAR (30) UNIQUE NOT NULL,
    role_id INT UNSIGNED NOT NULL,
    INDEX role_id (role_id),
    CONSTRAINT fk_role 
        FOREIGN KEY (role_id)
        REFERENCES role(id)
        ON DELETE CASCADE,
    manager_id INT UNSIGNED NOT NULL,
    INDEX manager_id (manager_id),
    CONSTRAINT fk_manager
        FOREIGN KEY (manager_id)
        REFERENCES manager(id)
        ON DELETE SET NULL
);