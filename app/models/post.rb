class Post < ActiveRecord::Base
  belongs_to :postable, polymorphic: true

  has_many :posts, as: :postable
  
  belongs_to :user

  has_many :votes, :foreign_key => "post_id",
                   :class_name  => "Vote"

end
