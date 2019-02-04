
app.controller('modelCtrl', function($scope, $routeParams, customerSrv, projectSrv, modelSrv, $sce) {

    var isAppleArQuickLook = false;
    $scope.notFound = false;

    // Loading the model
    customerSrv.getActive().then(customer => {
        $scope.customer = customer;
        $scope.customerHref = "#!/";
        projectSrv.getByName(customer, $routeParams.projectName).then(project => {
            $scope.project = project;
            $scope.projectHref = "#!/" + project.techName;
            modelSrv.getByName(project, $routeParams.modelName).then(model => {
                $scope.model = model;
                //$scope.model.claraEmbedId = $sce.trustAsResourceUrl("https://clara.io/player/v2/" + $scope.model.claraId + "?tools=hide");
                $scope.model.embedURL = $sce.trustAsResourceUrl("embed/#!/" + $scope.model.id);
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