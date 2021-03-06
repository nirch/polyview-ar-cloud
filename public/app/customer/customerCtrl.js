
app.controller('customerCtrl', function($scope, customerSrv, projectSrv, $location, $rootScope) {

    customerSrv.getActive().then(customer => {
        $scope.customer = customer;

        // dynamic meta tags
        $rootScope.metaDesc = "";
        $rootScope.metaThumb = customer.logoUrl;
        $rootScope.metaURL = `https://${customer.techName}.polyview3d.com`;

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