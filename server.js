const mysql = require('mysql');
const express = require('express');
const session = require('express-session');

//File Upload
const multer = require('multer');
//Alert message
const flash = require('express-flash');

const path = require('path');
const conn = require('./dbConfig');
// const { Collapse } = require('bootstrap');
// const { Console } = require('console');

const nodemailer = require('nodemailer');
const app = express();

// Initialize flash
app.use(flash());

// Set up Multer storage
const storage = multer.diskStorage({
    destination: 'uploads/', // Specify the upload directory
    filename: function(req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Set the filename to be unique
    }
});

const upload = multer({ storage: storage })

// set the view engine to ejs
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



app.use(session({
	secret: 'yoursecret',
	resave: false,
	saveUninitialized: false
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//using app.use to erve up static css files in public /assets/ folder when /public link is called in ejs files 
//app.use("/route", express.static("foldername"));
// app.use('/src', express.static('src'));  
app.use(express.static(__dirname + '/src'));

// use res.render to load up an ejs view file


// Nodemailer setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'atraxgroup2024@gmail.com',
      pass: 'atrax@2024'
    }
  });

// Front end main page
app.get('/', function(req, res) {
	res.render('pages/index');
});

//Sign In Page
app.get('/signin', (req, res) => {
    
    // Display the list of visitors
    conn.query('SELECT * FROM employees', (err, employees) => {
        if (err) {
            console.error('Error fetching employees:', err);
            res.status(500).send('Internal Server Error');
        } else {
            res.render('pages/signin', { employees });
        }
    });
});

app.get("/autocomplete", (req, res) => {
    const searchQuery = req.query.query;

    if (!searchQuery) {
        return res.status(400).json({ error: "Missing search query" });
    }

    const sql = "SELECT id, full_name FROM employees WHERE full_name LIKE ?";
    const params = [`%${searchQuery}%`];

    conn.query(sql, params, (err, results) => {
        if (err) {
            console.error("Error fetching autocomplete data:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        res.json(results);
    });
});

app.post('/checkin', (req, res) => {
    const { name, from, email, phone, employee_id, q_2 } = req.body;

    // Validate required fields
    if (!name || !phone || !employee_id || employee_id === '') {
        return res.status(400).send('Name, phone, and visiting employee are required');
    }

    // Assuming the 'visitors' table has columns: name, from, email, phone, employee_id, health_safety
    const sql = `INSERT INTO front_visitors (name, \`from\`, email, phone, employee_id, health_safety) VALUES (?, ?, ?, ?, ?, ?)`;

    // Map the 'Yes' value to 1 and 'No' value to 0
    const healthSafetyValue = (q_2 === 'Yes') ? 1 : 0;

    conn.query(sql, [name, from, email, phone, employee_id, healthSafetyValue], (err, result) => {
        if (err) {
            console.error('Error inserting visitor data:', err);
            return res.status(500).send(`Error inserting visitor data: ${err.message}`);
        }

        // Assuming the 'employees' table has columns: id, email
        const employeeSql = 'SELECT id, email FROM employees WHERE id = ?';
        conn.query(employeeSql, [employee_id], (employeeErr, employeeResult) => {
            if (employeeErr) {
                console.error('Error fetching employee data:', employeeErr);
                return res.status(500).send(`Error fetching employee data: ${employeeErr.message}`);
            }

            const selectedEmployee = employeeResult[0];

         // Send email notification
        sendEmailNotification(name, selectedEmployee.email);

        console.log('Visitor data inserted successfully');
        res.redirect('/');

        });
    });
});


//SignOut page
app.get('/signout', function(req, res) {
	res.render('pages/signout');
});

// login page
app.get('/login', function(req, res) {
  res.render('pages/login', {errormessage:""});
});

app.post('/auth', function(req, res) {
    let username = req.body.username;
    let password = req.body.password;

    if (!username || !password) {
        // If either username or password is missing, render login page with error message
        return res.render('pages/login', { errormessage: "Please enter Username and Password!" });
    }

    // Query to check if the user with the provided username exists
    conn.query('SELECT * FROM users WHERE username = ?', [username], function(error, results, fields) {
        if (error) throw error;

        // If no user is found with the provided username, render login page with error message
        if (results.length === 0) {
            return res.render('pages/login', { errormessage: "Incorrect username" });
        }

        // Query to check if the user with the provided username and password exists
        conn.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
            if (error) throw error;

            // If a matching user is found, set session variables and redirect to dashboard
            if (results.length > 0) {
                req.session.loggedin = true;
                req.session.username = username;
                return res.redirect('dashboard');
            } else {
                // If no matching user is found with the provided password, render login page with error message
                return res.render('pages/login', { errormessage: "Incorrect password" });
            }
        });
    });
});


//Register page
app.get('/register', function(req, res) {
	res.render('pages/register');
});

