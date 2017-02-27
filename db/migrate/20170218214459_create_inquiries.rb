class CreateInquiries < ActiveRecord::Migration
  def change
    create_table :inquiries do |t|
      t.text :question
      t.integer :thing_id
      t.integer :creator_id, {null:false}

      t.timestamps null: false
    end
    add_index :inquiries, :thing_id
    add_index :inquiries, :creator_id
  end
end
