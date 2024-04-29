Rails.application.routes.draw do
  root 'home#top'

  get 'line_login_api/login', to: 'line_login_api#login'
  get 'line_login_api/callback', to: 'line_login_api#callback'
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  get "study_time/index" => "study_time#index"

  get "login" => "login#login"
  delete 'logout', to: 'setting#destroy', as: 'logout'

  # ゲストログイン
  post 'guest_login', to: 'login#guest_login'

  # get '/study_records' => 'study_records#index'
  resources :study_records, only: [:index] do
    member do
      patch :stop
    end
    collection do
      post :start
    end
  end
  resources :answers, only: [:new, :create]
end
