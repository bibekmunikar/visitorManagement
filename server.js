const mysql = require('mysql');
const express = require('express');
const session = require('express-session');
const path = require('path');
const conn = require('./dbConfig');
// const { Collapse } = require('bootstrap');
// const { Console } = require('console');
const app = express();

// set the view engine to ejs
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



app.use(session({
	secret: 'yoursecret',
	resave: true,
	saveUninitialized: true
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
				res.send('Incorrect Username and/or Passworrrrd!');
			}			
			res.end();
		});
	} else {
		res.send('Please enter Username and Passworddddd!');
		res.end();
	}
});

//CREATE USER
app.post('/register', function(req, res) {
	let username = req.body.username;
	let password = req.body.password;
	if (username && password) {
		var sql = `INSERT INTO users (username, password) VALUES ("${username}", "${password}")`;
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
app.get('/dashboard', function (req, res, next) {
		if (req.session.loggedin) {
    res.render('pages/dashboard');
		} else {
		res.redirect('/');
	}
});

//Visitors 
app.get('/visitors', function(req, res) {
	res.render('pages/visitors');
});

//SignIn/Out Manager page
app.get('/visitorcontrol', function(req, res) {
  res.render('pages/visitorcontrol');
});

//register page
app.get('/register', function(req, res) {
  res.render('pages/register');
});

//Dashboard page
app.get('/dashboard', function(req, res) {
  res.render('pages/dashboard');
});



// login page
// app.get('/login', function(req, res) {
//   res.render('pages/login');
// });

// about page
// app.get('/about', function(req, res) {
//   res.render('pages/about');
// });

app.listen(4000);
console.log('Server is listening on port 4000')