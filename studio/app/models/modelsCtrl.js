app.controller("modelsCtrl", function($scope, customerSrv, projectSrv, modelSrv) {

    $scope.models = [];
    $scope.project = [];
    $scope.filterProject = "";
    $scope.modelSearch = "";

    customerSrv.getActive().then(customer => {
        $scope.activeCustomer = customer

        // loading projects (categories) and models
        projectSrv.getByCustomer(customer).then(projects => {
            $scope.projects = projects;
            projects.forEach(project => {
                modelSrv.getByProject(project).then(models => {
                    $scope.models = $scope.models.concat(models);
                })
            })
        });
    });

    $scope.filterModels = function(model) {
        if ($scope.filterProject && model.projectId != $scope.filterProject) {
            return false;
        }

        if ($scope.modelSearch && !model.displayName.toLowerCase.includes($scope.modelSearch.toLowerCase())) {
            return false;
        }

        return true;
    }

});