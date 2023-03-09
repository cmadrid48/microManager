Command-line Employee Management System
This is a command-line application that allows users to manage employees, departments, and roles within a company. It is built using Node.js and utilizes the npm packages Inquirer, mysql2, and console.table.

Installation
Clone the repository to your local machine
bash
Copy code
git clone https://github.com/yourusername/employee-management-system.git
Install the required npm packages
Copy code
npm install
Set up the database using the provided schema.sql and seed.sql files
css
Copy code
mysql -u <username> -p < schema.sql
mysql -u <username> -p < seed.sql
Note: You will need to have MySQL installed on your machine and have access to a MySQL server in order to set up the database.
Usage
To start the application, navigate to the project directory in your terminal and enter the following command:

Copy code
node index.js
You will be presented with a menu of options:

View all departments
View all roles
View all employees
Add a department
Add a role
Add an employee
Update an employee role
Exit
Viewing Data
When you choose to view departments, roles, or employees, the data will be displayed in a formatted table in your terminal.

Adding Data
When you choose to add a department, role, or employee, you will be prompted to enter the relevant information. Once you have entered the information, it will be added to the database.

Updating Data
When you choose to update an employee's role, you will be prompted to select the employee you wish to update and the new role you want to assign to them. Once you have made your selections, the information will be updated in the database.

Exiting the Application
To exit the application, choose option 8 from the menu.

Credits
This application was built using Node.js and utilizes the following npm packages:

Inquirer - https://www.npmjs.com/package/inquirer
mysql2 - https://www.npmjs.com/package/mysql2
console.table - https://www.npmjs.com/package/console.table
License
This project is licensed under the terms of the MIT license.