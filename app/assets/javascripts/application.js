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
  
  var daybox = new Daybox();
  daybox.initialize();

  if(document.URL.indexOf("%23add-profile") > -1){
    $('#join').modal('show');
    $('#profileForm').modal('show');
  }

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

});






