require 'line/bot'

LINE_CLIENT = Line::Bot::Client.new{ |config|
  config.channel_secret = Rails.application.credentials.line[:channel_secret]
  config.channel_token = Rails.application.credentials.line[:channel_token]
}