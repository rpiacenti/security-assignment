json.extract! inquiry, :id, :question, :thing_id, :creator_id, :created_at, :updated_at
json.url inquiry_url(inquiry, format: :json)
json.user_roles inquiry.user_roles     unless inquiry.user_roles.empty?
