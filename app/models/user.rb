class User < ApplicationRecord
  has_many :answers
  has_many :study_records

  validates :line_user_id, presence: true, uniqueness: true
end
