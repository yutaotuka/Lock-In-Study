class User < ApplicationRecord
  has_many :answers
  has_many :study_records
end
