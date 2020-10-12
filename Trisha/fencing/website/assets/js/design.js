
/**
* Template Name: MyPortfolio - v2.1.0
* Template URL: https://bootstrapmade.com/myportfolio-bootstrap-portfolio-website-template/
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/
(function($) {
  "use strict";

  var burgerMenu = function() {
    $('.burger').click(function(e) {
      $(window).scrollTop(0);
      if (!$('.burger').hasClass('active'))
        $('.burger').addClass('active');
      else
        $('.burger').removeClass('active');
    });
  }
  burgerMenu();

  var siteIstotope = function() {
    var $container = $('#portfolio-grid').isotope({
      itemSelector: '.item',
      isFitWidth: true
    });

    $(window).resize(function() {
      $container.isotope({
        columnWidth: '.col-sm-3'
      });
    });

    $container.isotope({
      filter: '*'
    });

    $('#filters').on('click', 'a', function(e) {
      e.preventDefault();
      var filterValue = $(this).attr('data-filter');
      $container.isotope({
        filter: filterValue
      });
      $('#filters a').removeClass('active');
      $(this).addClass('active');
    });
  }
  $(window).on('load', function() {
    siteIstotope();
  });

  var siteOwlCarousel = function() {
    $('.testimonial-carousel').owlCarousel({
      center: true,
      items: 1,
      loop: true,
      margin: 0,
      autoplay: true,
      smartSpeed: 1000,
    });
  };
  siteOwlCarousel();

  $(window).on('load', function() {
    AOS.init({
      easing: 'ease',
      duration: 1000,
      once: true
    });
  });

})(jQuery);

//Start
var design;
function category(value)
{
  design = value;
  var settings = 
  {
    "url": "http://localhost:3000/admin",
    "method": "POST",
    "timeout": 0,
    "headers": {
      "Content-Type": "application/json"
    },
    "data": JSON.stringify({"design":value}),
  };
  
  $.ajax(settings).done(function (response)
   {
      // console.log(response[0]['content']);
      // console.log(response[0]['title']);
      //console.log(response[0]['image']);
      
      var title = response[0]['title'];
      var content = response[0]['content'];
      //var image = response[0]['image'];
      document.getElementById("title").innerHTML = title;
      //document.getElementById("img").innerHTML = image;
      document.getElementById("content").innerHTML = content;
  });
}

//Update Designs
function change() 
{
  var designChange = window.design;
  var title = document.getElementById("titleChange").value; 
  var content = document.getElementById("contentChange").value;  

  if(designChange == "" || title == "" || content == "")
  {
    return alert("Please Enter the values in the fields!!");
  }

  var settings = {
    "url": "http://localhost:3000/update",
    "method": "POST",
    "timeout": 0,
    "headers": {
      "Content-Type": "application/json"
    },
    "data": JSON.stringify({"design":designChange,"name":title,"content":content}),
  };
  
  $.ajax(settings).done(function (response) {
    // console.log(response);
    alert(response);
    window.location.reload();
    return;
  });
  
}

//Upload Image
// function img()
// {
//   var form = $('#fileUploadForm')[0];

// 		// Create an FormData object
//   var data = new FormData(form);

//   var designChange = window.design;
//   var img = document.getElementById("changeImg").value;
//   var settings = {
//         type: "POST",
//         enctype: 'multipart/form-data',
//         processData: false,  // Important!
//         contentType: false,
//         cache: false,
//         url: "http://localhost:3000/fileUpload",
//         data
//   };
  
//   $.ajax(settings).done(function (response) {
//     // console.log(response);
//     return alert(response);
//   });
// }

//Fetch design data
function designsRetaining() 
{
  var settings = {
    "url": "http://localhost:3000/fetchdesign",
    "method": "POST",
    "timeout": 0,
  };
  
  $.ajax(settings).done(function (response) { 
    var titleRetaining = response[0]['title'];
    var contentRetaining = response[0]['content'];

    document.getElementById("titleRetaining").innerHTML = titleRetaining;
    document.getElementById("subtitleRetaining").innerHTML = titleRetaining;
    document.getElementById("contentRetaining").innerHTML = contentRetaining;
  });
  
}

function  designNeighbour() 
{
  var settings = {
    "url": "http://localhost:3000/fetchdesign",
    "method": "POST",
    "timeout": 0,
  };
  
  $.ajax(settings).done(function (response) {
    var titleNeighbour  = response[1]['title'];
    var contentNeighbour = response[1]['content'];

    document.getElementById("titleNeighbour").innerHTML = titleNeighbour;
    document.getElementById("subtitleNeighbour").innerHTML = titleNeighbour;
    document.getElementById("contentNeighbour").innerHTML = contentNeighbour;
  });
}

function designPost() 
{
   var settings = {
    "url": "http://localhost:3000/fetchdesign",
    "method": "POST",
    "timeout": 0,
  };
  
  $.ajax(settings).done(function (response) {
    var titlePost = response[2]['title'];
    var contentPost = response[2]['content'];

    document.getElementById("titlePost").innerHTML = titlePost;
    document.getElementById("subtitlePost").innerHTML = titlePost;
    document.getElementById("contentPost").innerHTML = contentPost;
  });
  
}

function designWallFence() 
{
   var settings = {
    "url": "http://localhost:3000/fetchdesign",
    "method": "POST",
    "timeout": 0,
  };
  
  $.ajax(settings).done(function (response) {
    var titleWallFence  = response[3]['title'];
    var contentWallFence = response[3]['content'];

    document.getElementById("titleWallFence").innerHTML = titleWallFence;
    document.getElementById("subtitleWallFence").innerHTML = titleWallFence;
    document.getElementById("contentWallFence").innerHTML = contentWallFence;

  });
  
}

function designSalt() 
{
   var settings = {
    "url": "http://localhost:3000/fetchdesign",
    "method": "POST",
    "timeout": 0,
  };
  
  $.ajax(settings).done(function (response) {
    var titleSalt = response[4]['title'];
    var contentSalt = response[4]['content'];

    document.getElementById("titleSalt").innerHTML = titleSalt;
    document.getElementById("subtitleSalt").innerHTML = titleSalt;
    document.getElementById("contentSalt").innerHTML = contentSalt;

  });
  
}

function designTubular() 
{
   var settings = {
    "url": "http://localhost:3000/fetchdesign",
    "method": "POST",
    "timeout": 0,
  };
  
  $.ajax(settings).done(function (response) {
    var titleTubular = response[5]['title'];
    var contentTubular= response[5]['content'];

    document.getElementById("titleTubular").innerHTML = titleTubular;
    document.getElementById("subtitleTubular").innerHTML = titleTubular;
    document.getElementById("contentTubular").innerHTML = contentTubular;

  });
  
}