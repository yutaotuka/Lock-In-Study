require 'line/bot'

LINE_CLIENT = Line::Bot::Client.new do |config|
  config.channel_secret = ENV['LINE_CHANNEL_SECRET'] || Rails.application.credentials.dig(:line, :channel_secret)
  config.channel_token = ENV['LINE_CHANNEL_TOKEN'] || Rails.application.credentials.dig(:line, :channel_token)
end
