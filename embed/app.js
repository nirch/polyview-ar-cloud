
var app = angular.module("embedApp", ["ngRoute"]);


app.config(function($routeProvider) {
    $routeProvider
    .when('/:modelId', {
      templateUrl: 'embed.html',
      controller: 'embedCtrl'
    });
});

app.controller("embedCtrl", function($scope, $sce, $routeParams, modelSrv) {

    modelSrv.getById($routeParams.modelId).then(model => {
        $scope.model = model;
        $scope.model.claraEmbedId = $sce.trustAsResourceUrl("https://clara.io/player/v2/" + $scope.model.claraId + "?tools=hide");
    });


    
});