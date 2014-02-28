class Completion < ActiveRecord::Base
  belongs_to :habit, :foreign_key => "habit_id",
                     :class_name  => "Habit"

  has_one :point, as: :pointable, dependent: :destroy
end