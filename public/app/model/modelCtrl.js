
app.controller('modelCtrl', function($scope, $routeParams, customerSrv, projectSrv, modelSrv, $sce, $document, $location, $rootScope) {

    $scope.notFound = false;

    // Loading the model
    customerSrv.getActive().then(customer => {
        $scope.customer = customer;
        $scope.customerHref = "/";
        projectSrv.getByName(customer, $routeParams.projectName).then(project => {
            $scope.project = project;
            $scope.projectHref = "/" + project.techName;
            modelSrv.getByName(project, $routeParams.modelName).then(model => {
                $scope.model = model;

                // dynamic meta tags
                $rootScope.metaDesc = project.displayName + " / " + model.displayName;
                $rootScope.metaThumb = model.thumbnailUrl;
                $rootScope.metaURL = `https://${customer.techName}.polyview3d.com/${project.techName}/${model.techName}`;
            
                if ($location.search().polyviewer) {
                    $scope.model.embedURL = $sce.trustAsResourceUrl("embed/#!/" + $scope.model.id + "?polyviewer");
                } else {
                    $scope.model.embedURL = $sce.trustAsResourceUrl("embed/#!/" + $scope.model.id + "?fullscreen");
                }

                $document.ready(function() {
                    // Enabling tooltips
                    $('[data-toggle="tooltip"]').tooltip(); 
                });

                // page view
                gtag('config', 'UA-115185862-2', {
                    'page_title' : $scope.customer.displayName + " | " + $scope.project.displayName + " | " + $scope.model.displayName,
                    'page_path': "/" + $scope.customer.techName + "/" + $scope.project.techName + "/" + $scope.model.techName
                });

            }, error => {
                if (error === 404) {
                    $scope.notFound = true;
                }
            });
        }, error => {
            if (error === 404) {
                $scope.notFound = true;
            }
        });
    });
})