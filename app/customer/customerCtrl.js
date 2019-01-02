
app.controller('customerCtrl', function($scope, customerSrv, projectsSrv, $location) {

    customerSrv.getActive().then(customer => {
        $scope.customer = customer;

        projectsSrv.getByCustomer(customer).then(projects => {
            $scope.projects = projects;
        });
    });

    $scope.openProject = function(project) {
        $location.path("/" + project.techName);
    }

})