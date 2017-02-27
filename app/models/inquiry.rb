class Inquiry < ActiveRecord::Base
  include Protectable

  belongs_to :thing
end
