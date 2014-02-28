HabitApp::Application.routes.draw do
  devise_for :users

  root :to => "welcome#index"
  resources :habits
  resources :posts

  post "/completions", to: "completions#create"
  delete "/completions", to: "completions#destroy"
  post "/previous_week", to: "completions#previous_week"

  get "/profile", to: "profiles#show", as: "profiles"
  get "/sign_up/profile", to: "profiles#new", as: "add_profile"
  post "/profile", to: "profiles#create"

  post "/votes", to: "posts#vote"

  resources :habits do
    resources :posts, as: "habit_posts"
  end

end
