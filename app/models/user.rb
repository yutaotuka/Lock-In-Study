class User < ApplicationRecord
  has_many :study_records
  has_many :answers
end
