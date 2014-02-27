// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require jquery.ui.sortable
//= require turbolinks
//= require handlebars
//= require_tree .


$(document).on('ready page:load', function(){

  $('span.previous').on('click', function(event){
    event.preventDefault();
    var d = Date.parse($('span.date').data().date);
    d = new Date(d);

    var params = {};
    params.date = d.toISOString();

    $('.nav-pills').each(function(index, item){
      params.name = $('#pills-'+index).data().name;
      ajax_pill_request(params, index);
    });

  });

  $('span.next').on('click', function(event){
    event.preventDefault();
    var d = Date.parse($('span.date').data().date);
    d = new Date(d);
    d.setDate(d.getDate()+9);

    var params = {};
    params.date = d.toISOString();

    if (new Date() > d){
     $('.nav-pills').each(function(index, item){
        params.name = $('#pills-'+index).data().name;
        ajax_pill_request(params, index);
      });    
    }

  });

  $('#post').on('click', function(event){
    event.preventDefault();
    var params = {};
    params.post = {body: $('.form-control').val() };
    params.name = $('.form-control').data().name;
    $.ajax({type: 'post', url: "/posts", data: params }).done(function(response){
      var context = { body: response.post.body, 
                      first_name: response.post.user.first_name, 
                      last_name: response.post.user.last_name };
          var template = HandlebarsTemplates.post(context);
      $('.posts').append(template); 
    }); 

    $('.form-control').val(""); 
  
  });

  $('.nav-pills').on('click', 'li' ,function(event){
    event.preventDefault();
    event.stopPropagation();
    var d = Date.parse(this.dataset.day);
    var day = new Date(d);
    var current_day = new Date();
    current_day.setDate(current_day.getDate()-1);
    var status = $(this).closest('div.habit-row');
     if (day < current_day){
      var parent = $(this).closest('ul');
      var params = {name: parent.data().name, date: $(this).data().day};
      if ( $(this).hasClass('completed') ){
        $(this).removeClass('completed');
        status.find('div.active').last().addClass('inactive').removeClass('active');
        $.ajax({type: 'delete', url: "/completions", data: params}).done(function(r){ alert("Deleted the completion"); }).fail(function(r){ alert("You Failed"); });
      } else {
        $(this).addClass('completed');
        status.find('div.inactive').first().removeClass('inactive').addClass('active');
        $.ajax({type: 'post', url: "/completions", data: params}).done(function(r){ alert("Congratualtions"); }).fail(function(r){ alert("You Failed"); });
      }  
    }

  });
 
  $( "#sortable" ).sortable({   
    placeholder: "ui-sortable-placeholder",
    start: function(e, ui){
        ui.placeholder.height(ui.item.height());
    }   
  });  
  

  var freqs = $('.frequency');
  var freq, liWidth;
  var i = 1;
  $.each(freqs, function(index, item){
    freq = +($(item).text());
    liWidth = 100.0/freq;
    $('#progress-ul-'+i).children().css('width', liWidth + '%');
    i++;
  });

});



function include_completions(date, completions){
  for ( var i = 0; i < completions.length; i++ ){
    var day = Date.parse(completions[i].date);
    day = new Date(day);
    day.setDate(day.getDate()-1);
    if ( day.getDate() === date.getDate() ){
      return true;
    }
  }
  return false;
}

function include_active(date, current_date){
  current_date.setDate(current_date.getDate()-1);
  if (current_date.getDate() == date.getDate()){
    return true;
  }
  return false;
}

function ajax_pill_request(params, index) {

  $.ajax({type: "post", url: "/previous_week", data: params}).done(function(response){ 
    var d = Date.parse(response.date);
    d = new Date(d);
    d.setDate(d.getDate()-1);
    var week_day = ["Sun", "M", "Tu", "W", "Th", "F", "Sat"];
    var list = "";
    for (var i = 0; i < 7; i++){
      d.setDate(d.getDate()+1);
      list += "<li data-day='" + d.toISOString() + "' class='";

      if (include_completions(d, response.completions)){
        list += "completed ";
      }
      if ( include_active(d, new Date()) ){
        list += "active ";
      }

      list +="' ><a href='#'>" + week_day[i] + "</a></li>";
    }

    var d = Date.parse(response.date);
    d = new Date(d);

    //<span class="section-title date" data-date="2/23/2014">Week of 2/23/2014</span>

    var header = "<span class='section-title date' data-date='"+ d.toISOString() ;
    d.setDate(d.getDate()+1);
    header += "' >Week of " + (d.getUTCMonth()+1) +"/"+ d.getDate() +"/"+ d.getUTCFullYear()+"</span>";

    $('#week-day').empty();
    $('#week-day').append(header);

    $('#pills-'+index).empty();
    $('#pills-'+index).append(list);

  });

}

