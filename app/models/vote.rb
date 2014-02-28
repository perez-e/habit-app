class Vote < ActiveRecord::Base
  belongs_to :user
  belongs_to :post
  has_one :point, as: :pointable
  has_one :points_action, through: :point
end
