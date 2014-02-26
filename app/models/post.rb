class Post < ActiveRecord::Base
  belongs_to :postable, polymorphic: true
  #belongs_to :user, through: :habits (commenting out for heroku)
  has_many :posts, as: :postable
end