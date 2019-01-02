
app.controller('projectCtrl', function($scope, $routeParams, customerSrv, projectsSrv) {

    customerSrv.getActive().then(customer => {
        //$scope.customer = customer;

        projectsSrv.getByCustomerAndProjectName(customer, $routeParams.projectName).then(project => {
            $scope.project = project;
        });
    });

})