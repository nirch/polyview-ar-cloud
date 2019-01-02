
app.controller('customerCtrl', function($scope, customerSrv, projectsSrv) {

    customerSrv.getActive().then(customer => {
        $scope.customer = customer;

        projectsSrv.getByCustomer(customer).then(projects => {
            $scope.projects = projects;
        });
    });

})