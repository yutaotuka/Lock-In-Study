# spec/support/line_login_helper.rb
module LineLoginHelper
  def stub_line_login
    token_response = {
      access_token: 'test_access_token',
      expires_in: 3600,
      id_token: 'test_id_token'
    }.to_json

    profile_response = {
      userId: 'U1234567890abcdef1234567890abcdef',
      displayName: 'Test User',
      pictureUrl: 'https://example.com/profile.png',
      statusMessage: 'Hello, world!'
    }.to_json

    stub_request(:post, 'https://api.line.me/oauth2/v2.1/token').
      to_return(status: 200, body: token_response, headers: { 'Content-Type' => 'application/json' })

    stub_request(:get, 'https://api.line.me/v2/profile').
      to_return(status: 200, body: profile_response, headers: { 'Content-Type' => 'application/json' })

    stub_request(:get, %r{https://access.line.me/oauth2/v2.1/authorize}).
      to_return(status: 302, headers: { 'Location' => "#{ENV['REDIRECT_URI']}?code=test_code&state=test_state" })
  end
end
