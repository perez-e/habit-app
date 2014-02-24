HabitApp::Application.routes.draw do
  devise_for :users
  #[NIKKI] temporary root per devise

  get "/habits/" => "habits#index", as: 'habits'
  get "/habits/new" => "habits#new", as: 'new_habit' 
  root :to => "welcome#index"

end
