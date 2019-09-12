app.controller("projectDetailsCtrl", function ($scope, customerSrv, projectSrv, $routeParams) {


    customerSrv.getActive().then(customer => {
        $scope.activeCustomer = customer

        projectSrv.getById($routeParams.id).then(project => {
            $scope.project = project;
        });
    });


});