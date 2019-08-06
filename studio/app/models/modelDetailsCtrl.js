app.controller("modelDetailsCtrl", function ($scope, customerSrv, projectSrv, modelSrv, $routeParams) {

    $scope.selectedProject = null;
    $scope.projects = [];

    customerSrv.getActive().then(customer => {
        $scope.activeCustomer = customer

        modelSrv.getById($routeParams.id).then(model => {
            $scope.model = model;

            projectSrv.getByCustomer(customer).then(projects => {
                $scope.projects = projects;
                projects.forEach(project => {
                    if (project.id === model.projectId) {
                        $scope.selectedProject = project;
                    }
                })
            });
        });
    });

    $scope.updateModel = function() {
        let params = {};

        if ($scope.selectedProject.id != $scope.model.projectId) {
            params.updateProject = $scope.selectedProject;
        }

        modelSrv.updateModel($scope.model, params).then(model => {
            console.log("settings saved successfully");
        }, function (err) {
            console.error(err);
            console.log("error in saving settings");
        });
    }

    $scope.bla = function() {
        // alert($scope.selectedProject.displayName);
    }
});