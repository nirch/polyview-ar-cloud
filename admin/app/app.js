
var app = angular.module("adminApp", []);

app.controller("adminCtrl", function($scope, customerSrv, projectSrv, modelSrv, $sce) {

    $scope.intensity = 1;
    $scope.bgColor = "#ffffff";
    $scope.selectedProject = null;
    $scope.selectedModel = null;
    $scope.selectedModelSecureUrl = null;
    $scope.projects = [];
    $scope.models = [];

    customerSrv.getActive().then(customer => {
        projectSrv.getByCustomer(customer).then(projects => {
            $scope.projects = projects;
        });
    });

    $scope.onProjectSelected = function() {
        modelSrv.getByProject($scope.selectedProject, false).then(models => {
            models.forEach(model => {
                if (model.gltfUrl) {
                    $scope.models.push(model);
                }
            });
        });
    }

    $scope.onModelSelected = function() {
        $scope.selectedModelSecureUrl = $sce.trustAsResourceUrl($scope.selectedModel.gltfUrl);
    }

});