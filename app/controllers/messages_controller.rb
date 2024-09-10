class MessagesController < ApplicationController
  def send_custom_message
    user_id = params[:user_id]
    message = params[:message]
    
    response = LineBotService.send_message(user_id, message)
    
    if response.code == '200'
      render json: { status: 'success' }, status: :ok
    else
      render json: { status: 'error', message: response.body }, status: :internal_server_error
    end
  end
end
