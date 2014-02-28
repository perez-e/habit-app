class HabitsController < ApplicationController
  before_action :authenticate_user!

  def index
    @habits = current_user.habits # TODO where habit is active

    @user = current_user
    @profile = @user.build_profile
    
    respond_to do |f|
      f.html
      f.json { render json: @habits.to_json }
    end
  end

  def show 
    @habit = Habit.find(params[:id])
    @completions = @habit.this_weeks_completions
    @posts = @habit.posts.order(created_at: :desc).limit(5).reverse

    respond_to do |f|
      f.html
      f.json { render json: @habit.to_json }
    end
  end

  def new
    @habit = Habit.new
  end

  def create
    @habit = current_user.habits.new(get_habit_params)
    
    if @habit.save
      redirect_to habit_path(@habit.id)
    else
      render :new
    end
  end

  def edit
    @habit = Habit.find(params[:id])    
  end

  def update
    @habit = Habit.find(params[:id])

    if @habit.update_attributes(get_habit_params)
      redirect_to habit_path(@habit.id)
    else
      render :edit
    end
  end

  def destroy
    habit = Habit.find(params[:id])
    habit.destroy

    respond_to do |f|
      f.html { redirect_to action: :index }
      f.json { render json: habit.to_json }
    end
  end

  private

  def get_habit_params
    params.require(:habit).permit(:name, :frequency, :timeframe, :visibility)
  end

end
