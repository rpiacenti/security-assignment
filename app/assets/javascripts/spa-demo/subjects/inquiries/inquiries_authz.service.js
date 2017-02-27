(function() {
  "use strict";

  angular
  .module("spa-demo.subjects")
  .factory("spa-demo.subjects.InquiriesAuthz", InquiriesAuthzFactory);

  InquiriesAuthzFactory.$inject = ["spa-demo.authz.Authz",
  "spa-demo.authz.BasePolicy"];
  function InquiriesAuthzFactory(Authz, BasePolicy) {
    console.log("InquiriesAuthzFactory");

    function InquiriesAuthz() {
      BasePolicy.call(this, "Inquiry");
    }

    //start with base class prototype definitions
    InquiriesAuthz.prototype = Object.create(BasePolicy.prototype);
    InquiriesAuthz.constructor = InquiriesAuthz;

    //override and add additional methods
    InquiriesAuthz.prototype.canCreate=function() {
      //console.log("ItemsAuthz.canCreate");
      return Authz.isAuthenticated();
    };

    //add custom definitions
    InquiriesAuthz.prototype.canUpdateInquiry=function(inquiry) {
      return Authz.isOrganizer(inquiry);
    };
    InquiriesAuthz.prototype.canDeleteInquiry=function(inquiry) {
      return Authz.isOrganizer(inquiry);
    };
    InquiriesAuthz.prototype.canRemoveInquiry=function(inquiry) {
      return Authz.isOrganizer(inquiry);
    };
    InquiriesAuthz.prototype.canQueryInquiry=function(inquiry) {
      console.log("ThingsAuthz.canQueryInquiry", inquiry);
      return Authz.isMember(inquiry) || Authz.isOrganizer(inquiry);
    };
    return new InquiriesAuthz();
  }
})();
