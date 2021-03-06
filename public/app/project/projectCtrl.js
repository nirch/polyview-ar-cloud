
app.controller('projectCtrl', function($scope, $routeParams, customerSrv, projectSrv, modelSrv, $location, $rootScope) {

    $scope.notFound = false;

    // Loading the project and models
    customerSrv.getActive().then(customer => {
        $scope.customer = customer;
        $scope.customerHref= "/";
        projectSrv.getByName(customer, $routeParams.projectName).then(project => {
            $scope.project = project;

            // dynamic meta tags
            $rootScope.metaDesc = project.displayName + " Category"
            $rootScope.metaThumb = project.thumbnailUrl;
            $rootScope.metaURL = `https://${customer.techName}.polyview3d.com/${project.techName}`;

        modelSrv.getByProject(project).then(models => {
                $scope.models = models;
            });

            // page view
            gtag('config', 'UA-115185862-2', {
                'page_title' : $scope.customer.displayName + " | " + $scope.project.displayName +  " 3D Gallery",
                'page_path': "/" + $scope.customer.techName + "/" + $scope.project.techName
            });

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