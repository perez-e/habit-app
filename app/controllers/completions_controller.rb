class CompletionsController < ApplicationController

  def create
    habit = current_user.habits.find_by_name(params[:name])
    complete = habit.completions.create(status: true)

    respond_to do |f|
      f.json { render json: complete.to_json }
    end
  end

  def destroy
    complete = current_user.habits.find_by_name(params[:name]).completions.last
    complete.destroy

    respond_to do |f|
      f.json { render json: complete.to_json }
    end
  end

end
