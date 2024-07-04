class ApplicationController < ActionController::Base
  helper_method :current_user, :logged_in?

  protect_from_forgery with: :exception

  # テスト環境でのみCSRFトークンチェックを無効にする
  skip_before_action :verify_authenticity_token, if: -> { Rails.env.test? }
  private

  def current_user
    @current_user ||= User.find(session[:user_id]) if session[:user_id]
  rescue ActiveRecord::RecordNotFound
    session[:user_id] = nil
  end

  def logged_in?
    !current_user.nil?
  end
end
