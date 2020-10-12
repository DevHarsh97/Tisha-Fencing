
(function ($) {
    "use strict";

    /*==================================================================
    [ Focus Contact2 ]*/
    $('.input100').each(function(){
        $(this).on('blur', function(){
            if($(this).val().trim() != "") {
                $(this).addClass('has-val');
            }
            else {
                $(this).removeClass('has-val');
            }
        })    
    })


    /*==================================================================
    [ Validate after type ]*/
    $('.validate-input .input100').each(function(){
        $(this).on('blur', function(){
            if(validate(this) == false){
                showValidate(this);
            }
            else {
                $(this).parent().addClass('true-validate');
            }
        })    
    })

    /*==================================================================
    [ Validate ]*/
    var input = $('.validate-input .input100');

    $('.validate-form').on('submit',function(){
        var check = true;

        for(var i=0; i<input.length; i++) {
            if(validate(input[i]) == false){
                showValidate(input[i]);
                check=false;
            }
        }

        return check;
    });


    $('.validate-form .input100').each(function(){
        $(this).focus(function(){
           hideValidate(this);
           $(this).parent().removeClass('true-validate');
        });
    });

    function validate (input) {
        if($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
            if($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
                return false;
            }
        }
        else {
            if($(input).val().trim() == ''){
                return false;
            }
        }
    }

    function showValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).removeClass('alert-validate');
    }
    


})(jQuery);


//Start code
//Sign Up 
function signup()
{
    var fullname = document.getElementById("fullname").value;
    var email = document.getElementById("email").value;
    var contact = document.getElementById("contact").value;
    var password = document.getElementById("password").value;
    var confirmPass = document.getElementById("confirmPass").value;

    if(fullname == "" || email == "" || contact == "" || password == "" || confirmPass == "")
    {
       return alert("Enter Values in the field");
    }
    var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
    var valid = emailRegex.test(email);
    if(!valid)
    {
       return alert("Enter valid Email");
    }
    if(contact.length != 10)
    {
        return alert("Enter valid contact Number of 10 digits");
    }
    if(password.length < 3 || confirmPass.length < 3)
    {
        return alert("Password should be 3 minimum Characters");
    }
    if(password != confirmPass)
    {
        return alert("Your password did not match");
    }
    
    else
    {
        var settings = {
            "url": 'http://localhost:3000/signup',
            "method": "POST",
            "headers": {
            "Content-Type": "application/json"
            },
            "data": JSON.stringify({"fullname": fullname,"email": email,"contact": contact,"password": password,"confirm_pass": confirmPass}),
        };
        
        $.ajax(settings).done(function (response) {
            //console.log("Data insert " + response);
            return alert ("You Registered Sucessfully!! Now you can Sign in");
        }); 
        $(document).ajaxStop(function(){
            window.location.reload();
        });
    }
}

//user Sign in
function signin()
{
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    if(email == "" || password == "")
    {
        return alert("Enter Values in the field");
    }
    var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
    var valid = emailRegex.test(email);
    if(!valid)
    {
       return alert("Enter valid Email");
    }
    else
    {
        var settings = {
            "url": "http://localhost:3000/signin",
            "method": "POST",
            "headers": {
            "Content-Type": "application/json"
            },
            "data": JSON.stringify({"email": email,"password": password}),
        };
        
        $.ajax(settings).done(function (response) {
            //return alert (response);
            if(response != "Incorrect email or password!!!")
            {
                window.location = "file:///Users/harsh/Desktop/course_harsh/projects/Tisha-Fencing/Trisha/fencing/website/booking/quote.html"
            }
            else
            {
                return alert (response);
            }
        });
        //   $(document).ajaxStop(function(){
        //     window.location.reload();
        //   });
    }
}

//Admin Sign in
function adminsignin()
{
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;

    if(email == "" || password == "")
    {
        return alert("Enter Values in the field");
    }
    var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
    var valid = emailRegex.test(email);
    if(!valid)
    {
       return alert("Enter valid Email");
    }
    else
    {
        var settings = {
            "url": "http://localhost:3000/signin",
            "method": "POST",
            "headers": {
            "Content-Type": "application/json"
            },
            "data": JSON.stringify({"email": email,"password": password}),
        };
        
        $.ajax(settings).done(function (response) {
            //return alert (response);
            if(response != "Incorrect email or password!!!")
            {
                window.location = "file:///Users/harsh/Desktop/course_harsh/projects/Tisha-Fencing/Trisha/fencing/website/booking/admin.html"
            }
            else
            {
                return alert (response);
            }
        });
        //   $(document).ajaxStop(function(){
        //     window.location.reload();
        //   });
    }
}

//Reset-Password
document.getElementById("varificationSection").style.display = "none";
document.getElementById("passwordSection1").style.display = "none";
document.getElementById("passwordSection2").style.display = "none";
document.getElementById("passwordSection3").style.display = "none";

