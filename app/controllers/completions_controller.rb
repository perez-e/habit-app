class CompletionsController < ApplicationController
  before_action :authenticate_user!


  def create
    habit = current_user.habits.find_by_name(params[:name])

    complete = habit.completions.create(status: true, date: Date.parse(params[:date]))
    completion.create_point(user_id: current_user.id, action_id: 3)

    respond_to do |f|
      f.json { render json: complete.to_json }
    end
  end

  def destroy
    habit = current_user.habits.find_by_name(params[:name])
    completion = habit.completions.where("date >= ? AND date < ?", Date.parse(params[:date]).beginning_of_day, Date.parse(params[:date]).end_of_day)
    completion.first.destroy

    first = Date.parse(params[:date]).beginning_of_week - 1
    last = first + 6
    completions = habit.completions.where("date > ? AND date < ?", first-1, last+1)

    respond_to do |f|
      f.json { render json: {completions: completions.as_json, habit: habit } }
    end
  end

  def previous_week
    habit = current_user.habits.find_by(name: params[:name])
    d = Date.parse(params[:date])
    first = d.beginning_of_week - 1
    last = first + 6
  
    completions = habit.completions.where("date > ? AND date < ?", first-1, last+1)
    respond_to do |f|
      f.json { render json: {date: first, completions: completions.as_json, frequency: habit.frequency} }
    end
  end

end
