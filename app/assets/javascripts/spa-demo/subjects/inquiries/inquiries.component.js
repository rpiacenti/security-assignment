(function() {
  "use strict";

  angular
  .module("spa-demo.subjects")
  .component("sdInquirySelector", {
    templateUrl: InquirySelectorTemplateUrl,
    controller: InquirySelectorController,
    bindings: {
      authz: "<"
    },
  })
  .component("sdInquiryEditor", {
    templateUrl: InquiryEditorTemplateUrl,
    controller: InquiryEditorController,
    bindings: {
      authz: "<"
    },
    require: {
      InquiriesAuthz: "^sdInquiriesAuthz"
    }
  });


  InquirySelectorTemplateUrl.$inject = ["spa-demo.config.APP_CONFIG"];
  function InquirySelectorTemplateUrl(APP_CONFIG) {
    console.log("InquirySelectorTemplateUrl");
    return APP_CONFIG.inquiry_selector_html;
  }
  InquiryEditorTemplateUrl.$inject = ["spa-demo.config.APP_CONFIG"];
  function InquiryEditorTemplateUrl(APP_CONFIG) {
    console.log("InquiryEditorTemplateUrl");
    return APP_CONFIG.inquiry_editor_html;
  }

  InquirySelectorController.$inject = ["$scope",
  "$stateParams",
  "spa-demo.authz.Authz",
  "spa-demo.subjects.Inquiry"];
  function InquirySelectorController($scope, $stateParams, Authz, Inquiry) {
    console.log("InquirySelectorController");
    var vm=this;

    vm.$onInit = function() {
      console.log("InquirySelectorController",$scope);
      $scope.$watch(function(){ return Authz.getAuthorizedUserId(); },
      function(){
        if (!$stateParams.id) {
          vm.items = Inquiry.query();
        }
      });
    }
    return;
  }


  InquiryEditorController.$inject = ["$scope","$q",
  "$state", "$stateParams",
  "spa-demo.authz.Authz",
  "spa-demo.subjects.Inquiry"];
  function InquiryEditorController($scope, $q, $state, $stateParams,
    Authz, Inquiry) {
      console.log("InquiryEditorController");
      var vm=this;
      vm.thing_name = $stateParams.thing_name;
      vm.thing_id = $stateParams.thing_id;
      vm.create = create;
      vm.clear = ""
      vm.back  = back;
      vm.update  = update;
      vm.remove  = remove;

      console.log("Parameter: " + vm.thing_name);

      vm.$onInit = function() {
        console.log("InquiryEditorController",$scope);
        console.log(Authz.getAuthorizedUserId());
        $scope.$watch(function(){ return Authz.getAuthorizedUserId(); },
        function(){
          if ($stateParams.id) {
            reload($stateParams.id);
          }
        });
      }
      return;
      //////////////
      function newResource() {
        console.log("newResource()");
        vm.item = new Inquiry();
        vm.InquirysAuthz.newItem(vm.item);
        return vm.item;
      }

      function reload(InquiryId) {
        var itemId = InquiryId ? InquiryId : vm.item.id;
        var thing_id = "";
        console.log("re/loading Inquiry", itemId);

        vm.item = Inquiry.get({id:itemId});
        if(vm.item){
          //    vm.InquirysAuthz.newItem(vm.item);
          $q.all([vm.item.$promise]).catch(handleError);
        }
        //  vm.thing = Thing.get({id: thing_id});
        //  vm.things = InquiryThing.query({Inquiry_id:itemId});
        //  vm.linkable_things = InquiryLinkableThing.query({Inquiry_id:itemId});


        // $q.all([vm.item.$promise,
        //         vm.things.$promise]).catch(handleError);
      }

      $q.all(promises).then(
        function(response){
          console.log("promise.all response", response);
          //update button will be disabled when not $dirty
          $scope.inquiryform.$setPristine();
          reload();
        },
        handleError);


        function back() {
          $state.go("things", {id:vm.thing_id});
        }

        function create() {
          vm.item.$save().then(
            function(){
              $state.go(".", {id: vm.item.id});
            },
            handleError);
          }

          function update() {
            vm.item.errors = null;
            var update=vm.item.$update();
          }

          function remove() {
            vm.item.errors = null;
            vm.item.$delete().then(
            function(){
                console.log("remove complete", vm.item);
                back();
            },
              handleError);
            }

            function handleError(response) {
              console.log("error", response);
              if (response.data) {
                vm.item["errors"]=response.data.errors;
              }
              if (!vm.item.errors) {
                vm.item["errors"]={}
                vm.item["errors"]["full_messages"]=[response];
              }
              $scope.inquiryform.$setPristine();
            }
          }

        })();
