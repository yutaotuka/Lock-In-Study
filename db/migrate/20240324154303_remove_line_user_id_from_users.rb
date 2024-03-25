class RemoveLineUserIdFromUsers < ActiveRecord::Migration[7.1]
  def change
    remove_column :users, :line_user_id, :string
    remove_column :users, :name, :string
  end
end
