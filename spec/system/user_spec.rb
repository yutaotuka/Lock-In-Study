require 'rails_helper'

RSpec.describe 'User sessions', type: :system do
  before do
    driven_by(:rack_test)
  end

  let!(:user) { User.create(line_user_id: 'id12345678925', name: '有効 太郎') }

  it 'ログインしていない場合、ゲストユーザーが表示される' do
    visit root_path
    expect(page).to have_content('ゲストユーザー使用中')
    expect(page).to have_link('ログイン/会員登録')
  end

  it 'ログインしている場合、ゲストユーザーが表示されない' do
    # ユーザーをログイン状態にするためのヘルパーメソッドを使用します
    login_as(user, scope: :user)

    visit root_path
    expect(page).to_not have_content('ゲストユーザー使用中')
    expect(page).to_not have_link('ログイン/会員登録')
  end

  it 'ログインページにアクセスできる' do
    visit '/login'
    expect(page).to have_content('LINEでログイン')
  end

  it 'LINEでログインリンクが正しいパスを指している' do
    visit '/login'
    expect(page).to have_link('LINEでログイン', href: line_login_api_login_path)
  end

  it 'ログアウトリンクが機能する' do
    # ユーザーをログイン状態にするためのヘルパーメソッドを使用します
    login_as(user, scope: :user)

    visit root_path
    click_link 'ログアウト' # ログアウトリンクが存在する場合

    expect(page).to have_link('ログイン/会員登録')
    expect(page).to have_content('ゲストユーザー使用中')
  end
end
