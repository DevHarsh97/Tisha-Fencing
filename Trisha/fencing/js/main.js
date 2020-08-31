
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

//Sign in
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
            return alert (response);
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