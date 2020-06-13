use employees;

INSERT INTO department
    (department_name)
VALUES
    ('Sales'),
    ('Operations'),
    ('Investments'),
    ('Lending'),
    ('Leadership');

INSERT INTO role
    (title, salary, department_id)
VALUES
    ('District Manager', 120000, 5),
    ('Center Manager', 100000, 5),
    ('Operations Manager', 80000, 2),
    ('Banker 1', 50000, 1),
    ('Banker 2', 60000, 1),
    ('Banker 3', 70000, 1),
    ('Mortgage Officer', 90000, 4),
    ('Financial Services Advisor', 90000, 1),
    ('Small Business Banker', 90000, 1);

INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('Justin', 'Credible', 1, NULL),
    ('Johnathan', 'Walker', 2, 1),
    ('Joseph', 'Quervo', 3, 2),
    ('Jackson', 'Daniels', 9, 1),
    ('James', 'Beam', 8, 1),
    ('Thomas', 'Dewar', 7, 1),
    ('Charles', 'Tanqueray', 6, 2),
    ('Robert', 'Roy', 6, 2),
    ('Carlos', 'Baquardi', 5, 2),
    ('Tito', 'Sanchez', 5, 2),
    ('James', 'Morgain', 4, 3),
    ('Kieth', 'Stone', 4, 3),
    ('Bud', 'Knight', 4, 3),
    ('Remy', 'Martin', 8, 1);