class CreateAnswers < ActiveRecord::Migration[7.1]
  def change
    create_table :answers do |t|
      t.integer :first_answer_choice
      t.text :second_answer
      t.text :third_answer
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
