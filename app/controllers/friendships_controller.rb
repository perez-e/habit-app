class FriendshipsController < ApplicationController
  before_action :authenticate_user!

  def index
    @user = current_user
    #aka followers
    @friends = find_friends(@user)
  end

  def new
    @user = current_user
    results = search_matches(search)
    @friendship = @user.friendships.build()
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
        matches << user
      end
    # end
    # respond_to do |f|
    # f.json { render :json => {}}
    end
  end

end
