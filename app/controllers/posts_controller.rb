class PostsController < ApplicationController
  before_action :authenticate_user!

  def create
    user = current_user
    habit = Habit.find(params[:habit_id])
    post = habit.posts.create(params[:post].permit(:body))
    post.user_id = user.id
    post.save

    respond_to do |f|
      unless user.profile.nil?
        f.json {render json: {post: post.as_json( include: [ :user ]), profile_pic: user.profile.profile_pic.url(:thumb).as_json, date: post.created_at.strftime("%-m/%e/%y").as_json } }
      else
        f.json {render json: {post: post.as_json( include: [ :user ]), date: post.created_at.strftime("%-m/%e/%y").as_json  } }
      end
    end

  end

  def vote
    
  end

end
