
var app = angular.module("embedApp", ["ngRoute"]);


app.config(function($routeProvider) {
    $routeProvider
    .when('/:modelId', {
      templateUrl: 'embed.html',
      controller: 'embedCtrl'
    });
});

app.controller("embedCtrl", function($scope, $sce) {
    $scope.claraEmbedURL = $sce.trustAsResourceUrl("https://clara.io/player/v2/a2c2f341-87c4-4204-bca9-738cebf62dc9?tools=hide");
});