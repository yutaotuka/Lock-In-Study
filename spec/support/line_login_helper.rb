# spec/support/line_login_helper.rb
module LineLoginHelper
  def stub_line_login(line_user_id:, user_name:)
    # モックデータの作成
    token_response = {
      id_token: JWT.encode({ sub: line_user_id }, nil, 'none'),
      access_token: 'mock_access_token'
    }.to_json

    profile_response = {
      displayName: user_name
    }.to_json

    # WebMockでLINE APIのレスポンスをモック
    stub_request(:post, 'https://api.line.me/oauth2/v2.1/token').
      to_return(status: 200, body: token_response, headers: { 'Content-Type' => 'application/json' })

    stub_request(:get, 'https://api.line.me/v2/profile').
      to_return(status: 200, body: profile_response, headers: { 'Content-Type' => 'application/json' })
  end
end
