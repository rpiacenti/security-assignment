class InquiryPolicy < ApplicationPolicy
  def index?
    originator_or_organizer?
  end

  def show?
    originator_or_organizer?
  end

  def create?
    member
  end

  def update?
    organizer?
  end

  def destroy?
    organizer?
  end

  class Scope < Scope
    def user_roles members_only=true, allow_admin=false
      include_admin=allow_admin && @user && @user.is_admin?
      member_join = members_only && !include_admin ? "join" : "left join"
      joins_clause=["left join Roles r on r.mname='Inquiries'",
                    "r.mid=Inquiries.id",
                    "r.user_id #{user_criteria}"].join(" and ")
      scope.select("Inquiries.*, r.role_name")
      .joins(joins_clause)
      .tap {|s|
        if members_only
          s.where("r.role_name"=>[Role::ORGANIZER, Role::MEMBER])
        end}
      end
    def resolve
      user_roles
    end
  end
end
