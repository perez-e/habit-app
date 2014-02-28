class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  has_one :profile

  has_many :friendships, :foreign_key => 'user_id', 
                         :class_name  => "Friendship"
  has_many :friends, :through => :friendships

  has_many :messages

  has_many :habits

  has_many :posts

  has_many :votes, :foreign_key => "user_id",
                   :class_name  => "Vote"

  #has_many :completions, :through => :habits (commenting out for heroku)
  #has_many :points, :through => :habits (commenting out for heroku)

  def find_posts_about_users_habits(user)
    user.habits.each do |habit|
      habit.posts
    end
  end

  def full_name
    "#{first_name} #{last_name}"
  end




end
