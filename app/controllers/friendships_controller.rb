class FriendshipsController < ApplicationController
  before_action :authenticate_user!

  def index
    @user = current_user
    #aka followers
    @followers = find_followers(@user)
    @following = find_following(@user)
    @posts = get_posts(@user, @following)
  end

  def new
    #this still needs error handling on page - right now, just renders index, but requires some regex.
    user = current_user
    valid_search = /\w{3,20}@\w{2,20}\.\w{1,3}/
    search_params = params[:email]
    if search_params.match(valid_search)
      results = search_matches(search_params)
      if results.empty?
        respond_to do |f|
          f.json { render status: 500 }
        end
        render :index
      else
        respond_to do |f|
          f.json { render json: results } 
        end
      end
    else
      render :index
    end
  end

  def create
    user = current_user
    f_id = params[:friend_id]
    unless Friendship.find_by(user_id: user.id, friend_id: f_id)
      friendship = user.friendships.build(friend_id: params[:friend_id])
      if friendship.save
        id = Friendship.last.friend_id
        friend = User.find(id)
        respond_to do |f|
          f.json { render json: {status: "200"}}
        end
      else
        respond_to do |f|
          f.json {render json: {status: "500"}}
        end
      end
    end
  end

  def delete (friend)
    user = current_user
    friendship = Friendship.where(user_id == user.id && friend_id == friend.id)
    if friendship.delete
      redirect_to friendship_path, notice: "You are no longer following #{friend.first_name}"
    else
      redirect_fo root_path, notice: "Oops.  Try Again."
    end
  end

#eventually move these

  def get_posts(user, friends)
    posts = []
    friends.each do |friend|
      unless friend.posts.empty?
        friend.posts.each do |post|
          posts << post
        end
      end
    end
    unless user.posts.empty?
      user.posts.each do |pos|
        posts << pos
      end
    end
    show_posts = posts.sort_by{ |post| post.created_at }.reverse
    return show_posts
  end


  def find_followers(user)
    relationships = Friendship.where(friend_id: user.id)
    friends = []
    relationships.each do |f|
      friend = User.find(f.user_id)
      friends << friend
    end
    return friends
  end

  def find_following(user)
    relationships = Friendship.where(user_id: user.id)
    friends = []
    relationships.each do |f|
      friend = User.find(f.friend_id)
      friends << friend
    end
    return friends
  end

  def search_matches(email)
    users = User.all
    matches = []
    users.each do |user|
      if /#{email}/.match(user.email)
        if user.profile
          url = user.profile.profile_pic.url(:thumb)
          list_info = {
            :friend_id => user.id, 
            :name => (user.first_name + " " + user.last_name),
            :pic_url => url,
            :tagline => user.profile.tagline
           }
        else
          list_info = {
            :name => user.first_name,
            :friend_id => user.id 
          }
        end
        matches << list_info
      end
    end
    return matches
  end

end
