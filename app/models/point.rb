class Point < ActiveRecord::Base
  belongs_to :pointable, polymorphic: true
  belongs_to :points_action, :foreign_key => "action_id",
                          :class_name  => "PointsAction"
end
