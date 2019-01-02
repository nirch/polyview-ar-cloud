
app.controller('projectCtrl', function($scope, $routeParams, customerSrv, projectSrv, modelSrv) {

    customerSrv.getActive().then(customer => {
        //$scope.customer = customer;

        projectSrv.getByName(customer, $routeParams.projectName).then(project => {
            $scope.project = project;

            modelSrv.getByProject(project).then(models => {
                $scope.models = models;
            })
        });
    });

})