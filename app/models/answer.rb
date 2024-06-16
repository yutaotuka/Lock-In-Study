class Answer < ApplicationRecord
  belongs_to :user
  enum first_answer_choice: { study: 1, break: 2, other: 3 }

  validates :user_id, presence: true
end
