
var app = angular.module("arCloud", ['ngRoute', 'ngMeta']);

app.config(function ($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl: 'app/customer/customer.html',
      controller: 'customerCtrl'
    }).when('/:projectName', {
      templateUrl: 'app/project/project.html',
      controller: 'projectCtrl'
    }).when('/:projectName/:modelName', {
      templateUrl: 'app/model/model.html',
      controller: 'modelCtrl'
    }).when('/:projectName/:modelName/viewer', {
      templateUrl: 'app/model/viewerTest.html',
      controller: 'viewerTestCtrl'
    })
});

app.run(function(ngMeta) {
  ngMeta.init();
});

app.controller("mainCtrl", function ($scope, customerSrv, ngMeta) {
  customerSrv.getActive().then(customer => {
    $scope.title = customer.displayName + "'s 3D Library"
  });
})

