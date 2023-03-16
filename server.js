const mysql = require('mysql2');
const inquirer = require('inquirer');
require('console.table');

const connection = mysql.createConnection({
host: 'localhost',

    port: 3306,

    user: 'root',

    password: 'password',

    database: 'employeesDB'
});

connection.connect(function (err) {
    if (err) throw err;
    console.log('connected as' + connection.threadId);
    console.log('welcome to the micro manager')

    init();
});

function init() {

    inquirer
    .prompt({
        type: "list",
        name: "task",
        message: 'what does thou desire?',
        choices: [
        "View Employees",
        "View Employees by Department",
        "ADD an Employee",
        "REMOVE an Employee",
        "Update Employee Role",
        "ADD a Role",
        "Update Employee Manager",
        "END"
        ]
    })
    .then(function({ task }) {
        switch (task) {
            case "View Employees":
                viewEmployees();
                break;

            case "View Employees By Department":
                viewEmployeeByDepartment();
                break;

            case "ADD an Employee":
                addEmployee();
                break;

            case "REMOVE an Employee":
                removeEmployee();
                break;

            case "Updated Employee Role":
                updateEmployeeRole();
                break;

            case "ADD a role":
                addRole();
                break;

            case "Update Employee Manager":
                updateEmployeeManager();
                break;

            case "END":
                connection.end();
                break;

        }
    });
}

function removeEmployee() {
    console.log("Deleting an employee");

    var query =
    `SELECT e.id, e.first_name, e.last_name
    FROM employee e`

    connection.query(query, function (err, res) {
    if (err) throw err;

    const deleteEmployeeChoices = res.map(({ id, first_name, last_name }) => ({
        value: id, name: `${id} ${first_name} ${last_name}`
    }));

    console.table(res);
    console.log("ArrayToDelete!\n");

    promptDelete(deleteEmployeeChoices);
    });
}


function promptDelete(deleteEmployeeChoices) {

    inquirer
    .prompt([
        {
            type: "list",
            name: "employeeId",
            message: "Which employee do you want to remove?",
            choices: deleteEmployeeChoices
        }
    ])
    .then(function (answer) {

        var query = `DELETE FROM employee WHERE ?`;
        
        connection.query(query, { id: answer.employeeId }, function (err, res) {
        if (err) throw err;

        console.table(res);
        console.log(res.affectedRows + "Deleted!\n");

        init();
        });
    });
}

function addEmployee() {
    console.log("Inserting an employee")

    var query =
    `SELECT r.id, r.title, r.salary 
    FROM role r`

    connection.query(query, function (err, res) {
    if (err) throw err;

    const roleChoices = res.map(({ id, title, salary }) => ({
        value: id, title: `${title}`, salary: `${salary}`
    }));

    console.table(res);
    console.log("RoleToInsert!");

    promptInsert(roleChoices);
    });
}

function promptInsert(roleChoices) {

    inquirer
    .prompt([
        {
            type: "input",
            name: "first_name",
            message: "What is the employee's first name?"
        },
        {
            type: "input",
            name: "last_name",
            message: "What is the employee's last name?"
        },
        {
            type: "list",
            name: "roleId",
            message: "What is the employee's role?",
            choices: roleChoices
        },
    ])
    .then(function (answer) {
        console.log(answer);

        var query = `INSERT INTO employee SET ?`
        
        connection.query(query,
        {
            first_name: answer.first_name,
            last_name: answer.last_name,
            role_id: answer.roleId,
            manager_id: answer.managerId,
        },
        function (err, res) {
            if (err) throw err;

            console.table(res);
            console.log(res.insertedRows + "Inserted successfully!\n");

            init();
        });
    });
}

function updateEmployeeRole() {
    employeeArray();
}

function employeeArray() {
    console.log('updating an employee');

    var query =
    `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
    FROM employee e
    JOIN role r
	ON e.role_id = r.id
    JOIN department d
    ON d.id = r.department_id
    JOIN employee m
	ON m.id = e.manager_id`

    connection.query(query, function (err, res) {
        if (err) throw err;

        const employeeChoice = res.map(({ id, first_name, last_name}) => ({
            value: id,
            name: `${first_name}${last_name}`
        }));

        console.table(res);
        console.log('employee array updated\n')

        rolesArray(employeeChoice);
    });
}

function rolesArray(employeeChoice) {
    console.log('updating a role');

    var query =
    `SELECT r.id, r.title, r.salary 
    FROM role r`
    let roleChoices;

    connection.query(query, function (err, res) {
        if (err) throw err;

        roleChoices = res.map(({ id, title, salary }) => ({
            value: id,
            title: `${title}`,
            salary: `${salary}`
        }));

        console.table(res);
        console.log('roles array updated\n');

        promptEmployeeRole(employeeChoice, roleChoices);
    });
}

