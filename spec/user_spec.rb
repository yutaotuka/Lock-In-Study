require 'rails_helper'

Rspec.describe User, type: :model do
  it "有効なline_user_idと名前がある場合は成功する" do
    user = User.new(line_user_id: "id12345678925", name: "有効 太郎")
    expect(user).to be_valid
  end

  it "line_user_idがない場合は無効" do
    user = User.new(line_user_id: "", name: "無効 太郎")
    expect(user).to_not be_valid
    expect(user.errors[:line_user_id]).to include("can't be blank")
  end

  it "重複したline_user_idは無効" do
    User.create(line_user_id: "unique_id1234", name: "重複  太郎")
    user = User.new(line_user_id: "unique_id1234", name: "重複  二郎")
    expect(user).to_not be_valid
    expect(user.errors[:line_user_id]).to include("has already been taken")
  end

  it "名前がない場合は無効" do
    user = User.new(line_user_id: "id1234567890", name: "")
    expect(user).to_not be_valid
    expect(user.errors[:name]).to include("can't be blank")
  end
end