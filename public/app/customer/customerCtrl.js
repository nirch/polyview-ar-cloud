
app.controller('customerCtrl', function($scope, customerSrv, projectSrv, $location, $rootScope) {

    $rootScope.metaURL = $location.absUrl();

    customerSrv.getActive().then(customer => {
        $scope.customer = customer;

        projectSrv.getByCustomer(customer).then(projects => {
            $scope.projects = projects;
        });

        // page view
        gtag('config', 'UA-115185862-2', {
            'page_title' : $scope.customer.displayName + " 3D Gallery",
            'page_path': "/" + $scope.customer.techName
        });

    });

    $scope.openProject = function(project) {
        $location.path("/" + project.techName);
    }

})