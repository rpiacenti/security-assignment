(function() {
  "use strict";

  angular
    .module("spa-demo.subjects")
    .factory("spa-demo.subjects.Inquiry", InquiryFactory);

  InquiryFactory.$inject = ["$resource", "spa-demo.config.APP_CONFIG"];
  function InquiryFactory($resource, APP_CONFIG) {
    console.log("InquiryFactory");
    var service = $resource(APP_CONFIG.server_url + "/api/inquiries/:id",
      { id: '@id' },
      { get: {method: "GET" },
        update: {method: "PUT"},
        save:   {method: "POST", transformRequest: checkEmptyPayload }
      });
    return service;
  }

  //rails wants at least one parameter of the document filled in
  //all of our fields are optional
  //ngResource is not passing a null field by default, we have to force it
  function checkEmptyPayload(data) {
    if (!data['question']) {
      data['question']=null;
    }
    return angular.toJson(data);
  }
})();