//CREATE USER
app.post('/register', function(req, res) {
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var email = req.body.email;
    var phone = req.body.phone;
    var username = req.body.username;
    var password = req.body.password;

    if (username && password) {

        var sql = "INSERT INTO users (firstname, lastname, email, phone, username, password) VALUES (?, ?, ?, ?, ?, ?)";
        conn.query(sql, [firstname, lastname, email, phone, username, password], function(err, result) {

            if (err) throw err;
			console.log('record inserted');
			res.render('pages/login', { errormessage: "Registration successful" });
			
		})
	}
	else {
		// res.send('HELLO');
		console.log("Error");
	}
  });

  //USER LOGOUT
app.get('/logout',(req,res) => {
    req.session.destroy();
    res.redirect('/login');
});

// Users can access this if they are logged in
app.get('/dashboard', function (req, res) {
		if (req.session.loggedin) {
    res.render('pages/dashboard', {username:req.session.username});
	}
});

//Pre-registor Visitors page
app.get('/visitors', function(req, res) {
    if (req.session.loggedin) {
        // const sql = 'SELECT * FROM visitors';
        const sql = 'SELECT visitors.*, employees.full_name FROM visitors LEFT JOIN employees ON visitors.employees_id = employees.id';
        conn.query(sql, (err, data) => {
            if (err) throw err;
			// console.log(data);

            // Fetch employees from the database
            const employeesQuery = 'SELECT * FROM employees';
            conn.query(employeesQuery, (err, employees) => {
				// console.log(employees);
                if (err) {
                    console.error(err);
                    res.status(500).send('Internal Server Error');
                    return;
                }

                // Pass both visitorsData and employees to the template
                res.render('pages/visitors', { visitorsData: data, employees: employees, username:req.session.username });
            });
        });
    } else {
        res.redirect('/');
    }
});

// Pre-registering a visitor
app.post('/visitors', function(req, res) {
	if (true) {
	var visitors_full_name = req.body.visitors_full_name;
	var fromCompany = req.body.fromCompany;
	var email = req.body.email;
	var mobile = req.body.mobile;
	var employees_id = req.body.employees_id;
	var date = req.body.date;
	var start_time = req.body.start_time;
	var end_time = req.body.end_time;
	var message = req.body.message;
	console.log(visitors_full_name);
	
		if (visitors_full_name) {

		var sql = 'INSERT INTO visitors (visitors_full_name, fromCompany, email, mobile, employees_id, date, start_time, end_time, message) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
	   	conn.query(sql, [visitors_full_name, fromCompany, email, mobile, employees_id, date, start_time, end_time, message], function(err, result) {
                if (err) {
                    console.error(err);
                    res.status(500).send('Internal Server Error');
                } else {
                    console.log('Record inserted');
                    res.redirect('/visitors');
                }
            });
        } else {
            console.log("Error: Employee name or email is missing");
            res.status(400).send('Bad Request');
        }
    } else {
        res.redirect('/login');
    }
});

//  Deleting record of Pre-registored Visitors 
app.post('/delete_visitors', function(req, res) {
	var visitors_id = req.body.visitors_id;
	if (visitors_id) {
	   var sql = 'Delete from visitors where id=?';
	   conn.query(sql, [visitors_id], function(err, result) {
		  if (err) {
			 console.error(err);
			 res.status(500).send('Internal Server Error');
		  } else {
			 console.log('Record deleted');
			 res.redirect('/visitors');
		  }
	   });
	} else {
	   console.log("Error visitors name is missing");
	   res.status(400).send('Bad Request');
	}
 });


//SignIn/Out Manager page
app.get('/visitorcontrol', function(req, res) {
  res.render('pages/visitorcontrol', {username:req.session.username});
});


app.get('/departments', function(req, res) {
	if (req.session.loggedin) {
	  const sql = 'SELECT * FROM departments';
	  conn.query(sql, (err, data) => {
		if (err) throw err;
		console.log(data);
		res.render('pages/departments', { departmentData: data, username:req.session.username });
	  });

      //   res.render('pages/departments');
	} else {
	  res.redirect('/');
	}
  });

//Adding Departments
app.post('/add_departments', function(req, res) {
	var department_name = req.body.department_name;
	if (department_name) {
	   var sql = 'INSERT INTO departments (department_name) VALUES (?)';
	   conn.query(sql, [department_name], function(err, result) {
		  if (err) {
			 console.error(err);
			 res.status(500).send('Internal Server Error');
		  } else {
			 console.log('Record inserted');
			 res.redirect('/departments');
		  }
	   });
	} else {
	   console.log("Error: Department name is missing");
	   res.status(400).send('Bad Request');
	}
 });


 //  Deleting Department
 app.post('/delete_department', function(req, res) {
	var department_id = req.body.department_id;
	if (department_id) {
	   var sql = 'Delete from departments where id=?';
	   conn.query(sql, [department_id], function(err, result) {
		  if (err) {
			 console.error(err);
			 res.status(500).send('Internal Server Error');
		  } else {
			 console.log('Record deleted');
			 res.redirect('/departments');
		  }
	   });
	} else {
	   console.log("Error: Department name is missing");
	   res.status(400).send('Bad Request');
	}
 });


 // Updating Department
