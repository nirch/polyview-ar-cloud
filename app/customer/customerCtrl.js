
app.controller('customerCtrl', function($scope, customerSrv, projectSrv, $location) {

    customerSrv.getActive().then(customer => {
        $scope.customer = customer;

        projectSrv.getByCustomer(customer).then(projects => {
            $scope.projects = projects;
        });
    });

    $scope.openProject = function(project) {
        $location.path("/" + project.techName);
    }

})