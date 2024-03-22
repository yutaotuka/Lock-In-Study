class CreateStudyRecords < ActiveRecord::Migration[7.1]
  def change
    create_table :study_records do |t|
      t.datetime :start_time
      t.datetime :end_time
      t.integer :duration_time
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end
  end
end
