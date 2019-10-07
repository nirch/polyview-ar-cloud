
var app = angular.module("arCloud", ['ngRoute']);

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

app.controller("mainCtrl", function ($scope, customerSrv) {
  customerSrv.getActive().then(customer => {
    $scope.title = customer.displayName + "'s 3D Library"
  });
})

