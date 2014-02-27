class FriendshipsController < ApplicationController
  before_action :authenticate_user!

  def index
    @user = current_user
    #aka followers
    @friends = find_friends(@user)
  end

  def new
    user = current_user
    results = search_matches(params[:email])
    respond_to do |f|
      f.json { render json: results } 
    end
  end

  def create
    user = current_user
    friendship = user.friendships.build(friendship_params)
    if friendship.save
      id = friendship.last.friend_id
      friend = User.find(id)
      redirect_to friendship_path, notice: "You are now following #{friend.first_name}!"
    else
      redirect_to root_path, notice: "Oops.  Try Again."
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

  def find_friends(user)
    relationships = Friendship.where(friend_id: user.id)
    friends = []
    relationships.each do |f|
      friend = User.find(f.user_id)
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
            :name => (user.first_name + " " + user.last_name),
            :pic_url => url
           }
        else
          list_info = {
            :name => user.first_name
          }
        end
        matches << list_info
      end
    end
    return matches
  end

end
