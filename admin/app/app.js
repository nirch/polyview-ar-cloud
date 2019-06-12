
var app = angular.module("adminApp", []);

app.controller("adminCtrl", function($scope, customerSrv, projectSrv, modelSrv) {

    $scope.intensity = 1;
    $scope.bgColor = "#ffffff";
    $scope.selectedProject = null;
    $scope.selectedModel = null;

    customerSrv.getActive().then(customer => {
        projectSrv.getByCustomer(customer).then(projects => {
            $scope.projects = projects;
        });
    });

    $scope.onProjectSelected = function() {
        modelSrv.getByProject($scope.selectedProject, false).then(models => {
            $scope.models = models;
        });
    }

    $scope.onModelSelected = function() {
        alert($scope.selectedModel.displayName);
    }

});