function promptEmployeeRole(employeeChoices, roleChoices) {

    inquirer
    .prompt([
        {
            type: "list",
            name: "employeeId",
            message: "Which employee do you want to set with the role?",
            choices: employeeChoices
        },
        {
            type: "list",
            name: "roleId",
            message: "Which role do you want to update?",
            choices: roleChoices
        },
    ])
    .then(function (answer) {

        var query = `UPDATE employee SET role_id = ? WHERE id = ?`
        
        connection.query(query, [ answer.roleId, answer.employeeId ],
        function (err, res) {
            if (err) throw err;

            console.table(res);
            console.log(res.affectedRows + "updated successfully!");

            init();
        });
    });
}

function viewEmployeeByDepartment() {
    console.log('viewing employess by department\n');

    var query =
    `SELECT d.id, d.name, r.salary AS budget
    FROM employee e
    LEFT JOIN role r
	ON e.role_id = r.id
    LEFT JOIN department d
    ON d.id = r.department_id
    GROUP BY d.id, d.name`

    connection.query(query, function (err, res) {
        if (err) throw err;

        const deptChoices = res.map(data => ({
            value: data.id,
            name: data.name
        }));

        console.table(res);
        console.log('department view succeeded\n');

        promptDept(deptChoices);
    });
}

function promptDept(deptChoices) {

    inquirer
    .prompt([
        {
            type: "list",
            name: "departmentId",
            message: "Which department would you choose?",
            choices: deptChoices
        }
    ])
    .then(function (answer) {
        console.log('answer', answer.departmentId);

        var query =
        `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department 
        FROM employee e
        JOIN role r
        ON e.role_id = r.id
        JOIN department d
        ON d.id = r.department_id
        WHERE d.id = ?`

        connection.query(query, answer.departmentId, function (err, res) {
            if (err) throw err;

            console.table('response', res);
            console.log(res.affectedRows + 'employees are being viewed\n');

            init();
        });
    });
}

function viewEmployees() {
    console.log('viewing employees\n');

    var query =
    `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
    FROM employee e
    LEFT JOIN role r
	ON e.role_id = r.id
    LEFT JOIN department d
    ON d.id = r.department_id
    LEFT JOIN employee m
	ON m.id = e.manager_id`

    connection.query(query, function (err, res) {
        if (err) throw err;

        console.table(res);
        console.log('employess\n');

        init();
    });
}

function addRole() {
    var query = 
    `SELECT d.id, d.name, r.salary AS budget
    FROM employee e
    JOIN role r
    ON e.role_id = r.id
    JOIN department d
    ON d.id = r.department_id
    GROUP BY d.id, d.name`

    connection.query(query, function (err, res) {
        if (err) throw err;

        const deptChoices = res.map(({ id, name }) => ({
            value: id, name: `${id}${name}`
        }));

        console.table(res);
        console.log('Department Array');

        promptAddRole(deptChoices);
    });
}

function promptAddRole(deptChoices) {
    inquirer
    .prompt([
    {
        type: "input",
        name: "roleTitle",
        message: "Role title?"
    },
    {
        type: "input",
        name: "roleSalary",
        message: "Role Salary"
    },
    {
        type: "list",
        name: "departmentId",
        message: "Department?",
        choices: deptChoices
    },
    ])
    .then(function (answer) {

    var query = `INSERT INTO role SET ?`

    connection.query(query, {
        title: answer.title,
        salary: answer.salary,
        department_id: answer.departmentId
    },
        function (err, res) {
        if (err) throw err;

        console.table(res);
        console.log("Role Inserted");

        init();
        });

    });
}

function updateEmployeeManager() {
    const query = `SELECT first_name, last_name FROM employee;`;
    connection.query(query, (req, data) => {
        const employees = data.map(
            (item) => `${item.first_name} ${item.last_name}`
        );
        
        inquirer
        .prompt([
            {
            name: "employee",
            type: "list",
            message: "which employee would you like to update?",
            choices: employees,
            },
            ])
            .then((answer) => {
                const userSelect = answer.employee.split(" ");
                const firstName = userSelect[0];
                const lastName = userSelect[1];

                const query = `SELECT 
                first_name, last_name 
                FROM employee 
                WHERE manager_id IS NULL 
                AND first_name != '${firstName}' 
                AND last_name != '${lastName}';`;
                connection.query(query, (req, res) => {
                const managers = data.map((item) => `${item.first_name}${item.last_name}`);

                inquirer
                .prompt({
                    name: "manager",
                    type: "list",
                    message: "Who is the employee's new manager?",
                    choices: managers,
                })
                .then((answer) => {
                    const query = `SELECT id FROM employee WHERE first_name = ? AND last_name = ?`;
                    connection.query(query, [answer.manager.split(" ")[0], answer.manager.split(" ")[1]], (err, data) => {
                        if (err) throw err;
                        const managerId = data[0].id;
                        
                        const query = `UPDATE employee SET manager_id = ? WHERE first_name = ? AND last_name = ?`;
                        connection.query(
                            query,
                            [managerId, firstName, lastName],
                            (err, data) => {
                                if (err) throw err;
                                console.log(`Successfully updated ${firstName} ${lastName}'s manager to ${answer.manager}.`);

                                init();
                            }
                        );
                    });
                });
            });
        });
    });
}



