class ThingInquiriesController < ApplicationController
  include ActionController::Helpers
  helper ThingsHelper
  wrap_parameters :thing_inquiry, include: ["inquiry_id", "thing_id"]
  before_action :get_thing, only: [:index, :update, :destroy]
  before_action :get_thing_inquiry, only: [:inquiry_things]
  #before_action :get_thing_inquiry, only: [:update, :destroy]
  before_action :authenticate_user!, only: [:create, :update, :destroy]
  after_action :verify_authorized
  #after_action :verify_policy_scoped, only: [:linkable_things]

  def index
    authorize @thing, :get_inquiry?
    @thing_inquiries = @thing.inquiry
  end

  def inquiry_things
    authorize @inquiry, :get_things?
    @thing_inquiry=@inquiry.thing_inquiry.prioritized.with_name
    render :index
  end

  def linkable_things
    authorize Thing, :get_linkables?
    inquiry = Inquiry.find(params[:inquiry_id])
    #@things=policy_scope(Thing.not_linked(image))
    #need to exclude admins from seeing things they cannot link
    @things=Thing.not_linked(inquiry)
    @things=ThingPolicy::Scope.new(current_user,@things).user_roles(true,false)
    @things=ThingPolicy.merge(@things)
    render "things/index"
  end

  def update
    authorize @thing, :update_inquiry?
    if @thing_inquiry.update(thing_inquiry_update_params)
      head :no_content
    else
      render json: {errors:@thing_inquiry.errors.messages}, status: :unprocessable_entity
    end
  end

  def destroy
    authorize @thing, :remove_inquiry?
    @thing_inquiry.destroy
    head :no_content
  end

  private
    def get_thing
      @thing ||= Thing.find(params[:thing_id])
    end
    def get_thing_inquiry
      @inquiry ||= Inquiry.find(params[:inquiry_id])
    end
    # def get_thing_inquiry
    #   @thing_inquiry ||= Inquiry.Inquiry.find_by_thing_id(params[:thing_id])
    # end
    def thing_inquiry_update_params
      params.require(:thing_inquiry).permit(:question)
    end
end
