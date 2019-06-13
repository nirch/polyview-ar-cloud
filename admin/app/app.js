
var app = angular.module("adminApp", []);

app.controller("adminCtrl", function($scope, customerSrv, projectSrv, modelSrv, $sce, environmentSrv) {

    $scope.envIntensity = 1;
    $scope.shadowIntensity = 0;
    $scope.stageLightIntensity = 1;
    $scope.bgColor = "#ffffff";
    $scope.selectedProject = null;
    $scope.selectedModel = null;
    $scope.selectedModelSecureUrl = null;
    $scope.projects = [];
    $scope.models = [];

    // Loading projects
    customerSrv.getActive().then(customer => {
        projectSrv.getByCustomer(customer).then(projects => {
            $scope.projects = projects;
            $scope.selectedProject = $scope.projects[0];
            $scope.onProjectSelected();
        });
    });

    // Loading environments
    environmentSrv.getEnvironments().then(environments => {
        $scope.environments = environments;
    })

    $scope.onProjectSelected = function() {
        modelSrv.getByProject($scope.selectedProject, false).then(models => {
            $scope.models = [];
            models.forEach(model => {
                if (model.gltfUrl) {
                    $scope.models.push(model);
                }
            });
            $scope.selectedModel = $scope.models[0];
            if ($scope.selectedModel) {
                $scope.onModelSelected();
            }
        });
    }

    $scope.onModelSelected = function() {
        $scope.selectedModelSecureUrl = $sce.trustAsResourceUrl($scope.selectedModel.gltfUrl);
    }

});