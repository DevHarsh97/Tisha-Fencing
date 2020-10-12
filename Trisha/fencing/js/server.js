const express = require('express');
const path = require('path');
const bodyparser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
const emailSvc = require('./services/email'); 
const { realpathSync } = require('fs');
const appoirtmentEmailSvc = require('./services/appoirtment'); 
const queryEmailSvc = require('./services/query'); 
const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })
const fs = require('fs');

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
           return res.send('Your Password Reset Sucessfully!! Now you can Sign in..');
        });
    }); //query reset
  }); //query email end
}); //route end

//Book Appoirtment
app.post('/appoirtment', async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const date = req.body.date;
    const time = req.body.time;
    const TT = req.body.TT;

    //Validation for email
    var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
    var valid = emailRegex.test(email);
    if (!email || email.length>254 || !valid)
    {
        res.status(400).send('Enter Valid email address');
        return;
    }

    //validation for Name
    if(!name|| name.length < 0 )
    {
        //400 Bad Request
        return res.status(400).send('Name is required');   
    }

    //validation for date
    if(!date|| date.length < 0 )
    {
        //400 Bad Request
        return res.status(400).send('Date is required');    
    }

    //validation for time
    if(!time|| time.length < 0 )
    {
        //400 Bad Request
        return res.status(400).send('Time is required');
    }

    // let sqlDateDisable = 'SELECT * from ChangeAvailability';
    //     let queryDateDisable = db.query(sqlDateDisable, (err, result) => {
    //             if(err) throw err;
    //             console.log(result);
    //             return res.send('Please Select Another Date.')
    //     });

    let sqlDateTime = `SELECT * from Book WHERE Date = "${date}" AND Time = "${time}"`;
    let occupied = false;

    let queryDateTime = db.query(sqlDateTime, (err, result) => {
        if (err || result.length > 0) {
            return res.send("Please Select Another Date or Time");
        } else {
            let sql = `INSERT INTO Book (Name, Email, Date, Time, TT) VALUES ("${name}", "${email}", "${date}", "${time}", "${TT}")`;
            let query = db.query(sql,(err, result) => {
                if(err) throw err;
                console.log(result);
                //return res.send('Appoirtment Book Sucessfully.')
            });
        
            let sqlBook = `SELECT * FROM BOOK WHERE Email = "${email}" AND Name = "${name}"`;
            let queryBook = db.query(sqlBook,(err, result) => {
                if(err) throw err;
                console.log(result);
        
            //mail handling
            //const userObj = result[0];
            // const emailOptions = {email : userObj.Email, name: userObj.Name , date: userObj.Date , time: userObj.Time , TT: userObj.TT , subject : 'Appoirtment Booking'}
            const emailOptions = {email : email, name: name , date: date, time: time , TT: TT , subject : 'Appoirtment Booking'}
            appoirtmentEmailSvc(emailOptions).then((sucess) => {
                return res.send('Your Appoirtment is booked sucessfully.');
            }).catch((err) => {
                return res.status(500).send({"Error": err})
            })         
        });
        }  
    });
        
});

//Change availablity
app.post('/Changeavailability', (req,res) => {
    const date = req.body.date;
    const name = req.body.name;
    const email = req.body.email;
    //console.log(req.body);

    //Validation for email
    var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
    var valid = emailRegex.test(email);
    if (!email || email.length>254 || !valid)
    {
        res.status(400).send('Enter Valid email address');
        return;
    }

    //validation for Name
    if(!name|| name.length < 0 )
    {
        //400 Bad Request
        return res.status(400).send('Name is required');   
    }

    //validation for date
    if(!date|| date.length < 0 )
    {
        //400 Bad Request
        return res.status(400).send('Date is required');    
    }

    let sqldate = `INSERT INTO ChangeAvailability (Date) VALUES ("${date}")`;
            let querydate = db.query(sqldate,(err, result) => {
                if(err) throw err;
                console.log(result);
                return res.send('Change Availability Sucessfully.')
            });
});

//Send Query
app.post('/query', (req,res) => {
    const name = req.body.name;
    const email = req.body.email;
    const que = req.body.que;

    //Validation for email
    var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
    var valid = emailRegex.test(email);
    if (!email || email.length>254 || !valid)
    {
        res.status(400).send('Enter Valid email address');
        return;
    }

    //validation for Name
    if(!name|| name.length < 0 )
    {
        //400 Bad Request
        return res.status(400).send('Name is required');   
    }
    if(!que|| que.length < 0 )
    {
        //400 Bad Request
        return res.status(400).send('Question is required');   
    }

    let sql = `INSERT INTO Query (Name, Email, Question) VALUES ("${name}", "${email}", "${que}")`;
            let query = db.query(sql,(err, result) => {
                if(err) throw err;
                console.log(result);
                //return res.send('Send Query Sucessfully.')
            });
            const emailOptions = {email : email, name: name , que: que , subject : 'Customer Query'}
            queryEmailSvc(emailOptions).then((sucess) => {
                return res.send('Your Query Send Sucessfully.');
            }).catch((err) => {
                return res.status(500).send({"Error": err})
            })    
})

//Admin change design page
app.post('/admin', (req,res) => {
    const design = req.body.design;

    let sql = `SELECT * from Admin WHERE designName = "${design}"`;

    let query = db.query(sql,(err, result) => {
        if(err || !result.length > 0)
        {
            res.send('No Records found');
            return;
            //throw err;
        }
        // const base = new Buffer(result.image).toString('base64');
        console.log(result);
        return res.send(result);
    })
})

//update admin 
app.post('/update', (req,res)=> {
    const design = req.body.design;
    const name = req.body.name;
    const content = req.body.content;
    //const img = req.body.img;

    // const base = new Buffer(img).toString('base64');
    // console.log(base);
    //validation for Name
    if(!name|| name.length < 0 )
    {
        //400 Bad Request
        return res.status(400).send('title is required');   
    }
    if(!content|| content.length < 0 )
    {
        //400 Bad Request
        return res.status(400).send('content is required');   
    }

    let sql = `UPDATE Admin SET title= "${name}", content= "${content}" WHERE  designName = "${design}"`;

    let query = db.query(sql,(err, result) => {
        if(err) throw err;
        console.log(result);
       return res.send('Data Updated Sucessfully!!');
    });
})

//update Image
// app.post('/fileUpload', upload.single('image'), (req, res, next) => {
//     const design = req.body.design;
//     const img = req.file.buffer;
    //console.log('file' + req.file);
    //const byte = fs.readFileSync(req.file);
    //const encoded = Buffer.from(byte).toString('base64');
    //console.log("base" + encoded)

//     let sql = `UPDATE Admin SET image= "${img}" WHERE  designName = "${design}"`;

//     let query = db.query(sql,(err, result) => {
//         if(err) throw err;
//         console.log(result);
//        return res.send('Image Updated Sucessfully!!');
//     });

//   })
  
  //Fetch data of designs
  app.post('/fetchdesign', (req,res) => {
      let sql = 'SELECT * FROM Admin';

      let query = db.query(sql,(err, result) => {
        if(err) throw err;
        console.log(result);
        return res.send(result);     
      })
  })



app.listen('3000',()=>{
    console.log("Server started on port 3000...")
})