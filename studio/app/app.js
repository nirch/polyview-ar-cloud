var app = angular.module("arCloudAdminApp", ["ngRoute", "ngImageInputWithPreview", "ui.bootstrap"]);

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