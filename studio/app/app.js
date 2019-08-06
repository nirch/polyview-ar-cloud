var app = angular.module("arCloudAdminApp", ["ngRoute"]);

app.config(function($routeProvider) {
    $routeProvider.
    when("/models", {
        templateUrl: "app/models/models.html",
        controller: "modelsCtrl"
    })
})