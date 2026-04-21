DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS project_emp;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS attendance;
DROP TABLE IF EXISTS employees;

CREATE TABLE employees (
    id INT PRIMARY KEY,
    name VARCHAR(50)
    role ENUM('admin', 'manager', 'developer'),
    salary DECIMAL(15,2)
)

CREATE TABLE attendance (
    id INT PRIMARY KEY,
    emp_id INT,
    status ENUM('present', 'absent', 'sick', 'leave'),
    date DATE,
    clock_in TIMESTAMP,
    clock_out  TIMESTAMP,

    CONSTRAINT fk_employee
        FOREIGN KEY (emp_id) REFERENCES employees (id)
        ON DELETE CASCADE
)

CREATE TABLE projects (
    id INT PRIMARY KEY,
    title VARCHAR(255)
    manager_id INT,
    budget DECIMAL(15,2),
    revenue DECIMAL(15,2),

    CONSTRAINT fk_project_manager
        FOREIGN KEY (manager_id) REFERENCES employees (id)
        ON DELETE CASCADE


)

CREATE TABLE project_emp (
    emp_id INTEGER,
    project_id INTEGER,
    role_in_project VARCHAR(50),
    date_assigned DATE DEFAULT CURRENT_DATE,

    PRIMARY KEY (emp_id, project_id),

    CONSTRAINT fk_employee 
        FOREIGN KEY (emp_id) REFERENCES employees(id) 
        ON DELETE CASCADE,
        
    CONSTRAINT fk_project 
        FOREIGN KEY (project_id) REFERENCES projects(id) 
        ON DELETE CASCADE
);

CREATE TABLE tasks (
    id INTEGER PRIMARY KEY,
    title VARCHAR(255),
    emp_id INTEGER,
    project_id INTEGER,
    status ENUM('todo', 'on progress', 'done'),

    FOREIGN KEY (emp_id, project_id) 
        REFERENCES project_emp(emp_id, project_id)
        ON DELETE CASCADE
);

-- Absensi Karyawan
SELECT 
	a.date, 
    a.emp_id,
    emp.name, 
    a.status, 
    a.clock_in, 
    a.clock_out
FROM attendance a
JOIN employees emp ON a.emp_id = emp.id;

-- list tugas setiap karyawan
SELECT 
    t.title AS task_name, 
    t.status, p.title AS project_name
FROM tasks t
JOIN projects p ON t.project_id = p.id;

-- list orang2 yang mengikuti sebuah project yang dia kerjakan
SELECT emp.name, pe.role_in_project, pe.date_assigned
FROM  project_emp pe
JOIN employees emp ON pe.emp_id = emp.id;

-- menghitung pengeluaran project untuk membayar karyawan (hanya manajer)
SELECT
    p.title,
    SUM(emp.salary) AS total_salary_team
FROM projects p
JOIN project_emp  pe ON p.id = pe.project_id
JOIN employees emp ON pe.emp_id = emp.id
GROUP BY p.title;

-- menghitung keuntungan dari hasil menyelesaikan project (hanya manajer)
SELECT 
    title AS Project_Name,
    budget,
    revenue,
    (revenue - budget) AS gross_profit
FROM projects;

