
app.controller('modelCtrl', function($scope, $routeParams, customerSrv, projectSrv, modelSrv) {
    $scope.page = "Model Page"

    // Loading the model
    customerSrv.getActive().then(customer => {
        projectSrv.getByName(customer, $routeParams.projectName).then(project => {
            modelSrv.getByName(project, $routeParams.modelName).then(model => {
                $scope.model = model;
            })
        });
    });
})