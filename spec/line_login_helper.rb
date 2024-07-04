# spec/support/line_login_helper.rb
module LineLoginHelper
  def stub_line_login(line_user_id:, user_name:)
    stub_request(:post, 'https://api.line.me/oauth2/v2.1/token').
      to_return(status: 200, body: {
        id_token: JWT.encode({ sub: line_user_id }, nil, 'none'),
        access_token: 'mock_access_token'
      }.to_json, headers: { 'Content-Type' => 'application/json' })

    stub_request(:get, 'https://api.line.me/v2/profile').
      to_return(status: 200, body: {
        displayName: user_name
      }.to_json, headers: { 'Content-Type' => 'application/json' })
  end
end

RSpec.configure do |config|
  config.include LineLoginHelper, type: :system
end
