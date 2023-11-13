const express = require('express');
const app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');

//using app.use to erve up static css files in public /assets/ folder when /public link is called in ejs files 
//app.use("/route", express.static("foldername"));
// app.use('/src', express.static('src'));  
app.use(express.static(__dirname + '/src'));

// use res.render to load up an ejs view file

// login page
app.get('/', function(req, res) {
  res.render('pages/login');
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

app.listen(3000);
console.log('Server is listening on port 3000');