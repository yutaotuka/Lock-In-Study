class LoginController < ApplicationController
  def login; end

  def guest_login
    user = User.guest
    session[:user_id] = user.id
    redirect_to study_records_path
  end
end
