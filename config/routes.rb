HabitApp::Application.routes.draw do
  devise_for :users

  root :to => "welcome#index"
  resources :habits
  resources :posts
  resources :friendships

  post "/completions", to: "completions#create"
  delete "/completions", to: "completions#destroy"
  post "/previous_week", to: "completions#previous_week"

  get "/profile", to: "profiles#show", as: "profiles"
  get "/habits#add-profile", to: "habits#index", as: "new_user_profile"
  get "/profile#add-profile", to: "profiles#add", as: "add_profile"
  post "/profile", to: "profiles#create"

  post "/downvotes", to: "posts#down_vote"
  post "/upvotes", to: "posts#up_vote"

  resources :habits do
    resources :posts, as: "habit_posts"
  end

end
