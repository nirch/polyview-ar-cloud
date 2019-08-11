app.controller("modelDetailsCtrl", function ($scope, customerSrv, projectSrv, modelSrv, $routeParams) {

    $scope.selected = {};
    $scope.selected.project = null;
    $scope.projects = [];

    customerSrv.getActive().then(customer => {
        $scope.activeCustomer = customer

        modelSrv.getById($routeParams.id).then(model => {
            $scope.model = model;

            projectSrv.getByCustomer(customer).then(projects => {
                $scope.projects = projects;
                projects.forEach(project => {
                    if (project.id === model.projectId) {
                        $scope.selected.project = project;
                    }
                });
            });
        });
    });

    $scope.updateModel = function() {
        let params = {};

        if ($scope.selected.project.id != $scope.model.projectId) {
            params.updateProject = $scope.selected.project;
        }

        modelSrv.updateModel($scope.model, params).then(model => {
            console.log("settings saved successfully");

            $scope.model = model;
            $scope.projects.forEach(project => {
                if (project.id === model.projectId) {
                    $scope.selected.project = project;
                }
            });

        }, function (err) {
            console.error(err);
            console.log("error in saving settings");
        });
    }
});