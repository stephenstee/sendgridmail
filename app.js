require('dotenv').config();


var express = require("express");
var app = express()
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var expressSanitizer = require('express-sanitizer');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


mongoose.connect("mongodb://localhost/mail", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

app.use(expressSanitizer());



app.get("/", function(req,res){
	res.redirect("/contact");
})

app.get("/contact", (req,res) =>{
	res.render('contact');
})

app.post('/contact', async (req, res) => {
  let { name, email, message } = req.body;
  name = req.sanitize(name);
  email = req.sanitize(email);
  message = req.sanitize(message);
  const msg = {
    to: 'steestephen3@gmail.com',
    from: email,
    subject: `YelpCamp Contact Form Submission from ${name}`,
    text: message,
    html: `
    <h1>Hi there, this email is from, ${name}</h1>
    <p>${message}</p>
    `,
  };
  try {
    await sgMail.send(msg);
    res.redirect('/contact');
  } catch (error) {
    console.error("first" + error);
    if (error.response) {
      console.error("second" + error.response.body)
    }
    
    res.redirect('back');
  }
});

app.listen(process.env.PORT || 3000, process.env.IP, function(){
	console.log("server starts");
})