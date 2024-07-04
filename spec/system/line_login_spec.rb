# spec/system/line_login_spec.rb
require 'rails_helper'

RSpec.describe 'LINE Login', type: :system do
  before do
    driven_by(:rack_test)
  end

  let(:line_user_id) { 'line-user-id-1234' }
  let(:user_name) { 'Test User' }

  before do
    stub_line_login(line_user_id: line_user_id, user_name: user_name)
  end

  it 'LINEログインが成功する' do
    visit login_path
    click_link 'LINEでログイン'

    # ここでLINEの認証ページにリダイレクトされ、認証が完了するとcallbackアクションに戻る
    # callbackアクションがトークンを受け取る処理をテストする
    visit line_login_api_callback_path(state: 'dummy_state', code: 'dummy_code')

    # ユーザーがログインされていることを確認
    expect(page).to have_content('ログインしました')
    expect(User.last.line_user_id).to eq(line_user_id)
    expect(User.last.name).to eq(user_name)
  end
end
