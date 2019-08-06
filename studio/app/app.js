var app = angular.module("arCloudAdminApp", ["ngRoute", "ngImageInputWithPreview"]);

app.config(function($routeProvider) {
    $routeProvider.
    when("/models", {
        templateUrl: "app/models/models.html",
        controller: "modelsCtrl"
    }).when("/models/:id" , {
        templateUrl: "app/models/modelDetails.html",
        controller: "modelDetailsCtrl"
    })
})