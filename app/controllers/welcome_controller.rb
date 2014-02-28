class WelcomeController < ApplicationController


  def index
    @user = User.new()
    
    if current_user
      if current_user.profile.nil?
        redirect_to add_profile_path
      else
        redirect_to habits_path
      end
    elsif current_user.nil?
      render :index
    end
  end

end