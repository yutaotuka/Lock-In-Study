# spec/system/line_login_spec.rb

require 'rails_helper'

RSpec.describe "LINE Login", type: :system do
  before do
    stub_line_login(line_user_id: 'test_user', user_name: 'Test User')
  end

  it "LINEログインが成功する" do
    visit line_login_api_login_path
    expect(page).to have_content('ログインしました')
  end
end
