require 'rails_helper'

RSpec.describe 'LINE Login', type: :system do
  include LineLoginHelper

  before do
    driven_by(:rack_test)
    stub_line_login
  end

  it 'LINEログインが成功する' do
    visit line_login_api_login_path(redirect_uri: ENV['REDIRECT_URI'])
    expect(page).to have_content('ログインしました')
  end
end
