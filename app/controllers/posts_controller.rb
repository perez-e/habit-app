class PostsController < ApplicationController
  before_action :authenticate_user!

  def create
    user = current_user
    habit = Habit.find(params[:habit_id])
    post = habit.posts.create(params[:post].permit(:body))
    post.user_id = user.id
    post.downvotes = 0
    post.upvotes = 0
    post.save

    respond_to do |f|
      unless user.profile.nil?
        f.json {render json: {post: post.as_json( include: [ :user ]), profile_pic: user.profile.profile_pic.url(:thumb).as_json, date: post.created_at.strftime("%-m/%e/%y").as_json } }
      else
        f.json {render json: {post: post.as_json( include: [ :user ]), date: post.created_at.strftime("%-m/%e/%y").as_json  } }
      end
    end

  end

  def down_vote
    post = Post.find(params[:id])
    vote = Vote.find_by(user_id: current_user.id, post_id: post.id)
    if vote
      point = vote.point
    # vote = post.votes.update_or_create(user_id: current_user.id)
    # point = vote.point.create_or_update(user_id: post.user_id, 2)
    # post.down_vote += 1
    # post.up_vote -= 1

  end

  def destroy
    post = Post.find(params[:id])
    post.destroy

    respond_to do |f|
      f.json {render json: post.to_json}
    end

  end

end
