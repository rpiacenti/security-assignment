(function() {
  "use strict";

  angular
    .module("spa-demo.subjects")
    .factory("spa-demo.subjects.ThingInquiry", ThingInquiry);

  ThingInquiry.$inject = ["$resource","spa-demo.config.APP_CONFIG"];
  function ThingInquiry($resource, APP_CONFIG) {
    return $resource(APP_CONFIG.server_url + "/api/things/:thing_id/thing_inquiries/:id",
      { thing_id: '@thing_id',
        id: '@id'},
      { update: {method:"PUT"},
       get: {method:"GET", isArray: true }
      });
  }
  // {
  //   return $resource(APP_CONFIG.server_url + "/api/inquiries/:thing_id",
  //     { thing_id: '@thing_id'},
  //     { query: {method:"GET", isArray: false }
  //     });
  // }
})();
