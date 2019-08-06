app.controller("mainCtrl", function($scope, customerSrv, $location) {

    customerSrv.getActive().then(customer => {
        $scope.activeCustomer = customer
        if($location.path() === "") {
            $location.path("/models");
        }
    });

});