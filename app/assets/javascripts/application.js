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
  
  if(document.URL.indexOf("%23add-profile") > -1){
    $('#join').modal('show');
    $('#profileForm').modal('show');
  }

  

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
    d.setDate(d.getDate()+8);

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
    habit_id = $('.form-control').data().habit;
    $.ajax({type: 'post', url: "/habits/"+ habit_id +"/posts", data: params }).done(function(response){
      var context = { body: response.post.body, 
                      full_name: response.post.user.first_name + " " + response.post.user.last_name, 
                      profile_pic: response.profile_pic,
                      date: response.date,
                      id: response.post.id,
                      up: response.post.upvotes,
                      down: response.post.downvotes
                    };
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
     if (day - current_day < 24*60*60*1000){
      var parent = $(this).closest('ul');
      var params = {name: parent.data().name, date: $(this).data().day};
      if ( $(this).hasClass('completed') ){
        $(this).removeClass('completed');
        $.ajax({type: 'delete', url: "/completions", data: params}).done(function(response){ 
          if (response.completions.length < response.habit.frequency){
            status.find('div.active').last().addClass('inactive').removeClass('active');
          }
        })
        .fail(function(r){ 
            alert("You Failed"); });
      } else {
        $(this).addClass('completed');
        status.find('div.inactive').first().removeClass('inactive').addClass('active');
        $.ajax({type: 'post', url: "/completions", data: params}).done(function(r){ });
      }  
    }

  });

  $('.posts').on('click', '.wooo',function(event){
    event.preventDefault();

    var post = $(this).closest('.post');
    params = { id: post.data().id };

    $.ajax({type: "post", url: "/upvotes", data: params}).done(function(response){
   $('#post-'+response.id).find('span.upvotes').text(response.upvotes);
      $('#post-'+response.id).find('span.downvotes').text(response.downvotes);
    });

  });

  $('.posts').on('click', '.booo',function(event){
    event.preventDefault();
  

    var post = $(this).closest('.post');
    params = { id: post.data().id };

     $.ajax({type: "post", url: "/downvotes", data: params}).done(function(response){
      $('#post-'+response.id).find('span.upvotes').text(response.upvotes);
      $('#post-'+response.id).find('span.downvotes').text(response.downvotes);
    });

  });

  $('.posts').on('click', '.trash',function(event){
    event.preventDefault();

    var post = $(this).closest('.post');
    var id = post.data().id;
    params = { post_id: post.data().id };
    template = HandlebarsTemplates.trash({id: post.data().id});
    $('body').append(template);
    $('#trash-'+id).modal('show');

  });

  $(document).on('click','.close-modal' ,function(event){
    event.preventDefault();
    var id = $(this).data().id;
    $('#trash-'+id).modal('hide', function(){
      $('#trash-'+id).remove();
    });
     
  });

  $(document).on('click', '.trash-post', function(event){
    event.preventDefault();
    event.stopPropagation();

    var id = $(this).data().id;
    
    $.ajax({type: 'delete', url: "/posts/" + id}).done(function(response){
      $('#post-'+response.id).fadeToggle();
    });

    $('#trash-'+id).modal('hide');

  });
 
  $( "#sortable" ).sortable({   
    placeholder: "ui-sortable-placeholder",
    start: function(e, ui){
        ui.placeholder.height(ui.item.height());
    }   
  });  
  

  resize_statusbar();

});

function resize_statusbar(){
  var freqs = $('.frequency');
  var freq, liWidth;
  var i = 1;
  $.each(freqs, function(index, item){
    freq = +($(item).text());
    liWidth = 100.0/freq;
    $('#progress-ul-'+i).children().css('width', liWidth + '%');
    i++;
  });
}

function include_completions(date, completions){
  for ( var i = 0; i < completions.length; i++ ){
    var day = Date.parse(completions[i].date);
    day = new Date(day);
    day.setDate(day.getDate());
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
    var week_day = ["Su", "M", "Tu", "W", "Th", "F", "Sa"];
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

    var status = "";
    for(var j = 0; j<response.completions.length && j<response.frequency; j++){
      status += "<div class='active'></div>";
    }

    for(j; j<response.frequency; j++){
      status += "<div class='inactive'></div>";
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

    $('#progress-ul-'+(index+1)).empty();
    $('#progress-ul-'+(index+1)).append(status);

    resize_statusbar();

  });

}

