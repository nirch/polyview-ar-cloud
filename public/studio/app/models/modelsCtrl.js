app.controller("modelsCtrl", function ($scope, customerSrv, projectSrv, modelSrv, $uibModal, $location) {

    $scope.models = [];
    $scope.project = [];
    $scope.filterProject = "";
    $scope.modelSearch = "";

    customerSrv.getActive().then(customer => {
        $scope.activeCustomer = customer

        // loading projects (categories) and models
        projectSrv.getByCustomer(customer, false).then(projects => {
            $scope.projects = projects;
            projects.forEach(project => {
                modelSrv.getByProject(project, false).then(models => {
                    $scope.models = $scope.models.concat(models);
                })
            })
        });
    });

    $scope.filterModels = function (model) {
        if ($scope.filterProject && model.projectId != $scope.filterProject) {
            return false;
        }

        if ($scope.modelSearch && !model.displayName.toLowerCase().includes($scope.modelSearch.toLowerCase())) {
            return false;
        }

        return true;
    }

    $scope.newModel = function () {
        // Opening new model modal
        let modalInstance = $uibModal.open({
            templateUrl: 'app/models/newModel.html',
            controller: 'newModelCtrl',
            size: 'lg'
        });

        // Waiting for a result from the modal
        modalInstance.result.then(function (newModel) {
            // navigating to the new model's page
            $location.path("/models/" + newModel.id);
        }, function () {
            console.log("new model canceled");
        });
    }

});