function sendmail()
{
    var email = document.getElementById("email").value; 
    if(email == "")
    {
        return alert("Enter Values in the field");
    }
    var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
    var valid = emailRegex.test(email);
    if(!valid)
    {
        alert("Enter valid Email");
    }
    else
    {
        var settings = {
            "url": "http://localhost:3000/sendmail",
            "method": "POST",
            "headers": {
              "Content-Type": "application/json"
            },
            "data": JSON.stringify({"email": email}),
          };
          
          $.ajax(settings).done(function (response) {
            return alert (response);
          });
          document.getElementById("varificationSection").style.display = "block";  
          document.getElementById("passwordSection1").style.display = "block"; 
          document.getElementById("passwordSection2").style.display = "block"; 
          document.getElementById("passwordSection3").style.display = "block";       
    }
}

function resetSignin()
{
    var email = document.getElementById("email").value; 
    var password = document.getElementById("password").value; 
    var confirmPass = document.getElementById("confirmPass").value; 
    var varifyCode = document.getElementById("varificationcode").value; 

    if (email == "" || password == "" || confirmPass == "" || varifyCode == "")
    {
        return alert("Enter Values in the fields");
    }
    var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
    var valid = emailRegex.test(email);
    if(!valid)
    {
        alert("Enter valid Email");
    }
    if(password.length < 3 || confirmPass.length < 3)
    {
        return alert("Password should be 3 minimum Characters");
    }
    if(password != confirmPass)
    {
        return alert("Your password did not match");
    }
    else
    {
        var settings = {
            "url": "http://localhost:3000/resetpassword",
            "method": "POST",
            "headers": {
              "Content-Type": "application/json"
            },
            "data": JSON.stringify({"password":password,"confirm_pass":confirmPass,"email":email,"varifyCode":varifyCode}),
          };
          
          $.ajax(settings).done(function (response) {
            return alert (response);
          });
        //   $(document).ajaxStop(function(){
        //     window.location.reload();
        // });
    }
}

//Time onchange function

function timeonchange(value)
{
    //console.log(value);
    if(value == "9:00" || value == "10:00" || value == "11:00")
    {
        document.getElementById("tt").options[1].disabled = false;
        document.getElementById("tt").options[2].disabled = true;
    }
    else
    {
        document.getElementById("tt").options[1].disabled = true;
        document.getElementById("tt").options[2].disabled = false;
    }  
}


// Book Appointment
function book()
{
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var date = document.getElementById("date").value;
    var time = document.getElementById("time").value;
    var tt = document.getElementById("tt").value;

    if(name == "" || email == "" || date == "" || time == "" || tt == "" || time == "--" || tt == "--")
    {
       return alert("Enter Values in the field");
    }
    var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
    var valid = emailRegex.test(email);
    if(!valid)
    {
       return alert("Enter valid Email");
    }
    if(time == "9:00" || time == "10:00" || time == "11:00")
    {
        if(tt != "AM")
        {
            return alert("Select AM in AM/PM field");
        }
    }

    if(time == "12:00" || time == "1:00" || time == "2:00" || time == "3:00" || time == "4:00")
    {
        if(tt != "PM")
        {
            return alert("Select PM in AM/PM field");
        }
    }
    
    else
    {
        var settings = {
            "url": "http://localhost:3000/appoirtment",
            "method": "POST",
            "timeout": 0,
            "headers": {
              "Content-Type": "application/json"
            },
            "data": JSON.stringify({"name":name,"email":email,"date":date,"time":time,"TT":tt}),
          };
          
          $.ajax(settings).done(function (response) {
            alert (response);
            window.location.reload();
            return;
          });
    }

}

//change Availability
function change()
{
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var date = document.getElementById("date").value;
    if(name == "" || email == "" || date == "")
    {
       return alert("Enter Values in the field");
    }
    var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
    var valid = emailRegex.test(email);
    if(!valid)
    {
       return alert("Enter valid Email");
    }

    var settings = {
        "url": "http://localhost:3000/Changeavailability",
        "method": "POST",
        "timeout": 0,
        "headers": {
          "Content-Type": "application/json"
        },
        "data": JSON.stringify({"name":name,"email":email,"date":date}),
      };
      
      $.ajax(settings).done(function (response) {
        alert (response);
        window.location.reload();
        return;
      });
}

//Customer Query
function query()
{
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var question = document.getElementById("question").value;
    if(name == "" || email == "" || question == "")
    {
       return alert("Enter Values in the field");
    }
    var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
    var valid = emailRegex.test(email);
    if(!valid)
    {
       return alert("Enter valid Email");
    } 

    var settings = {
        "url": "http://localhost:3000/query",
        "method": "POST",
        "timeout": 0,
        "headers": {
          "Content-Type": "application/json"
        },
        "data": JSON.stringify({"name":name,"email":email,"que":question}),
      };
      
      $.ajax(settings).done(function (response) {
        //console.log(response);
        alert(response);
        window.location.reload();
        return;
      });
}
