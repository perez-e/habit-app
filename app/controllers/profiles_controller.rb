class ProfilesController < ApplicationController

before_action :authenticate_user!

  def new
    @user = current_user
    @profile = @user.build_profile
  end

  def create
    @user = current_user
    profile = @user.build_profile(profile_params)
    if profile.save
      redirect_to habits_path
    else
      redirect_to add_profile_path
    end
  end

  def show
    @user = current_user
    @habit = Habit.new
    if @user.profile
      @profile = @user.profile
    else
      redirect_to add_profile_path
    end
  end

  def add
    @user = current_user
    @profile = @user.build_profile
    @habit = Habit.new
    render :show
  end

  def profile_params
    params.require(:profile).permit(:tagline, :profile_pic)
  end
end