app.post('/updateDepartments', function(req, res) {
    const department_id = req.body.department_id;
    const updated_department_name = req.body.updated_department_name;

    if (department_id && updated_department_name) {
        var sql = 'UPDATE departments SET department_name = ? WHERE id = ?';
        conn.query(sql, [updated_department_name, department_id], function(err, result) {
            if (err) {
                console.error(err);
                res.status(500).send('Internal Server Error');
            } else {
                console.log('Record updated');
                res.redirect('/departments');
            }
        });
    } else {
        console.log("Error: Department ID or updated name is missing");
        res.status(400).send('Bad Request');
    }
});

//  //  Updating Department
//  app.post('/updateDepartments', function(req, res) {
//     const department_id = req.body.department_id;
// 	if (department_id) {
// 	   var sql = 'Update from departments where id=?';
// 	   conn.query(sql, [department_id], function(err, result) {
// 		  if (err) {
// 			 console.error(err);
// 			 res.status(500).send('Internal Server Error');
// 		  } else {
// 			 console.log('Record updated');
// 			 res.redirect('/departments');
// 		  }
// 	   });
// 	} else {
// 	   console.log("Error: Department name is missing");
// 	   res.status(400).send('Bad Request');
// 	}
//  });
 

//Employees page
app.get('/employees', function(req, res) {
    if (req.session.loggedin) {
        // const sql = 'SELECT * FROM employees';
        const sql = 'SELECT employees.*, departments.department_name FROM employees LEFT JOIN departments ON employees.department_id = departments.id';
        conn.query(sql, (err, data) => {
            if (err) throw err;
			// console.log(data);

            // Fetch departments from the database
            const departmentsQuery = 'SELECT * FROM departments';
            conn.query(departmentsQuery, (err, departments) => {
				// console.log(departments);
                if (err) {
                    console.error(err);
                    res.status(500).send('Internal Server Error');
                    return;
                }

                // Pass both employeesData and departments to the template
                res.render('pages/employees', { employeesData: data, departments: departments, username:req.session.username });
            });
        });
    } else {
        res.redirect('/');
    }
});

//Adding Employees
app.post('/add_employees', function(req, res) {
    if (req.session.loggedin) {
        var full_name = req.body.full_name;
        var alt_name = req.body.alt_name;
        var email = req.body.email;
        var mobile_number = req.body.mobile_number;
        var job_title = req.body.job_title;
        var emp_role_type = req.body.emp_role_type;
		var department_id = req.body.department_id;

        if (full_name && email) {
            // Assuming department_id is a foreign key in the employees table
            var sql = `INSERT INTO employees (full_name, alt_name, email, mobile_number, job_title, emp_role_type, department_id) VALUES (?, ?, ?, ?, ?, ?, ?)`;
            
            // Assuming department_id is passed as a parameter in the request body
            // var department_id = req.body.department_id;

            conn.query(sql, [full_name, alt_name, email, mobile_number, job_title, emp_role_type, department_id], function(err, result) {
                if (err) {
                    console.error(err);
                    res.status(500).send('Internal Server Error');
                } else {
                    console.log('Record inserted');
                    res.redirect('/employees');
                }
            });
        } else {
            console.log("Error: Employee name or email is missing");
            res.status(400).send('Bad Request');
        }
    } else {
        res.redirect('/');
    }
});

//  Deleting employees
app.post('/delete_employees', function(req, res) {
	var employees_id = req.body.employees_id;
	if (employees_id) {
	   var sql = 'Delete from employees where id=?';
	   conn.query(sql, [employees_id], function(err, result) {
		  if (err) {
			 console.error(err);
			 res.status(500).send('Internal Server Error');
		  } else {
			 console.log('Record deleted');
			 res.redirect('/employees');
		  }
	   });
	} else {
	   console.log("Error: Employees name is missing");
	   res.status(400).send('Bad Request');
	}
 });

// login page
app.get('/404', function(req, res) {
    res.render('pages/404');
  });


  function sendEmailNotification(visitorName, employeeEmail) {
    const mailOptions = {
      from: 'atraxgroup2024@gmail.com',
      to: employeeEmail,
      subject: 'Visitor Sign-In Notification',
      text: `Hello Visitor ${visitorName} has signed in.`
    };
  
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
  }

// about page
// app.get('/about', function(req, res) {
//   res.render('pages/about');
// });

app.listen(4000);
console.log('Server is listening on port 4000')