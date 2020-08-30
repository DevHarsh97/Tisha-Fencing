const express = require('express');
const path = require('path');
const bodyparser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
const emailSvc = require('./services/email') 

app.use(bodyparser.urlencoded({extended : true}));
app.use(bodyparser.json());
app.use(cors());

//create connection
const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'Tish_Fencing',
    port     : '8889'
});

//connect
db.connect((err)=>{
    if(err)
    {
        console.log("Connection Failed.....");
        throw err;
    }
    console.log('Connected!!!');
});

app.get('/', (req,res) => {
    res.status(200).send("Working")
});

//sign up 
app.post('/signup', (req,res) => { 
    const fullname = req.body.fullname;
    const email = req.body.email;
    const contact = req.body.contact;
    const password = req.body.password;
    const confirm_pass = req.body.confirm_pass;

    //validation for Name
    if(!fullname|| fullname.length < 0 )
    {
        //400 Bad Request
        return res.status(400).send('Name is required');
        
    }

    //Validation for email
    var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
    var valid = emailRegex.test(email);
    if (!email || email.length>254 || !valid)
    {
        return res.status(400).send('Enter Valid email address');
        
    }

    //Validation for Contact Number
    if(!contact|| contact.length != 10 )
    {
        //400 Bad Request
        res.status(400).send('Please enter correct contact number.');
        return;
    }

    //Validation for Password
    if(!password || password.length < 3)
    {
        res.status(400).send('Please create the password and should be minimum 3 characters.');
        return;
    }
    if(!confirm_pass || confirm_pass.length < 3)
    {
        res.status(400).send('Please write confirm password and should be minimum 3 characters.');
        return;
    }

    if(password != confirm_pass) 
    {
        return res.status(400).send('Your password did not match!! Try it again. ');
        
    }

    let sql = `INSERT INTO Customers (FullName, Email, ContactNumber, Password) VALUES ("${fullname}", "${email}", "${contact}", "${password}")`;

    let query = db.query(sql,(err, result) => {
        if(err) throw err;
        console.log(result);
        return res.send('Data Insert and User Register Sucessfully.')
    });
});

//Sign in 
app.post('/signin', (req,res) => {
    const email = req.body.email;
    const password = req.body.password;

    //Validation for email
    var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
    var valid = emailRegex.test(email);
    if (!email || email.length>254 || !valid)
    {
        res.status(400).send('Enter Valid email address');
        return;
    }

    //Validation for Password
    if(!password)
    {
        res.status(400).send('Please enter the password');
        return;
    }

    //Select data
    let sql = `SELECT * from Customers WHERE email = "${email}" AND password = "${password}"`;

    db.query(sql, (err, result) => {
        if(err || !result.length > 0)
        {
            res.send('Incorrect email or password!!!');
            return;
            //throw err;
        }
        console.log(result);
        let fullname = result[0].FullName;
       return res.send(` ${fullname} Sign in Sucessfully.`);
    });   
});

//Mail Handling for reset password
app.post('/sendmail', (req, res) => {
    const email = req.body.email;

    //Validation for email
    var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
    var valid = emailRegex.test(email);
    if (!email || email.length>254 || !valid)
    {
        res.status(400).send('Enter Valid email address');
        return;
    }

    let sql = `SELECT * from Customers WHERE email = "${email}"`;

    let query = db.query(sql,(err, result) => {
        if(err  || !result.length > 0)
        {
            res.send("Enter correct email..");
            return;
            //throw err;
        } 
        console.log(result);

    //Random Number generate
    let randomNumber = Math.random().toString(36).substring(7);
    //console.log(randomNumber);

    let sql = `UPDATE Customers SET Reset = "${randomNumber}" WHERE email = "${email}"`;
        db.query(sql, (err, result) => {
            if(err) throw err;
            console.log(result);
            //res.send(`Record of id ${email} Updated Sucessfully...`);
        });

        //mail handling
        const userObj = result[0];
        const emailOptions = {email : userObj.Email, fullname: userObj.FullName ,subject : 'Reset', uniqueCode : randomNumber}
        emailSvc(emailOptions).then((sucess) => {
            return res.send('Varification Code Send Sucessfully!! Check your Inbox.');
        }).catch((err) => {
            return res.status(500).send({"Error": err})
        })         
    });
});

//Reset Password
app.post('/resetpassword', (req,res) => {

    //update password
    const password = req.body.password;
    const confirm_pass = req.body.confirm_pass;
    const email = req.body.email;
    const varifyCode = req.body.varifyCode;

    //Validation for email
    var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
    var valid = emailRegex.test(email);
    if (!email || email.length>254 || !valid)
    {
        res.status(400).send('Enter Valid email address');
        return;
    }

    //Validation for Password
    if(!password || password.length < 3)
    {
        res.status(400).send('Please create the password and should be minimum 3 characters.');
        return;
    }
    if(!confirm_pass || confirm_pass.length < 3)
    {
        res.status(400).send('Please write confirm password and should be minimum 3 characters.');
        return;
    }

    if(password != confirm_pass) 
    {
        res.status(400).send('Your password did not match!! Try again. ');
        return;
    }

    let sqlEmail = `SELECT * from Customers WHERE email = "${email}"`;

    let queryEmail = db.query(sqlEmail,(err, result) => {
        if(err  || !result.length > 0)
        {
            res.send("Enter correct email..");
            return;
            //throw err;
        } 

    let sqlReset = `SELECT Reset from Customers WHERE email = "${email}"`;

    let queryReset = db.query(sqlReset,(err, result) => {
    //let emailVarify = result[0].Email;
    let resetCode = result[0].Reset;
    if(err || resetCode != varifyCode)
        {
           return res.send("Enter correct Varification code.");
            //throw err;
        } 
        let sqlPassword = `UPDATE Customers SET Password = "${password}" WHERE email = "${email}"`;

        let queryPassword = db.query(sqlPassword,(err, result) => {
            if(err) throw err;
            console.log(result);
           return res.send('Your Password Reset Sucessfully.');
        });
    }); //query reset
  }); //query email end
}); //route end

app.listen('3000',()=>{
    console.log("Server started on port 3000...")
})