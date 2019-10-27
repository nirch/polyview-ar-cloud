
var app = angular.module("arCloud", ['ngRoute']);

app.config(function ($routeProvider, $locationProvider) {
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

    $locationProvider.html5Mode(true);
});

app.controller("mainCtrl", function ($scope, customerSrv, $location) {
  customerSrv.getActive().then(customer => {
    console.log(customer);
    $scope.title = customer.displayName + "'s 3D Library"
  });
})

