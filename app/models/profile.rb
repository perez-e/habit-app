class Profile < ActiveRecord::Base

  belongs_to :user

  has_attached_file :profile_pic, styles: {
    thumb: '100x100>',
    square: '200x200#',
    medium: '300x300>'
  },
  :default_url => "https://s3-us-west-2.amazonaws.com/mapthat/profiles/profile_pics/photo-missing.png"

  validates_attachment_content_type :profile_pic, :content_type => /\Aimage\/.*\Z/

end
