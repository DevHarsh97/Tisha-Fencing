document.getElementById("resultSec").style.display = "none";

var categories = {};
function category(value)
{
   categories.cat = value;
    if(value == "2" || value == "3")
    {
        document.getElementById("height").disabled = true;
    }
    else
    {
        document.getElementById("height").disabled = false;
    }  
}

function quote()
{
    var length = document.getElementById("length").value;
    var height = document.getElementById("height").value;

    if(categories.cat == "" || length == "")
    {
        return alert("Please Select Values in the field.")
    }

    function retaingWall()
    {
        var retaingWall = (length * height) * 350;
        return retaingWall;
    }

    function goodNegiouber()
    {
        var fungoodNegiouber = (length * 65);
        return fungoodNegiouber;
    }

    function postFence()
    {
        var funpostFence = (length * 75);
        return funpostFence;
    }

    function tubular()
    {
        var funTubular = (length * height) * 350;
        return funTubular;
    }   

    function slatFence()
    {
        var funslatFence = (length * height) * 360;
        return funslatFence;
    }

    if(categories.cat == 1)
    {
        document.getElementById("resultSec").style.display = "block";
        document.getElementById("result").innerHTML = retaingWall();
    }
    if(categories.cat == 2)
    {
        document.getElementById("resultSec").style.display = "block";
        document.getElementById("result").innerHTML = goodNegiouber();
    }
    if(categories.cat == 3)
    {
        document.getElementById("resultSec").style.display = "block";
        document.getElementById("result").innerHTML = postFence();
    }
    if(categories.cat == 4)
    {
        document.getElementById("resultSec").style.display = "block";
        document.getElementById("result").innerHTML = retaingWall();
    }
    if(categories.cat == 5)
    {
        document.getElementById("resultSec").style.display = "block";
        document.getElementById("result").innerHTML = slatFence();
    }
    if(categories.cat == 6)
    {
        document.getElementById("resultSec").style.display = "block";
        document.getElementById("result").innerHTML = tubular();
    }
}





