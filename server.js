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

// login page
app.get('/', function(req, res) {
  res.render('pages/login');
});

app.post('/auth', function(req, res) {
	let username = req.body.username;
	let password = req.body.password;
	if (username && password) {
		conn.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], function(error, results, fields) {
			if (error) throw error;
			if (results.length > 0) {
				req.session.loggedin = true;
				req.session.username = username;
				res.redirect('dashboard');
			} else {
				res.send('Incorrect Username and/or Password!');
			}			
			res.end();
		});
	} else {
		res.send('Please enter Username and Password!');
		res.end();
	}
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
		var sql = `INSERT INTO users (firstname, lastname, email, phone, username, password) VALUES ("${firstname}", "${lastname}", "${email}", "${phone}", "${username}", "${password}")`;
		conn.query(sql, function(err, result) {
			if (err) throw err;
			console.log('record inserted');
			res.render('pages/login');
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
    res.redirect('/');
});

// Users can access this if they are logged in
app.get('/dashboard', function (req, res) {
		if (req.session.loggedin) {
    res.render('pages/dashboard');
		} else {
		res.redirect('/');
	}
});

//Visitors 
app.get('/visitors', function(req, res) {
	if (req.session.loggedin) {
	res.render('pages/visitors');
} else {
	res.redirect('/');
}
});

//SignIn/Out Manager page
app.get('/visitorcontrol', function(req, res) {
  res.render('pages/visitorcontrol');
});

//Departments page
// app.get('/departments', function(req, res) {
// 	if (req.session.loggedin) {

// 		const sql = 'SELECT * FROM departments';
// 		conn.query(sql, (err, data) => {
// 			console.log(data);
// 			if (err) throw err;
// 			res.render('departments', { departmentData: data });

// 		});

//   res.render('pages/departments');
// } else {
// 	res.redirect('/');
// }
// });

app.get('/departments', function(req, res) {
	if (req.session.loggedin) {
	  const sql = 'SELECT * FROM departments';
	  conn.query(sql, (err, data) => {
		if (err) throw err;
		console.log(data);
		res.render('pages/departments', { departmentData: data });
	  });
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


//Employees page
app.get('/employees', function(req, res) {
	if (req.session.loggedin) {
		const sql = 'SELECT * FROM employees';
		conn.query(sql, (err, data) => {
		  if (err) throw err;
		  console.log(data);
		  res.render('pages/employees', { employeesData: data });
		});
	  } else {
		res.redirect('/');
	  }
});

//Adding Employees
app.post('/add_employees', upload.single('photo'), function(req, res) {
	var full_name = req.body.full_name;
	var alt_name = req.body.alt_name;
	var email = req.body.email;
	var mobile_number = req.body.mobile_number;
	var department = req.body.department;
	var job_title = req.body.job_title;
	var emp_role_type = req.body.emp_role_type;
	 // Access the file data using req.file
	 var photo = req.file;

	if (full_name && department) {
		var sql = `INSERT INTO employees (full_name, alt_name, email, mobile_number, department, job_title, emp_role_type, photo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
	   conn.query(sql, [full_name, alt_name, email, mobile_number, department, job_title, emp_role_type, photo], function(err, result) {
		  if (err) {
			 console.error(err);
			 res.status(500).send('Internal Server Error');
		  } else {
			 console.log('Record inserted');
			 res.redirect('/employees');
		  }
	   });
	} else {
	   console.log("Error: Employee name is missing");
	   res.status(400).send('Bad Request');
	}
 });


//Dashboard page
app.get('/dashboard', function(req, res) {
  res.render('pages/dashboard');
});





// about page
// app.get('/about', function(req, res) {
//   res.render('pages/about');
// });

app.listen(3300);
console.log('Server is listening on port 3300')