Rails.application.routes.draw do
  root 'home#top'
  get 'home/privacy_policy', to: 'home#privacy_policy'
  get 'home/terms_of_service', to: 'home#terms_of_service'

  get 'line_login_api/login', to: 'line_login_api#login'
  get 'line_login_api/callback', to: 'line_login_api#callback'
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  get "study_time/index" => "study_time#index"
  get 'answer_index/index' => 'answer_index#index'

  get "login" => "login#login"
  delete 'logout', to: 'setting#destroy', as: 'logout'

  # ゲストログイン
  post 'guest_login', to: 'login#guest_login'

  # LINE_message
  post 'send_custom_message', to: 'messages#send_custom_message'

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

    # カスタムエラーページ用のルート
    get '/400', to: 'errors#bad_request', as: :bad_request
    get '/401', to: 'errors#unauthorized', as: :unauthorized
    get '/403', to: 'errors#forbidden', as: :forbidden
    get '/404', to: 'errors#not_found', as: :not_found
    get '/409', to: 'errors#conflict', as: :conflict
    get '/422', to: 'errors#unprocessable_entity', as: :unprocessable_entity
    get '/429', to: 'errors#too_many_requests', as: :too_many_requests
    get '/500', to: 'errors#internal_server_error', as: :internal_server_error
    get '/503', to: 'errors#service_unavailable', as: :service_unavailable

  # すべての未知ルートを404
  match '*path', to: 'errors#not_found', via: :all

  # 開発環境でのみエラーページのプレビューを有効にする
  if Rails.env.development?
    get '/errors/:status', to: 'errors#show'
  end
end
