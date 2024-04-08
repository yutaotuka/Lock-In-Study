class User < ApplicationRecord
  has_many :answers
  has_many :study_records

  validates :line_user_id, presence: true, uniqueness: true

  def self.guest
    find_or_create_by!(line_user_id: 'lis12345') do |user|
      user.name = "guest"
      user.is_guest = true
    end
  end 

  def guest?
    self.is_guest
  end
end
