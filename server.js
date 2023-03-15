const mysql = require('mysql2');
const inquirer = require('inquirer');
require('console.table');

const db = mysql.createConnection({
    host: 'localhost',

    port: 3306,

    user: 'root',

    password: 'kv4fu5iiw7vzReff3r!@#$'
});

db.connect(function (err) {
    if (err) throw err;
    console.log('connected as' + db.threadId);
    console.log('welcome to the micro manager')

    init();
});

function init() {

    inquirer
    .prompt({
        type: 'list',
        name: 'task',
        message: 'what does thou desire?',
        choices: [
        "View Employees",
        "View Employees by Department",
        "Add Employee",
        "Remove Employees",
        "Update Employee Role",
        "Add Role",
        "Update Employee Manager",
        "End"
        ]
    })
    .then(function({ task }) {
        switch (task) {
            case 'View Employess':
                viewEmployees();
                break;
            case 'View Employees By Department':
                viewEmployeeByDepartment();
                break;
            case 'ADD an Employee':
                addEmployee();
                break;
            case 'REMOVE an Employee':
                removeEmployee();
                break;
            case 'Updated Employee Role':
                updateEmployeeRole();
                break;
            case 'ADD a role':
                addRole();
                //done
                break;
            case 'Update Employee Manager':
                updateEmployeeManager();
                //done
                break;
            case 'END':
                db.end();
                //done
                break;
        }
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

    db.query(query, function (err, res) {
        if (err) throw err;

        const deptChoices = res.map(({ id, name }) => ({
            value: id, name: `${id}${name}`
        }));

        console.table(res);
        console.log('Deapartment Array');

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

    db.query(query, {
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
    db.query(query, (req, res) => {
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
                db.query(query, (req, res) => {
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
                    db.query(query, [answer.manager.split(" ")[0], answer.manager.split(" ")[1]], (err, data) => {
                        if (err) throw err;
                        const managerId = data[0].id;
                        
                        const query = `UPDATE employee SET manager_id = ? WHERE first_name = ? AND last_name = ?`;
                        db.query(
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



