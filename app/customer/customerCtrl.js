
app.controller('customerCtrl', function($scope, $rootScope, customerSrv, projectSrv, $location) {

    customerSrv.getActive().then(customer => {
        $scope.customer = customer;
        $rootScope.title = customer.displayName;
        projectSrv.getByCustomer(customer).then(projects => {
            $scope.projects = projects;
        });
    });

    $scope.openProject = function(project) {
        $location.path("/" + project.techName);
    }

})