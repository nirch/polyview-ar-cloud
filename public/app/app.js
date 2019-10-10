
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

app.controller("mainCtrl", function ($scope, customerSrv, $location) {

  let host = $location.host();
  let subdomain = host.indexOf('.') > 0 ? host.split('.')[0] : "";
  let subdomainCapitalized = subdomain.charAt(0).toUpperCase() + subdomain.slice(1);
  $scope.title = subdomainCapitalized + "'s 3D Library";
  $scope.metaThumb = `https://${$location.host()}/assets/images/3d-modeling-icon-6.jpg`

  customerSrv.getActive().then(customer => {
    console.log(customer);
    // $scope.title = customer.displayName + "'s 3D Library"
  });
})

