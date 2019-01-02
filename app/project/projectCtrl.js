
app.controller('projectCtrl', function($scope, $routeParams, customerSrv, projectSrv, modelSrv, $location) {

    // Loading the project and models
    customerSrv.getActive().then(customer => {
        projectSrv.getByName(customer, $routeParams.projectName).then(project => {
            $scope.project = project;
            modelSrv.getByProject(project).then(models => {
                $scope.models = models;
            })
        });
    });

    $scope.openModel = function(model) {
        $location.path("/" +  $routeParams.projectName + "/" + model.techName);
    }
})