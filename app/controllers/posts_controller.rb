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
      pa = vote.points_action
      if pa.action_name != 'downvote'
        point = vote.point
        point.action_id = 2
        point.save
        post.downvotes += 1
        post.upvotes -= 1
        post.save
      end
    else
      vote = post.votes.create(user_id: current_user.id)
      point = vote.point.create(user_id: post.user_id, action_id: 2)
      post.downvotes += 1
      post.save
    end

    respond_to do |f|
      f.json { render json: post.to_json }
    end

  end

  def up_vote
    post = Post.find(params[:id])
    vote = Vote.find_by(user_id: current_user.id, post_id: post.id)
    if vote
      pa = vote.points_action
      if pa.action_name != 'upvote'
        point = vote.point
        point.action_id = 1
        point.save
        post.downvotes -= 1
        post.upvotes += 1
        post.save
      end
    else
      vote = post.votes.create(user_id: current_user.id)
      point = vote.point.create(user_id: post.user_id, action_id: 1)
      post.upvotes += 1
      post.save
    end

    respond_to do |f|
      f.json { render json: post.to_json }
    end
    
  end

  def destroy
    post = Post.find(params[:id])
    post.destroy

    respond_to do |f|
      f.json {render json: post.to_json}
    end

  end

end
