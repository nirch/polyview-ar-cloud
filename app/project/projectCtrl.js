
app.controller('projectCtrl', function($scope, $rootScope, $routeParams, customerSrv, projectSrv, modelSrv, $location) {

    $scope.notFound = false;

    // Loading the project and models
    customerSrv.getActive().then(customer => {
        $rootScope.title = customer.displayName;
        projectSrv.getByName(customer, $routeParams.projectName).then(project => {
            $scope.project = project;
            $rootScope.title += " | " + project.displayName;
            modelSrv.getByProject(project).then(models => {
                $scope.models = models;
            })
        }, error => {
            if (error === 404) {
                $scope.notFound = true;
            }
        });
    });

    $scope.openModel = function(model) {
        $location.path("/" +  $routeParams.projectName + "/" + model.techName);
    }
})