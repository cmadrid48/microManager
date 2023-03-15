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
                break;
            case 'Update Employee Manager':
                updateEmployeeManager();
                break;
            case 'END':
                db.end();
                break;
        }
    });
}