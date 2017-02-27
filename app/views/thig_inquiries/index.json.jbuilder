json.array!(@thing_inquiries) do |tq|
  json.extract! tq, :id, :question, :thing_id, :creator_id, :created_at, :updated_at
  json.thing_name tq.thing_name        if tq.respond_to?(:thing_name)
  json.image_caption tq.inquiry_question  if tq.respond_to?(:inquiry_question)
end
