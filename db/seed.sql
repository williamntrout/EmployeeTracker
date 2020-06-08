use employees;

INSERT INTO department
    (name)
VALUES
    ('Sales'),
    ('Operations'),
    ('Investments'),
    ('Lending'),
    ('Leadership');

INSERT INTO role
    (title, salary, department_id)
VALUES
    ('District Manager', 120000, 1),
    ('Center Manager', 100000, 2),
    ('Operations Manager', 80000, 2),
    ('Banker 1', 50000, 3),
    ('Banker 2', 60000, 3),
    ('Banker 3', 70000, 3),
    ('Mortgage Officer', 90000, 4),
    ('Financial Services Advisor', 90000, 5),
    ('Small Business Banker', 90000, 6);

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('Justin', 'Credible', 1, NULL),
    ('John', 'Walker', 2, 1),
    ('Joseph', 'Quervo', 3, NULL),
    ('Jackson', 'Daniels', 4, 3),
    ('James', 'Beam', 5, NULL),
    ('Thomas', 'Dewar', 6, 5),
    ('Charles', 'Tanqueray', 7, NULL),
    ('John', 'Jameson', 8, 7);