(function() {
  "use strict";

  angular
    .module("spa-demo.subjects")
    .directive("sdInquiriesAuthz", InquiriesAuthzDirective);

  InquiriesAuthzDirective.$inject = [];

  function InquiriesAuthzDirective() {
    var directive = {
        bindToController: true,
        controller: InquiriesAuthzController,
        controllerAs: "vm",
        restrict: "A",
        link: link
    };
    return directive;

    function link(scope, element, attrs) {
      console.log("InquiriesAuthzDirective", scope);
    }
  }

  InquiriesAuthzController.$inject = ["$scope",
                                   "spa-demo.subjects.InquiriesAuthz"];
  function InquiriesAuthzController($scope, InquiriesAuthz) {
    console.log("InquiriesAuthzController");
    var vm = this;
    vm.authz={};
    vm.authz.canUpdateItem = canUpdateItem;
    vm.newItem=newItem;

    activate();
    return;
    //////////
    function activate() {
      vm.newItem(null);
    }

    function newItem(item) {
      InquiriesAuthz.getAuthorizedUser().then(
        function(user){ authzUserItem(item, user); },
        function(user){ authzUserItem(item, user); });
    }

    function authzUserItem(item, user) {
      console.log("new Item/Authz", item, user);

      vm.authz.authenticated = InquiriesAuthz.isAuthenticated();
      vm.authz.canQuery      = InquiriesAuthz.canQueryInquiry();
      if (item && item.$promise) {
        vm.authz.canUpdate     = false;
        vm.authz.canDelete     = false;
        vm.authz.canGetDetails = false;
        item.$promise.then(function(){ checkAccess(item); });
      } else {
        checkAccess(item)
      }
    }

    function checkAccess(item) {
      vm.authz.canUpdate     = InquiriesAuthz.canUpdate(item);
      vm.authz.canDelete     = InquiriesAuthz.canRemoveInquiry(item);
      vm.authz.canGetDetails = InquiriesAuthz.canGetDetails(item);
      console.log("checkAccess", item, vm.authz);
    }

    function canUpdateItem(item) {
    //  return InquiriesAuthz.canUpdateInquiry(item);
        return true;
    }
  }
})();
