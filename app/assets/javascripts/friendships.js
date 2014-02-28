$(document).on('ready page:load', function(){

  $('#search-email').on('click', function(event) {
    event.preventDefault();
    var email = { email: $('#friend-email').val() };
    $.ajax({
      type: 'get',
      url: '/friendships/new',
      data: email }).success(function(response) {
        $('#friend-results').empty();
        $(response).each(function( index, Element ) {
          var context = {
            friend_id: Element.friend_id,
            name: Element.name,
            tagline: Element.tagline,
            pic: Element.pic_url
          };
          var template = HandlebarsTemplates.friend_search(context);
          $('#friend-results').append(template);
        });
        $('#user-result-list').modal('show');
      }).fail(function(response) {
        $('p.warning').append("Something went wrong.  Please re-try your search.");
        $('#friend_email').empty();
      });
  });

  $('#followers-link').on('click', function(event) {
    event.preventDefault();
    $('#menu-item').children().removeClass().addClass('hide');
    $('#followers').removeClass();
  });

  $('#following-link').on('click', function(event) {
    event.preventDefault();
    $('#menu-item').children().removeClass().addClass('hide');
    $('#following').removeClass();
  });

  $('#activity-link').on('click', function(event) {
    event.preventDefault();
    $('#menu-item').children().removeClass().addClass('hide');
    $('#activity').removeClass();
  });

  $(document).on('click', '#add-friend', function(event) {
    event.preventDefault();
    var id = { friend_id: $('#add-friend').find('#friend-info').val() };
    $.ajax({
      type: 'post',
      url: '/friendships',
      data: id
    }).done(function(response) {
      $('p.notice').append("Congratulations. You have a new friend!");
      $('#user-result-list').modal('hide');
    }).fail(function(response) {
      $('p.warning').append("Something went wrong.  Please re-try your search.");
    }); 
  });
  $('p.warning').empty();
  $('p.notice').empty();
});