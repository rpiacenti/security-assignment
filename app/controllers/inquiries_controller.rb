class InquiriesController < ApplicationController
  wrap_parameters :inquiry, include: ["question"]
  #  before_action :get_inquiry, only: [:show, :update, :destroy]
  before_action :set_inquiry, only: [:update, :destroy]
  before_action :get_inquiry, only: [:index, :show]
  before_action :authenticate_user!, only: [:create, :update, :destroy]
  after_action :verify_authorized , except: [:show]
  after_action :verify_policy_scoped, only: [:index]

  # GET /inquiries
  # GET /inquiries.json
  def index
    authorize Inquiry
    @inquiries = policy_scope(Inquiry.all)
    @inquiries = InquiryPolicy.merge(@inquiries)
  end

  # GET /inquiries/1
  # GET /inquiries/1.json
  def show
    if @inquiries
      authorize @inquiries
      #@thing_id = params[:id]
      inquiries = policy_scope(Inquiry.where(:id=>@inquiries.id))
      puts "INQUIRY RESULTS: INICIO"
      puts inquiries
      puts "INQUIRY RESULTS: FIM"
      @inquiries = InquiryPolicy.merge(inquiries).last
    else
      render json: {errors: "Inquiry not found!"}, status: :unprocessable_entity
    end
  end

  def inquiry_things
    authorize @inquiry, :get_inquiry_thing?
    @inquiry_thing=@image.thing_images.prioritized.with_name
    render :index
  end

  # POST /inquiries
  # POST /inquiries.json
  def create
    authorize Inquiry
    @inquiry = Inquiry.new(inquiry_params)
    @inquiry.creator_id=current_user.id

    User.transaction do
      if @inquiry.save
        role=current_user.add_role(Role::ORGANIZER, @inquiry)
        @inquiry.user_roles << role.role_name
        role.save!
        render :show, status: :created, location: @inquiry
      else
        render json: {errors:@inquiry.errors.messages}, status: :unprocessable_entity
      end
    end
  end

  # PATCH/PUT /inquiries/1
  # PATCH/PUT /inquiries/1.json
  def update
    authorize @inquiry

    if @inquiry.update(inquiry_params)
      head :no_content
    else
      render json: {errors:@inquiry.errors.messages}, status: :unprocessable_entity
    end

  end

  # DELETE /inquiries/1
  # DELETE /inquiries/1.json
  def destroy
    authorize @inquiry
    @inquiry.destroy

    head :no_content
  end

  private

  def set_inquiry
    @inquiry = Inquiry.find(params[:id])
  end
  def get_inquiry
    @id = params[:id]
    puts 'parametro: ' + params[:id]
    @inquiries = Inquiry.find_by_id(@id)
    puts "GET_INQUIRY RESULT for parameter: " + @id
    #@inquiry = Inquiry.where(:thing_id=> @thing_id)
  end


  def inquiry_params
    params.require(:inquiry).tap {|p|
        p.require(:question) #throws ActionController::ParameterMissing
      }.permit(:question, :thing_id, :creator_id, :created_at)
  end
end
